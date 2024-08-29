import type { NextApiRequest, NextApiResponse } from 'next'

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function getTVDBToken() {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const response = await fetch('https://api.thetvdb.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apikey: process.env.TVDB_API_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with TVDB');
  }

  const data = await response.json();
  
  // Cache the new token with an expiration of 30 days
  tokenCache = {
    token: data.token,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  };

  return data.token;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' })
  }

  try {
    const token = process.env.TVDB_AUTH_TOKEN;
    const response = await fetch(`https://api4.thetvdb.com/v4/search?type=series&limit=10&query=${encodeURIComponent(query as string)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from TVDB' })
    console.error(error);
  }
}