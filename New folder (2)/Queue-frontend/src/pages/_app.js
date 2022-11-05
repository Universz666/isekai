import { SessionProvider } from "next-auth/react";
import "../../styles/globals.css";
import "../../styles/Home.module.css";
import "antd/dist/antd.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
