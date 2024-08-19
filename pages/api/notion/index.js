
const { Client } = require('@notionhq/client');

// Get databaseId and notionToken from environment variables
const databaseId = process.env.WATCHING_DATABASE;
const notionToken = process.env.NOTION_TOKEN;

// Ensure the environment variables are set
if (!databaseId || !notionToken) {
  console.error('Missing required environment variables: WATCHING_DATABASE or NOTION_TOKEN');
  throw new Error('Missing required environment variables');
}

// Initializing a client
const notion = new Client({
  auth: notionToken,
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

      let icon = page.icon?.emoji || null;
      let name = page.properties.Name.title[0]?.plain_text 

      name = icon ? icon + ' ' + name : name;


      return {
        Id: page.id,
        Name: name,
        App: page.properties.App?.select?.name || 'Unknown App',
        Status: page.properties.Status?.select?.name || 'Up Next',
        Rating: page.properties.Rating?.number || null,
        Score: page.properties.Score?.number || null,
        Notes: page.properties.Notes?.rich_text[0]?.plain_text || null

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