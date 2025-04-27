'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Simplified hook for real-time webhook updates using polling
 */
export function useSocket(webhookId) {
  const [isConnected, setIsConnected] = useState(true);
  const [newRequest, setNewRequest] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const lastTimestamp = useRef(new Date().toISOString());
  const pollingIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Set up polling for new webhook requests
  useEffect(() => {
    if (!webhookId) return;

    let isMounted = true;
    setIsConnected(true);

    const fetchData = async () => {
      // Cancel any previous in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      try {
        // Add timeout and error handling
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        }, 5000); // 5 second timeout
        
        const response = await fetch(`/api/webhook/${webhookId}/requests`, {
          signal: abortControllerRef.current.signal,
          // Add cache control to avoid stale data
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!isMounted) return;
        
        // Check if we have new requests
        const requests = data.requests || [];
        if (requests.length > 0) {
          // Find the most recent request that's newer than our last tracked timestamp
          const newRequests = requests.filter(req => 
            new Date(req.timestamp) > new Date(lastTimestamp.current)
          );
          
          if (newRequests.length > 0) {
            // Sort by timestamp (newest first) and get the most recent
            newRequests.sort((a, b) => 
              new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            const latestRequest = newRequests[0];
            lastTimestamp.current = latestRequest.timestamp;
            setNewRequest(latestRequest);
          }
        }
        
        // Reset error count on successful request
        if (errorCount > 0) {
          setErrorCount(0);
        }
        setIsConnected(true);
      } catch (error) {
        // Ignore aborted requests
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        
        console.error('Error polling webhook requests:', error);
        if (isMounted) {
          setErrorCount(prev => prev + 1);
          // If we've had several errors in a row, show as disconnected
          if (errorCount > 2) {
            setIsConnected(false);
          }
          
          // Implement exponential backoff for retries
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            const backoffTime = Math.min(2000 * (2 ** Math.min(errorCount, 5)), 30000); // Max 30 seconds
            pollingIntervalRef.current = setTimeout(fetchData, backoffTime);
          }
        }
      }
    };

    // Initial fetch
    fetchData();
    
    // Start polling at shorter interval for demo purposes
    pollingIntervalRef.current = setInterval(fetchData, 2000);

    return () => {
      isMounted = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [webhookId, errorCount]);

  return {
    isConnected,
    newRequest
  };
} 