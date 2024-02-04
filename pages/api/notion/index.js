// pages/api/queryNotion.js

const { Client } = require('@notionhq/client');

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN, // Make sure to add your Notion token to your environment variables
});

const databaseId = process.env.WATCHING_DATABASE; // Your Notion Database ID also stored as an environment variable

export default async function handler(req, res) {

  // Extract status from query parameters or default to 'Watching'
  const { status } = req.body || {};

  try {
    // Construct the query with a condition for the status filter
    const query = {
      database_id: databaseId,
    };

    if (status) {
      query.filter = {
        property: 'Status',
        select: {
          equals: status,
        },
      };
    };

    const response = await notion.databases.query(query);

    // Process and simplify the results
    const simplifiedResults = response.results.map((page) => {
      return {
        Name: page.properties.Name.title[0]?.plain_text || 'No Name',
        App: page.properties.App?.select?.name || 'No App',
        Status: page.properties.Status?.select?.name || 'No Status'
      };
    });

    // Group the results by status
    const groupedByStatus = simplifiedResults.reduce((acc, curr) => {
      // Use the status as the key for grouping
      const key = curr.Status;
      if (!acc[key]) {
        acc[key] = [];
      }

      delete curr.Status; // Remove the status from the result
      acc[key].push(curr);
      return acc;
    }, {});

    res.status(200).json(groupedByStatus);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to query Notion database' });
  }
}