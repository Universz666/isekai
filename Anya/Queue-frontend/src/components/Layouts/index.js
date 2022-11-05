import React from "react";
import { Layout } from "antd";
import { Flex } from "reflexbox";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const { Content } = Layout;

function Layouts({ children }) {
  return (
    <Flex flexDirection="column">
      <Topbar />
      <Flex flexWrap="nowrap">
        <Sidebar />
        <Flex flexDirection="column" width="100%" style={{ backgroundColor: "#F6F6F6" }}>
          <main style={{ minHeight: "calc(100vh - 75px)", padding:"30px 30px 30px 50px", backgroundColor: "#F6F6F6" }}>{children}</main>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Layouts;
