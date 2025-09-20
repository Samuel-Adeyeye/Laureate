# agent.py
import os
import logging
from typing import Any, Dict, List

from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from prompt import AGENT_PROMPT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _get_llm() -> ChatGroq:
    """Return a streaming Groq chat model."""
    # Using the specific model and provider you requested
    return ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model="meta-llama/llama-4-scout-17b-16e-instruct", # A powerful and commonly available Groq model
        temperature=0.1,
    )


class WhatsappAgent:
    """WhatsApp agent with memory and DSL support for buttons and lists."""

    def __init__(self) -> None:
        self.memory = MemorySaver()
        self.llm = _get_llm()
        self.agent = None

    async def initialize(self) -> None:
        try:
            logger.info("Initializing LAUREATE Agent (tool-less)...")
            self.agent = create_react_agent(
                model=self.llm, tools=[],
                prompt=AGENT_PROMPT.render(),
                checkpointer=self.memory,
            )
            logger.info("WhatsappAgent (LAUREATE) is ready.")
        except Exception as e:
            logger.error(f"Agent initialization failed: {e}", exc_info=True)

    async def cleanup(self) -> None:
        logger.info("Cleaning up WhatsappAgent...")
        self.agent = None

    async def get_response(self, content: Any, thread_id: str) -> Dict[str, Any]:
        """
        Returns: {"text": str | None, "buttons": List | None, "list": Dict | None}
        Parses DSL for __LIST__ and __BUTTONS__ from the LLM response.
        """
        if not self.agent:
            raise RuntimeError("Agent not initialized. Call initialize() first.")

        cfg = {"configurable": {"thread_id": thread_id}, "recursion_limit": 100}
        from langchain_core.messages import HumanMessage

        message = HumanMessage(content=content)
        response_content = ""
        async for event in self.agent.astream_events({"messages": [message]}, cfg, version="v1"):
            if event["event"] == "on_chat_model_stream":
                chunk = event["data"]["chunk"].content or ""
                response_content += chunk

        # --- NEW: Parse __LIST__ or __BUTTONS__ ---
        if "__LIST__" in response_content:
            try:
                # No text part for lists, just the list payload
                _, list_dsl = response_content.split("__LIST__", 1)
                parts = [p.strip() for p in list_dsl.split("|")]
                if len(parts) == 5:
                    options = [opt.strip() for opt in parts[4].split(",")]
                    return {"list": {
                        "button_text": parts[0], "header": parts[1],
                        "body": parts[2], "section_title": parts[3],
                        "options": options
                    }}
            except Exception as e:
                logger.error(f"Failed to parse __LIST__ DSL: {e}")
                return {"text": "Sorry, I had trouble formatting the question. Let's try another one."}

        if "__BUTTONS__" in response_content:
            text, button_line = response_content.split("__BUTTONS__", 1)
            buttons = [b.strip() for b in button_line.split(",") if b.strip()]
            return {"text": text.strip(), "buttons": buttons}

        if not response_content:
            return {"text": "How else can I assist you?"}

        return {"text": response_content.strip()}

# def _get_llm() -> ChatGroq:
#     """Return a streaming Groq chat model."""
#     # Using the specific model and provider you requested
#     return ChatGroq(
#         api_key=os.getenv("GROQ_API_KEY"),
#         model="meta-llama/llama-4-scout-17b-16e-instruct", # A powerful and commonly available Groq model
#         temperature=0.1,
#     )

