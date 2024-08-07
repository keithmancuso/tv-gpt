export default async function handler(req, res) {
    const { code } = req.query;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.OAUTH_REDIRECT_URI;

    console.log("code", code);

    // encode in base 64
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

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
    const { access_token, workspace_id, workspace_name } = data;
    
    // Do something with the data
    console.log('Access Token:', access_token);
    console.log('Workspace ID:', workspace_id);
    console.log('Workspace Name:', workspace_name);

    res.status(200).json({ message: 'User Authorized' });

  }