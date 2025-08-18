export default async function handler(req, res) {
  const url = 'https://zanalyzer.fly.dev/auth/signup';
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    console.log(`Proxying ${req.method} request to: ${url}`);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Zlyzer-Frontend/1.0',
    };
    
    // Forward authorization header
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    
    // Forward all relevant headers
    if (req.headers['x-session-id']) {
      headers['x-session-id'] = req.headers['x-session-id'];
    }
    
    if (req.headers['user-agent']) {
      headers['User-Agent'] = req.headers['user-agent'];
    }
    
    const fetchOptions = {
      method: req.method,
      headers,
    };
    
    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(url, fetchOptions);
    
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    
    // Set the status first
    res.status(response.status);
    
    // Handle different content types
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('JSON response data:', data);
      res.json(data);
    } else {
      const text = await response.text();
      console.log('Text response data:', text);
      
      // Try to parse as JSON if it looks like JSON
      try {
        const jsonData = JSON.parse(text);
        res.json(jsonData);
      } catch {
        // If not JSON, return as text
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
      }
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message,
      url: url 
    });
  }
}
