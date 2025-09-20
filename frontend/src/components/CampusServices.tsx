import React, { useState } from 'react';
import { MapPin, Bell, CreditCard, Calendar, ExternalLink, Navigation, AlertCircle, Info } from 'lucide-react';
import { CampusService } from '../types';

interface CampusServicesProps {
  services: CampusService[];
}

const CampusServices: React.FC<CampusServicesProps> = ({ services }) => {
  const [activeTab, setActiveTab] = useState('announcements');

  const announcements = services.filter(service => service.type === 'announcement');
  const feeReminders = services.filter(service => service.type === 'fee');
  const locations = services.filter(service => service.type === 'location');

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
    { id: 'fees', label: 'Fee Reminders', icon: CreditCard, count: feeReminders.length },
    { id: 'locations', label: 'Campus Map', icon: MapPin, count: locations.length }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low': return <Info className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1A282E] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Campus Services
        </h1>
        <p className="text-[#5C6A71]">
          Stay updated with announcements, payments, and campus navigation
        </p>
      </div>

      {/* Service Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative min-w-0 flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#069D73] text-[#069D73] bg-[#B5F0DF]'
                      : 'border-transparent text-[#5C6A71] hover:text-[#069D73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                        activeTab === tab.id ? 'bg-[#069D73] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#5C6A71]">No announcements at this time</p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(announcement.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getPriorityIcon(announcement.priority)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#1A282E]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {announcement.title}
                          </h3>
                          <span className="text-sm text-[#5C6A71]">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[#5C6A71] mb-3">{announcement.description}</p>
                        {announcement.actionRequired && (
                          <button className="bg-[#069D73] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3EC9A0] transition-colors">
                            Take Action
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Fee Reminders Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              {feeReminders.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#5C6A71]">No pending fee payments</p>
                </div>
              ) : (
                feeReminders.map((fee) => (
                  <div
                    key={fee.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(fee.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <CreditCard className="w-5 h-5 text-[#FFD542] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#1A282E]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {fee.title}
                          </h3>
                          <span className="text-sm text-red-600 font-medium">
                            Due: {new Date(fee.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[#5C6A71] mb-3">{fee.description}</p>
                        <div className="flex space-x-3">
                          <button className="bg-[#069D73] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3EC9A0] transition-colors">
                            Pay Now
                          </button>
                          <button className="border border-gray-300 text-[#5C6A71] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Campus Map Tab */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-[#5C6A71]">No locations available</p>
                  </div>
                ) : (
                  locations.map((location) => (
                    <div key={location.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-[#069D73] flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1A282E] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {location.title}
                          </h3>
                          <p className="text-[#5C6A71] text-sm mb-3">{location.description}</p>
                          {location.location && (
                            <div className="flex space-x-2">
                              <a
                                href={location.location.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 bg-[#069D73] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#3EC9A0] transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>View on Map</span>
                              </a>
                              <button className="flex items-center space-x-1 border border-gray-300 text-[#5C6A71] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Navigation className="w-4 h-4" />
                                <span>Directions</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Access Locations */}
              <div>
                <h3 className="text-lg font-semibold text-[#1A282E] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Quick Access Locations
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Library', icon: '📚' },
                    { name: 'Student Affairs', icon: '🏢' },
                    { name: 'Cafeteria', icon: '🍽️' },
                    { name: 'Health Center', icon: '🏥' },
                    { name: 'IT Center', icon: '💻' },
                    { name: 'Sports Complex', icon: '⚽' },
                    { name: 'Parking', icon: '🚗' },
                    { name: 'Security', icon: '🛡️' }
                  ].map((location, index) => (
                    <button
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#069D73] hover:bg-[#B5F0DF] transition-colors text-center"
                    >
                      <div className="text-2xl mb-1">{location.icon}</div>
                      <div className="text-sm font-medium text-[#1A282E]">{location.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Emergency Contact
            </h3>
            <p className="text-red-100">Campus Security: +234 800 UNILAG1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusServices;