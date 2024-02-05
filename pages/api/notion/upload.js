// pages/api/queryNotion.js

const { Client } = require('@notionhq/client');

const notionToken = process.env.NOTION_TOKEN; // Your Notion API token also stored as an environment variable
const databaseId = process.env.WATCHING_DATABASE; // Your Notion Database ID also stored as an environment variable

// Initializing a client
const notion = new Client({
    auth: notionToken, // Make sure to add your Notion token to your environment variables
});


export default async function handler(req, res) {
    // Extract name, app, and status from the request body
    const poster = req.body;
  
    try {
    
        // upload the image 
        imageUrl = 'https://placekitten.com/200/300';

        // Prepare the properties to update
        properties.Poster = {
            external: {
                url: imageUrl,
            },
        };





        // Update the page in the database
        await notion.pages.update({
            page_id: id,
            properties: properties,
        });

    
        res.status(200).json({ message: 'Page successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update page' });
    }
  }