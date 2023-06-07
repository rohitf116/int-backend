import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";

dotenv.config();

export const oauth = async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    const redirectUrl = "http://127.0.0.1:3000/oauth/callback";
    const oAuth = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const authorizeUrl = oAuth.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/drive",
      ],
      prompt: "consent",
    });
    res.json({ url: authorizeUrl });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getUserData = async (access_token) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log(data);
  return data;
};

export const redirectSite = async (req, res) => {
  try {
    const { code } = req.query;
    const redirectUrl = "http://127.0.0.1:3000/oauth/callback";
    const oAuth = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const { tokens } = await oAuth.getToken(code);
    oAuth.setCredentials(tokens);
    const user = oAuth.credentials;
    console.log(user);
    await getUserData(user.access_token);
    res.send("Authenticated successfully!");
  } catch (error) {
    res.json({ error: error.message });
  }
};
