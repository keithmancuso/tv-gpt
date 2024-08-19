export default async function handler(req, res) {
    const { code } = req.body;
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

    res.status(200).json({ message: 'User Authorized' });

  }