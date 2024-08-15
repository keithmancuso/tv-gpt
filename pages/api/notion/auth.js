export default async function handler(req, res) {
    // redirect to Notion OAuth URL 
    res.redirect(`https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NOTION_REDIRECT_URI}`)
}