export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    // Follow redirects to get the final URL
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const resolvedUrl = response.url;

    res.status(200).json({ 
      originalUrl: url,
      resolvedUrl: resolvedUrl,
      success: true 
    });

  } catch (error) {
    console.error('URL resolution error:', error);
    res.status(500).json({ 
      error: 'Failed to resolve URL',
      originalUrl: req.body?.url,
      resolvedUrl: req.body?.url, // Fallback to original URL
      success: false 
    });
  }
}
