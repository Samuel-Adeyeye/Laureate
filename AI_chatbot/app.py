# app.py
import base64
import httpx
from io import BytesIO
from typing import Dict, List, Any
from fastapi import FastAPI, Request, Response, HTTPException, BackgroundTasks
import os
import logging
from contextlib import asynccontextmanager
import json
from dotenv import load_dotenv
from collections import deque # Import deque for our message cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# ---------- WhatsApp credentials ----------
WHATSAPP_TOKEN           = os.getenv("WHATSAPP_TOKEN")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_VERIFY_TOKEN    = os.getenv("WHATSAPP_VERIFY_TOKEN")

# --- NEW: A cache to store the IDs of messages we've already processed ---
# We use a deque with a max length to automatically keep it from growing too large.
processed_message_ids = deque(maxlen=100)

# ---------- agent singleton ----------
tutor_agent: Any = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global tutor_agent
    # Lazily import the agent to avoid circular dependency issues
    from agent import WhatsappAgent
    logger.info("Initializing WhatsappAgent (LAUREATE)...")
    try:
        tutor_agent = WhatsappAgent()
        await tutor_agent.initialize()
        logger.info("WhatsappAgent (LAUREATE) initialized successfully!")
    except Exception as e:
        logger.error(f"Failed to initialize WhatsappAgent agent: {e}")
        tutor_agent = None
    yield
    logger.info("Cleaning up tutor agent...")
    if tutor_agent:
        await tutor_agent.cleanup()

app = FastAPI(title="WhatsApp Agent", lifespan=lifespan)

# ---------- Messaging Helpers (with added error handling) ----------
FB_BASE = f"https://graph.facebook.com/v20.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
HEADERS = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}

async def send_message(payload: Dict[str, Any]):
    """A single, robust function to send messages to WhatsApp."""
    try:
        async with httpx.AsyncClient() as client:
            r = await client.post(FB_BASE, headers=HEADERS, json=payload, timeout=15.0)
            r.raise_for_status() # Raises an exception for 4xx/5xx responses
    except httpx.ConnectTimeout:
        logger.error("Connection to WhatsApp timed out.")
    except httpx.HTTPStatusError as e:
        logger.error(f"Error sending message to WhatsApp: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        logger.error(f"An unexpected error occurred while sending message: {e}")

async def send_text(to: str, text: str):
    await send_message({"messaging_product": "whatsapp", "to": to, "type": "text", "text": {"body": text}})

async def send_buttons(to: str, body: str, buttons: List[str]):
    payload = {
        "messaging_product": "whatsapp", "to": to, "type": "interactive",
        "interactive": {
            "type": "button", "body": {"text": body},
            "action": {"buttons": [{"type": "reply", "reply": {"id": f"btn_{i}", "title": b}} for i, b in enumerate(buttons[:3])]}
        }
    }
    await send_message(payload)

async def send_list(to: str, data: Dict[str, Any]):
    rows = [{"id": f"opt_{i}", "title": opt[:24], "description": ""} for i, opt in enumerate(data["options"])]
    payload = {
        "messaging_product": "whatsapp", "to": to, "type": "interactive",
        "interactive": {
            "type": "list", "header": {"type": "text", "text": data["header"][:60]},
            "body": {"text": data["body"][:1024]}, "action": { "button": data["button_text"][:20],
            "sections": [{"title": data["section_title"][:24], "rows": rows}]}
        }
    }
    await send_message(payload)

# ---------- Background Task ----------
async def process_message(data: Dict[str, Any]):
    if not tutor_agent:
        logger.error("Agent not initialized, skipping message processing.")
        return

    entry = data.get("entry", [{}])[0].get("changes", [{}])[0].get("value", {})
    msgs = entry.get("messages", [])
    if not msgs:
        # This could be a status update, not a message.
        return

    msg = msgs[0]
    from_num = msg["from"]
    thread_id = from_num.replace("+", "")
    user_name = entry.get("contacts", [{}])[0].get("profile", {}).get("name", "there")

    content_for_agent = []
    msg_type = msg.get("type")
    user_input = ""

    if msg_type == "interactive":
        interactive_type = msg["interactive"]["type"]
        if interactive_type == "button_reply":
            user_input = msg["interactive"]["button_reply"]["title"]
        elif interactive_type == "list_reply":
            user_input = msg["interactive"]["list_reply"]["title"]
    elif msg_type == "text":
        user_input = msg["text"]["body"]
    else:
        return

    if user_input:
        content_for_agent.append({"type": "text", "text": f"[name:{user_name}] {user_input}"})

    if not content_for_agent:
        return

    result = await tutor_agent.get_response(content_for_agent, thread_id)
    text = result.get("text")
    buttons = result.get("buttons")
    list_data = result.get("list")

    if list_data:
        await send_list(from_num, list_data)
    elif text:
        if buttons:
            await send_buttons(from_num, text, buttons)
        else:
            await send_text(from_num, text)

# ---------- Webhook with Deduplication Logic ----------
@app.api_route("/whatsapp", methods=["GET", "POST"])
async def whatsapp_handler(request: Request, background_tasks: BackgroundTasks):
    if request.method == "GET":
        # ... (verification handshake remains the same)
        params = request.query_params
        if params.get("hub.verify_token") == WHATSAPP_VERIFY_TOKEN:
            return Response(content=params["hub.challenge"], status_code=200)
        return Response(content="Verification token mismatch", status_code=403)

    data = await request.json()
    
    # --- DEDUPLICATION LOGIC STARTS HERE ---
    try:
        msg = data["entry"][0]["changes"][0]["value"]["messages"][0]
        msg_id = msg["id"]
        
        if msg_id in processed_message_ids:
            # If we've seen this message ID before, ignore it.
            logger.info(f"Ignoring duplicate message ID: {msg_id}")
            return Response(status_code=200)
        
        # If it's a new message, add its ID to our cache.
        processed_message_ids.append(msg_id)
    except (KeyError, IndexError):
        # Not a standard message payload, might be a status update. Ignore it.
        logger.info("Received a non-message webhook payload.")
        return Response(status_code=200)
    # --- DEDUPLICATION LOGIC ENDS HERE ---

    background_tasks.add_task(process_message, data)
    return Response(status_code=200)

# ... (misc endpoints remain the same)
@app.get("/")
async def root(): return {"message": "LAUREATE WhatsApp Agent is running!"}

@app.get("/health")
async def health(): return {"status": "healthy", "agent": bool(tutor_agent)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", 4000)))