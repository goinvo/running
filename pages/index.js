export function getServerSideProps(context) {
  return {
    redirect: {
      // Set to the default home page
      destination: "/running-goinvo",
      permanent: false,
    },
  };
}

export default function Home({ data }) {
  return <div></div>;
}
