import Head from "next/head";

export default function Home() {
  return (
    <div>
      <style jsx global>{`
        background: red;
      `}</style>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
