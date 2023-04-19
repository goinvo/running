
import { google } from "googleapis";

export const getFileList = async () => {
  const client = new google.auth.JWT({
    email: process.env.CLIENT_EMAIL,
    scopes: [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive",
    ],
    key: process.env.PRIVATE_KEY,
  });

  await client.authorize();

  // fetch the entire folder
  const folderId = "11N3RY-5t73GvWfvXa-qFAvww8vIw1AOG";
  const gsapi2 = google.drive({ version: "v3", auth: client });
  const opt2 = {
    q: `'${folderId}' in parents and trashed = false`,
  };
  let data2 = await gsapi2.files.list(opt2);
  const fileList = data2.data.files
    ?.sort((a, b) => {
      if (a.name && b.name) {
        if (a?.name < b?.name) return -1;
        if (a?.name > b?.name) return 1;
      }
      return 0;
    })
    .filter((item) => !item.mimeType.includes("folder"));
  return [fileList, client];
}