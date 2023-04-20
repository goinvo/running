import Head from "next/head";
import { useState } from "react";
import { google } from "googleapis";

import GoogleDocFormatter from "../components/GoogleDocFormatter";

import styles from "../styles/Home.module.css";
import { Navigation } from "../components/Navigation";
import { standardizePageId } from "../utils/format";
import { getFileList } from "../utils/data";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const file = params.slug?.[0];
  const fileName = file?.split("-").join(" ") ?? "home";

  const [fileList, client] = await getFileList();

  const homeDocumentId = fileList[0].id;

  const documentId =
    fileList.find((item) => {
      return standardizePageId(item.name) === standardizePageId(fileName);
    })?.id ?? homeDocumentId;

  // fetch the specific file
  const gsapi = google.docs({ version: "v1", auth: client });
  const opt = {
    documentId,
  };

  // fetch contact data info
  const opt2 = {
    documentId: "1amHWSkWWTYPS7VeajDpfn66lLa5MSCe8h4aHyxLO-j4"
  };

  let data = await gsapi.documents.get(opt);
  let contactData = await gsapi.documents.get(opt2);

  return {
    props: {
      data: data.data,
      contactData: contactData.data,
      menuData: fileList,
    },
    revalidate: 5,
  };
}

export default function Page({ data, menuData, contactData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (typeof window !== "undefined") {
    // apply the overflow hidden to the body when the menu is open
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  return (
    <>
      <Head>
        <title>Running a Project - GoInvo Playbook</title>
        <meta name="description" content="The GoInvo Playbook" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation
        menuData={menuData}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        contactData={contactData}
      />

      <main id="mainContainer" className={styles.main}>
        <GoogleDocFormatter rawData={data} />
      </main>
    </>
  );
}
