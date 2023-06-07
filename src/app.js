import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

mongoose
  .connect(
    "mongodb+srv://rohit_sonawane:SuperSu@cluster0.e9hjfiy.mongodb.net/11111111111111111111111111"
  )
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));
import { oauth, redirectSite } from "./controller/user.controler.js";
app.post("/oauth", oauth); // Handle the initial OAuth request
app.get("/oauth/callback", redirectSite); // Handle the callback after user authorization

// app.get("/analytics", async (req, res) => {
//   try {
//     // Retrieve the user's access token from the database
//     const accessToken =
//       "ya29.a0AWY7CkmclpUkWqKpC6qa7b4TuKk8hChNADV93sft2fDbL7QBZzJpBxsAzp4x0NsgS9lmIl-iSVfP4Aqs17quReLzp0Vj4T-1TzNLumtG2aHRTH8pYWESOhkkfVuLdJX2NglODJYHg0CDF0m6Vl55q8grzDIxaCgYKAScSARMSFQG1tDrpJZPdvzmJR9wVKGjOnCRmjw0163"; // Replace with code to retrieve access token from the database

//     // Make requests to the Google Drive API using the access token
//     const filesResponse = await axios.get(
//       "https://www.googleapis.com/drive/v3/files",
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const files = filesResponse.data.files;

//     // Calculate analytics data
//     const analytics = {
//       totalFiles: files.length,
//       fileTypes: {},
//       totalSize: 0,
//     };

//     for (const file of files) {
//       // Track file type counts
//       const mimeType = file.mimeType;
//       if (analytics.fileTypes[mimeType]) {
//         analytics.fileTypes[mimeType]++;
//       } else {
//         analytics.fileTypes[mimeType] = 1;
//       }

//       // Calculate total size
//       analytics.totalSize += file.size || 0; // If file size is not available, assume it as 0
//     }

//     // Send the analytics data back to the frontend
//     res.json({ analytics });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to retrieve analytics data" });
//   }
// });

app.get("/analytics", async (req, res) => {
  try {
    // Retrieve the user's access token from the database
    const accessToken =
      "ya29.a0AWY7CkmclpUkWqKpC6qa7b4TuKk8hChNADV93sft2fDbL7QBZzJpBxsAzp4x0NsgS9lmIl-iSVfP4Aqs17quReLzp0Vj4T-1TzNLumtG2aHRTH8pYWESOhkkfVuLdJX2NglODJYHg0CDF0m6Vl55q8grzDIxaCgYKAScSARMSFQG1tDrpJZPdvzmJR9wVKGjOnCRmjw0163"; // Replace with code to retrieve access token from the database

    // Make a request to the Google Drive API to retrieve the files
    const pageSize = 100; // Number of files to retrieve per page

    const { data } = await axios.get(
      "https://www.googleapis.com/drive/v3/files",
      {
        params: {
          pageSize: pageSize,
          fields: "nextPageToken, files(id, name, mimeType, size)",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const files = data.files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
    }));

    res.json({ files });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve analytics data" });
  }
});

app.get("/master", async (req, res) => {
  try {
    // Retrieve the user's access token from the database
    const accessToken =
      "ya29.a0AWY7CkmclpUkWqKpC6qa7b4TuKk8hChNADV93sft2fDbL7QBZzJpBxsAzp4x0NsgS9lmIl-iSVfP4Aqs17quReLzp0Vj4T-1TzNLumtG2aHRTH8pYWESOhkkfVuLdJX2NglODJYHg0CDF0m6Vl55q8grzDIxaCgYKAScSARMSFQG1tDrpJZPdvzmJR9wVKGjOnCRmjw0163"; // Replace with code to retrieve access token from the database

    // Make a request to the Google Drive API to retrieve the files
    const pageSize = 100; // Number of files to retrieve per page

    const { data } = await axios.get(
      "https://www.googleapis.com/drive/v3/files",
      {
        params: {
          pageSize: pageSize,
          fields:
            "nextPageToken, files(id, name, mimeType, shared, permissions)",
          q: "trashed=false", // Exclude trashed files
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const files = data.files;
    const numPublicFiles = files.filter((file) => !file.shared).length;

    const permissions = files.flatMap((file) => file.permissions || []);
    const numPeopleWithAccess = new Set(
      permissions.map((permission) => permission.emailAddress)
    ).size;

    const numExternallySharedFiles = files.filter(
      (file) =>
        file.permissions &&
        file.permissions.some((permission) => permission.type === "anyone")
    ).length;

    res.json({
      numPublicFiles,
      numPeopleWithAccess,
      numExternallySharedFiles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve analytics data" });
  }
});

// app.get("/analytics", async (req, res) => {
//   try {
//     // Retrieve the user's access token from the database

//     // Make a request to the Google Drive API using the access token
//     let xyz;

//     xyz = await axios.get("https://www.googleapis.com/drive/v3/files", {
//       headers: {
//         Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwODNkZDU5ODE2NzNmNjYxZmRlOWRhZTY0NmI2ZjAzODBhMDE0NWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NDE1MDg4MDM0MTUtMXVoaHRvcGViZTFmc21qMDRub2g5aDBxNzc5MWVidmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NDE1MDg4MDM0MTUtMXVoaHRvcGViZTFmc21qMDRub2g5aDBxNzc5MWVidmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMzMjg2NzI2MDc0ODg5NTkwMTkiLCJhdF9oYXNoIjoiZ3FOLWRhaXFJclNtVlRaYmpNRTljdyIsIm5hbWUiOiJSb2hpdCBTbyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRmWHZ6OTRRYUw3UkhFLXVJSENMTVdkdXlJSG5ORVhHald6ckhvbT1zOTYtYyIsImdpdmVuX25hbWUiOiJSb2hpdCIsImZhbWlseV9uYW1lIjoiU28iLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY4NjA3NTU4OSwiZXhwIjoxNjg2MDc5MTg5fQ.dPx6BJxBLULJPRQqsKyClFHLoseQTg5f6v9TWwtf6c6v5LhdJNkOPtHgBp-k4G8kq4YnShC0BtEdRgRWLayKeeggw2lY7qWOfaNJ6b5Tt4qqwKE0ISQDmHslzWUFG-q_-Wq7beGFYjd8462GXJakiCg46ptNh4KqeDsANtx4vOQv__1kCymgPtTb_RyWuwxm-SZm47itsCa2KKvnvP6yXJsqh3UsotDePnYcWyGx4Z72g5Wzx1YqBGvTXIbfjaKWHon9WV5TWxTYndDenygLlr33lybj__fXqJAXn0gfoGaZVSlpQO0DPgBnqC0BTLZTXLaHRPpYb-JSAqXtPx3o1w`,
//       },
//     });

//     console.log(xyz);
//     // Process the response to extract the required information

//     // Send the processed data back to the frontend
//     res.json({ xyz });
//   } catch (error) {
//     // console.log(error);
//     console.log(49);
//     // Handle errors and send an error response to the frontend
//     res.status(500).json({ error: error });
//   }
// });

app.listen(3000, () => console.log(`listning on port 3000`));
