export default async function handler(req, res) {
    const { code } = req.query;
    const clientId = process.env.NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI;
   

    // encode in base 64
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");


    console.log("encoded", encoded);
    console.log("code", code);

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
    },
        body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
        }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error exchanging code for token:', errorData);
        throw new Error(errorData.error || 'Error exchanging code for token');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    // Access the returned data
    const { access_token, workspace_id, workspace_name, duplicated_template_id } = data;
    
    // Do something with the data
    console.log('Access Token:', access_token);
    console.log('Workspace ID:', workspace_id);
    console.log('Workspace Name:', workspace_name);
    console.log('Database Id:', duplicated_template_id);

    if (access_token && duplicated_template_id) {
        res.setHeader('Set-Cookie', [
          `token=${access_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`,
          `databaseId=${duplicated_template_id}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
        ]);
    } else {
    console.error('Access token or Database ID is undefined or null');
    }

   
   // Prepare the response data
   const responseData = {
    access_token: access_token,
    token_type: 'bearer'
    };

    // Send POST request to ChatGPT callback URL
    const chatGptCallbackUrl = 'https://chat.openai.com/aip/g-108735736f89298ee12fd3d6918001a9c5002327/oauth/callback';

    try {
        const chatGptResponse = await fetch(chatGptCallbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responseData),
        });

        if (!chatGptResponse.ok) {
            throw new Error(`HTTP error! status: ${chatGptResponse.status}`);
        }

        const chatGptResult = await chatGptResponse.json();
        console.log('ChatGPT callback response:', chatGptResult);

        res.status(200).json({ message: 'Authorization successful', chatGptResponse: chatGptResult });
    } catch (error) {
        console.error('Error sending data to ChatGPT:', error);
        res.status(500).json({ message: 'Error processing authorization', error: error.message });
    }

  }