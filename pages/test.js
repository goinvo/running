import Head from "next/head";
import { google } from "googleapis";

import styles from "../styles/Home.module.css";
import GoogleDocFormatterV2 from "../components/GoogleDocFormatterV2";

export async function getStaticProps({ params }) {
  const documentId = "1bkMe3koU7QcD9NBq6VTRAggKCNZ3ho0m5aZ8MSbrnbI";

  const client = new google.auth.JWT({
    email: process.env.CLIENT_EMAIL,
    scopes: [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive",
    ],
    key: process.env.PRIVATE_KEY,
  });

  await client.authorize();

  // fetch the specific file
  const gsapi = google.docs({ version: "v1", auth: client });
  const opt = {
    documentId,
  };

  let data = await gsapi.documents.get(opt);

  return {
    props: {
      data: data.data,
    },
    revalidate: 5,
  };
}

export default function Home({ data }) {
  return (
    <>
      <Head>
        <title>Running a Project - GoInvo Playbook</title>
        <meta name="description" content="The GoInvo Playbook" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <GoogleDocFormatterV2 rawData={data} />
      </main>
    </>
  );
}
