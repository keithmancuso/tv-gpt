import cookie from 'cookie';

const { Client } = require('@notionhq/client');


export default async function handler(req, res) {

  // Extract status from query parameters or default to 'Watching'
  const { status } = req.body || {};

  const cookies = cookie.parse(req.headers.cookie || '');
    databaseId = cookies.databaseId;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    // Check if the header is present and properly formatted
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the header
        const notionToken = authHeader.split(' ')[1];

    } else {
        res.status(401).json({ error: 'Authorization header missing or improperly formatted' });
    }
  

    // Initializing a client
    const notion = new Client({
        auth: notionToken, // Make sure to add your Notion token to your environment variables
    });

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