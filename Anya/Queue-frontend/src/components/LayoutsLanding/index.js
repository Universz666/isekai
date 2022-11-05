import React from "react";

import Topbar from "../Layouts/Topbar";

function Landing({ children }) {
  return (
    <>
      <Topbar />
      <div style={{ backgroundColor: "#F6F6F6" }}>
        <main
          style={{
            minHeight: "calc(100vh - 75px)",
            padding: "30px 30px 30px 50px",
            backgroundColor: "#F6F6F6",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}

export default Landing;
