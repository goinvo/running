import Head from "next/head";
import { google } from "googleapis";

import GoogleDocFormatter from "../components/GoogleDocFormatter";

import styles from "../styles/Home.module.css";
import { Navigation } from "../components/Navigation";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const file = params.slug?.[0];
  const fileName = file?.split("-").join(" ") ?? "home";

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

  const homeDocumentId = fileList[0].id;

  const documentId =
    fileList.find(
      (item) =>
        item.name
          .toLowerCase()
          .replace(/[0-9].([a-z].)? /, "")
          .trim() === fileName.toLowerCase()
    )?.id ?? homeDocumentId;

  // fetch the specific file
  const gsapi = google.docs({ version: "v1", auth: client });
  const opt = {
    documentId,
  };

  let data = await gsapi.documents.get(opt);

  return {
    props: {
      data: data.data,
      menuData: fileList,
    },
    revalidate: 5,
  };
}

export default function Home({ data, menuData }) {
  return (
    <>
      <Head>
        <title>Running a Project - GoInvo Playbook</title>
        <meta name="description" content="The GoInvo Playbook" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation menuData={menuData} />
      <main id="mainContainer" className={styles.main}>
        <GoogleDocFormatter rawData={data} />
      </main>
    </>
  );
}
