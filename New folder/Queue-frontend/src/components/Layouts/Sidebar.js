import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {
  const router = useRouter();

  return (
    <>
      <Layout style={{ height: "100vh" }}>
        <Sider
          className="sidebar"
          style={{ backgroundColor: "#fff", height: "100vh" }}
        >
          <Menu
            mode="inline"
            style={{
              height: "100%",
              background: "#fff",
              paddingTop: 20,
            }}
          >
            <Menu.Item key="1" icon={<HomeOutlined/>} onClick={() => router.push("/")}>
              หน้าแรก
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<SettingOutlined/>}
              onClick={() => router.push("/dashboard/admin-users")}
            >
              Users Dashboard
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </>
  );
}

export default Sidebar;
