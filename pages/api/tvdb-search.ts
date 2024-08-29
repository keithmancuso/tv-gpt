import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' })
  }

  try {
    const response = await fetch(`https://api.thetvdb.com/search/series?name=${encodeURIComponent(query as string)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.TVDB_API_KEY}`,
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from TVDB' })
  }
}