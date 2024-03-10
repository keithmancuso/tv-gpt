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
    const { id, app, status,rating, score, emoji, notes } = req.body;
  
    try {
    
    

        // Prepare the properties to update
        let body = {
            page_id: id,
            properties: {}
        };

        if (app) {
            body.properties.App = {
                select: {
                    name: app,
                },
            };
        }

        if (status) {
            body.properties.Status = {
                select: {
                    name: status,
                },
            };
        }

        if (rating && Number.isInteger(parseInt(rating))) {
            body.properties.Rating = {
                number: parseInt(rating),
            };
        }

        if (score && Number.isInteger(parseInt(score))) {
            body.properties.Score = {
                number: parseInt(score),
            };
        }


        if (emoji) {
            body.icon = {
                type:"emoji",
                emoji: emoji,
            };
        }

        if (notes) {
            body.properties.Notes = {
                text: {
                    content: notes,
                },
            };
        }
       
    
        // Update the page in the database
        await notion.pages.update(body);

    
        res.status(200).json({ message: 'Page successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update page' });
    }
  }