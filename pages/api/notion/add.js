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
    const { name, app, status, rating, score } = req.body;
  
    try {

        let properties = { 
            Name: {
                title: [
                {
                    text: {
                        content: name,
                    },
                },
                ],
            },
            App: {
                select: {
                    name: app,
                },
            }
        };

        if (status) {
            properties.Status = {
                select: {
                    name: status,
                },
            };
        }

        if (rating) {
            properties.Rating = {
                number: parseInt(rating),
            };
        }

        if (score) {
            properties.Score = {
                number: parseInt(score),
            };
        }

      // Create a new page in the database
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: properties
      });
  
      res.status(200).json({ message: 'Page successfully created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create page' });
    }
  }