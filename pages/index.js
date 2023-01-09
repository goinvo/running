import Head from "next/head";
import { google } from "googleapis";

import GoogleDocFormatter from "../components/GoogleDocFormatter";

import styles from "../styles/Home.module.css";

export async function getStaticProps() {
  const documentId = "1Lz2TtV29MerXud1G-nHLgEVUVFt3_GQvaSLJyOPwRsY";
  const client = new google.auth.JWT({
    email: process.env.CLIENT_EMAIL,
    scopes: ["https://www.googleapis.com/auth/documents"],
    key: process.env.PRIVATE_KEY,
  });

  await client.authorize();

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
        <GoogleDocFormatter rawData={data} />
      </main>
    </>
  );
}
