// pages/api/queryNotion.js

const { Client } = require('@notionhq/client');

const notionToken = process.env.NOTION_TOKEN; // Your Notion API token also stored as an environment variable
const databaseId = process.env.WATCHING_DATABASE; // Your Notion Database ID also stored as an environment variable

// Initializing a client
const notion = new Client({
  auth: notionToken, // Make sure to add your Notion token to your environment variables
});


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
        Id: page.id,
        Name: page.properties.Name.title[0]?.plain_text || 'No Name',
        App: page.properties.App?.select?.name || 'Unknown App',
        Status: page.properties.Status?.select?.name || 'Up Next',
        Rating: page.properties.Rating?.number || null,
        Score: page.properties.Score?.number || null,
      };
    });

    // Group the results by status and then by app
    const groupedResults = simplifiedResults.reduce((acc, curr) => {
      // Use the status and app as the keys for grouping
      const statusKey = curr.Status;
      const appKey = curr.App;

      if (!acc[statusKey]) {
        acc[statusKey] = {};
      }

      if (!acc[statusKey][appKey]) {
        acc[statusKey][appKey] = [];
      }

      // Remove the Status and App properties from the current object
      delete curr.Status;
      delete curr.App;

      acc[statusKey][appKey].push(curr);
      return acc;
    }, {});

    res.status(200).json(groupedResults);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to query Notion database'});
  }
}