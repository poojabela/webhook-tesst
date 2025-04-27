'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  MagnifyingGlassIcon, 
  TrashIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useSocket } from '@/app/lib/useSocket';
import JsonViewer from './JsonViewer';
import { storageUtils } from '@/app/lib/storageUtils';

export default function WebhookRequestList({ webhookId }) {
  const [requests, setRequests] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filter, setFilter] = useState(null);
  const { newRequest, isConnected } = useSocket(webhookId);

  // Determine if there are any requests with query params
  const queryParams = requests.some(request => 
    request.query && Object.keys(request.query).length > 0
  );

  // Initial data fetch
  useEffect(() => {
    if (!webhookId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // First check local storage
        const cachedRequests = storageUtils.getHistoryForWebhook(webhookId);
        if (cachedRequests && cachedRequests.length > 0) {
          setRequests(cachedRequests);
          setLoading(false);
        }
        
        // Then fetch from API for latest data
        const response = await fetch(`/api/webhook/${webhookId}/requests`);
        const data = await response.json();
        const apiRequests = data.requests || [];
        
        // Update requests and save to local storage
        setRequests(apiRequests);
        storageUtils.saveHistory(webhookId, apiRequests);
      } catch (error) {
        console.error('Error fetching webhook requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [webhookId]);

  // Handle real-time updates
  useEffect(() => {
    if (newRequest && webhookId) {
      setRequests(prev => {
        const updatedRequests = [newRequest, ...prev];
        // Save to local storage
        storageUtils.saveHistory(webhookId, updatedRequests);
        return updatedRequests;
      });
    }
  }, [newRequest, webhookId]);

  const toggleExpand = (index) => {
    setExpandedRequest(expandedRequest === index ? null : index);
    // Initialize active tab for this request if not set
    if (!activeTabs[index]) {
      setActiveTabs(prev => ({...prev, [index]: 'headers'}));
    }
  };

  const setActiveTab = (index, tab) => {
    setActiveTabs(prev => ({...prev, [index]: tab}));
  };

  // Clear all requests
  const handleClearRequests = () => {
    if (confirm('Are you sure you want to clear all requests?')) {
      storageUtils.clearHistory(webhookId);
      setRequests([]);
    }
  };

  // Get request badge class based on method
  const getMethodBadgeClass = (method) => {
    const methodLower = method?.toLowerCase() || 'get';
    const methodClasses = {
      get: 'bg-blue-500/20 text-blue-500',
      post: 'bg-green-500/20 text-green-500',
      put: 'bg-yellow-500/20 text-yellow-500',
      delete: 'bg-red-500/20 text-red-500',
      patch: 'bg-purple-500/20 text-purple-500'
    };
    
    return methodClasses[methodLower] || 'bg-gray-500/20 text-gray-500';
  };

  // Filter requests based on search and method filter
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(request).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = filterMethod === 'all' || 
      (request.method && request.method.toLowerCase() === filterMethod.toLowerCase());
    
    return matchesSearch && matchesMethod;
  });

  if (loading) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 p-4 animate-pulse">
        <div className="h-3 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 bg-white/5 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white/80">Webhook Requests</h2>
        {requests.length > 0 && (
          <button 
            onClick={handleClearRequests}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 text-red-400/80 hover:text-red-400 transition-colors text-xs"
          >
            <TrashIcon className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>
      
      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 bg-black/40 border border-white/5 rounded-md text-xs text-white/80 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/30 w-3.5 h-3.5" />
        </div>
        
        <div className="relative">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="appearance-none w-36 p-2 pl-8 bg-black/40 border border-white/5 rounded-md text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          >
            <option value="all">All Methods</option>
            <option value="get">GET</option>
            <option value="post">POST</option>
            <option value="put">PUT</option>
            <option value="delete">DELETE</option>
            <option value="patch">PATCH</option>
          </select>
          <FunnelIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/30 w-3.5 h-3.5" />
        </div>
      </div>
      
      {/* Status tabs */}
      <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 px-1 py-1 mb-6">
        <div className="flex space-x-1">
          <button
            onClick={() => setFilter(null)}
            className={`${
              filter === null
                ? 'text-white font-medium relative'
                : 'text-white/60 hover:text-white/80'
            } px-4 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none`}
          >
            All
            {filter === null && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`${
              filter === 'success'
                ? 'text-white font-medium relative'
                : 'text-white/60 hover:text-white/80'
            } px-4 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none`}
          >
            Success
            {filter === 'success' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setFilter('error')}
            className={`${
              filter === 'error'
                ? 'text-white font-medium relative'
                : 'text-white/60 hover:text-white/80'
            } px-4 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none`}
          >
            Error
            {filter === 'error' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-red-500 rounded-full" />
            )}
          </button>
          {queryParams && (
            <button
              onClick={() => setFilter('query')}
              className={`${
                filter === 'query'
                  ? 'text-white font-medium relative'
                  : 'text-white/60 hover:text-white/80'
              } px-4 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none`}
            >
              Query
              {filter === 'query' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-6 text-white/40 text-xs border border-white/5 rounded bg-black/50">
          {requests.length === 0 ? 
            "No webhook requests yet. Generate a webhook URL and send a request to it." : 
            "No matching requests found."}
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredRequests.map((request, index) => (
            <div 
              key={index}
              className="border border-white/5 rounded bg-black/40 overflow-hidden"
            >
              {/* Request Header */}
              <div 
                onClick={() => toggleExpand(index)}
                className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-black/60 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${getMethodBadgeClass(request.method)}`}>
                    {request.method || 'GET'}
                  </span>
                  <span className="text-xs text-white/70 truncate max-w-[280px]">
                    {request.path || '/'}
                  </span>
                </div>
                <div className="flex items-center text-[10px] text-white/40">
                  <span>{format(new Date(request.timestamp || Date.now()), 'HH:mm:ss')}</span>
                  {expandedRequest === index ? 
                    <ChevronUpIcon className="ml-1 w-3.5 h-3.5" /> : 
                    <ChevronDownIcon className="ml-1 w-3.5 h-3.5" />
                  }
                </div>
              </div>
              
              {/* Request Details */}
              {expandedRequest === index && (
                <div className="border-t border-white/5 bg-black/60">
                  {/* Tabs */}
                  <div className="flex border-b border-white/5 bg-black/30">
                    <button
                      className={`px-4 py-2 text-[11px] font-medium transition-all relative ${
                        activeTabs[index] === 'headers' 
                          ? 'text-white' 
                          : 'text-white/40 hover:text-white/70'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(index, 'headers');
                      }}
                    >
                      Headers
                      {activeTabs[index] === 'headers' && (
                        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-400 to-indigo-500"></span>
                      )}
                    </button>
                    
                    <button
                      className={`px-4 py-2 text-[11px] font-medium transition-all relative ${
                        activeTabs[index] === 'body' 
                          ? 'text-white' 
                          : 'text-white/40 hover:text-white/70'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(index, 'body');
                      }}
                    >
                      Body
                      {activeTabs[index] === 'body' && (
                        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-400 to-indigo-500"></span>
                      )}
                    </button>
                    
                    {request.query && Object.keys(request.query).length > 0 && (
                      <button
                        className={`px-4 py-2 text-[11px] font-medium transition-all relative ${
                          activeTabs[index] === 'query' 
                            ? 'text-white' 
                            : 'text-white/40 hover:text-white/70'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(index, 'query');
                        }}
                      >
                        Query
                        {activeTabs[index] === 'query' && (
                          <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-400 to-indigo-500"></span>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    {activeTabs[index] === 'headers' && (
                      <JsonViewer json={request.headers || {}} />
                    )}
                    
                    {activeTabs[index] === 'body' && (
                      request.body && Object.keys(request.body).length > 0 ? (
                        <JsonViewer json={request.body} />
                      ) : (
                        <div className="text-center py-3 text-white/40 text-xs bg-black/30 rounded">
                          No body content
                        </div>
                      )
                    )}
                    
                    {activeTabs[index] === 'query' && (
                      <JsonViewer json={request.query || {}} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}