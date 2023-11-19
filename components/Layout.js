// define a layout component
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

const Layout = ({ children, userData, handleLogout }) => {
  // render the component
  return (
    <div>
      {/* add a custom favicon to prevent console error */}
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Header userData={userData} handleLogout={handleLogout} />
      {children}
      {/* add global styled-jsx */}
      <style global jsx>
        {`
          @font-face {
            font-family: "ethnocentric";
            src: local("ethnocentric"),
              url("/fonts/ethnocentric.otf") format("opentype");
            font-display: swap;
          }

          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2)
              format("woff2");
          }

          /* Apply Roboto font to all text except the 'App' class */
          body :global(*) {
            font-family: "Roboto", sans-serif;
          }

          /* custom font will not load if babel.config.js is present */
          .AppTitle {
            font-family: "ethnocentric", "Roboto";
            color: grey;
            text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
              1px 1px 0 #fff;
          }

          body {
            background-color: gray;
            text-align: center;
          }

          img {
            width: 45%;
            display: flex;
            justify-content: center;
            margin: auto;
            padding: 2%;
          }

          p {
            display: flex;
            justify-content: center;
            margin-right: 10%;
            margin-left: 10%;
          }

          h1 {
            display: flex;
            justify-content: center;
            margin: auto;
            padding: 1%;
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
