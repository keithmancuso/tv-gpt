import cookie from 'cookie';

const { Client } = require('@notionhq/client');

let notionToken; // Your Notion API token also stored as an environment variable
let databaseId; // Your Notion Database ID also stored as an environment variable

export default async function handler(req, res) {
    // Extract name, app, and status from the request body
    const { name, app, status, rating, score, emoji,notes } = req.query;

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

        let body  = {
            parent: { 
                database_id: databaseId 
            },
            properties: {
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
            }
        };

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
            rich_text: [
                {
                text: {
                    content: notes,
                },
                },
            ],
            };
        }
    

      // Create a new page in the database
      await notion.pages.create(body);
  
      res.status(200).json({ message: 'Page successfully created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create page' });
    }
  }