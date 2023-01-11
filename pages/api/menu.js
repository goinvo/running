import { google } from "googleapis";

let serverMenuCache;

export default function handler(req, res) {
  const isInitialRequest = serverMenuCache === undefined;

  const folderId = "11N3RY-5t73GvWfvXa-qFAvww8vIw1AOG";
  const client = new google.auth.JWT({
    email: process.env.CLIENT_EMAIL,
    scopes: ["https://www.googleapis.com/auth/drive"],
    key: process.env.PRIVATE_KEY,
  });

  client.authorize().then(async () => {
    const gsapi = google.drive({ version: "v3", auth: client });
    const opt = {
      q: `'${folderId}' in parents and trashed = false`,
    };
    let data = await gsapi.files.list(opt);
    const fileList = data.data.files?.sort((a, b) => {
      if (a.name && b.name) {
        if (a?.name < b?.name) return -1;
        if (a?.name > b?.name) return 1;
      }
      return 0;
    });
    serverMenuCache = fileList;
  });

  res.status(200).json({ menuData: serverMenuCache });
}
