import { React, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  Input,
  Modal,
  Form,
  Alert,
  Typography,
  Row,
  Col,
} from "antd";
import {
  MailOutlined,
  KeyOutlined,
  UserOutlined,
  SettingOutlined,
  LoginOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Flex, Box } from "reflexbox";
import styled from "@emotion/styled";
import { useSession, signIn, signOut } from "next-auth/react";

import { AuthLogin, Login } from "../../pages/api";

const StyledModal = styled(Modal)`
  position: fixed;
  width: 600px;
  top: 300px;
  left: calc(50% - 250px);
  bottom: 40px;
  z-index: 100;
  .ant-modal-wrap {
    overflow: hidden !important;
  }
  .ant-modal-content {
    border-radius: 5px;
  }
`;

const ProfileModal = styled(Modal)`
  left: calc(100% - 550px);
  margin: 0 !important;
  top: 70px;
  .ant-modal-wrap {
    overflow: hidden !important;
  }
  .ant-modal-content {
    border-radius: 5px;
  }
`;

export default function Topbar() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [userdata, setUserdata] = useState();
  const [authdata, setAuthdata] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("userData"));
    if (item) {
      setUserdata(item);
    }
  }, []);

  const onFinish = async () => {
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    try {
      await Login(data).then((response) => {
        if (response.status == 200) {
          console.log("respone ==>", response);
          Cookies.set("acces_token", response.data.access_token, {
            expires: 7,
          });
          localStorage.setItem("userData", JSON.stringify(response.data));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          setUserdata(response.data);
          // setIsModalVisible(false);
        }
      });
    } catch (error) {
      console.log("error", error);
      setError(true);
    }
  };

  const { Text, Link } = Typography;

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      LoginGoogle();
      sessionStorage.setItem("authdata", JSON.stringify(session.user));
      setAuthdata(session.user);
    }
  }, [session?.user]);

  const LoginGoogle = async () => {
    if (session) {
      const payLoad = {
        email: session.user.email,
      };
      try {
        await AuthLogin(payLoad).then((response) => {
          if (response.status == 200) {
            console.log("respone ===>", response);
            localStorage.setItem(
              "userData",
              JSON.stringify(response.data?.usersData)
            );
          }
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  function logOut() {
    localStorage.clear();
    sessionStorage.clear();
    signOut();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  

  return (
    <>
      <div className="layouts">
        <Flex>
          <Box width={1 / 2}>
            <Flex
              style={{ cursor: "pointer" }}
              onClick={() => router.reload()}
            >
              <img
                src="/assets/Logoubu.png"
                style={{ width: 60, height: 65, margin: "20px 20px 20px 50px" }}
              />
              <Box style={{ padding: "40px 15px 0px 0px" }}>
                <h3
                  style={{ lineHeight: "1px", color: "#FFF", fontSize: "24px" }}
                >
                  มหาวิทยาลัยอุบลราชธานี
                </h3>
                <p style={{ color: "#FFF", fontSize: "20px" }}>
                  Ubon Ratchathani University
                </p>
              </Box>
            </Flex>
          </Box>

          {authdata ? (
            <Box width={1 / 2}>
              <Flex justifyContent="end">
                <p
                  style={{
                    padding: "40px 50px 0px 0px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => setIsProfileVisible(true)}
                >
                  {authdata?.name}
                </p>
              </Flex>
            </Box>
          ) : session ? (
            <Box width={1 / 2}>
              <Flex justifyContent="end">
                <p
                  style={{
                    padding: "40px 50px 0px 0px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => setIsProfileVisible(true)}
                >
                  {session?.user.name}
                </p>
              </Flex>
            </Box>
          ) : userdata ? (
            <Box width={1 / 2}>
              <Flex justifyContent="end">
                <p
                  style={{
                    padding: "40px 50px 0px 0px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => setIsProfileVisible(true)}
                >
                  {userdata?.username}
                </p>
              </Flex>
            </Box>
          ) : (
            <Box width={1 / 2}>
              <Flex justifyContent="end">
                <p
                  style={{
                    padding: "40px 50px 0px 0px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => setIsModalVisible(true)}
                >
                  เข้าสู่ระบบ
                </p>
              </Flex>
            </Box>
          )}
        </Flex>

        {/* ---------------- Login ------------------- */}

        <StyledModal
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <Flex className="contentsHome">
            <p style={{ fontSize: "24px", color: "#4B4B4B" }}>
              เข้าใช้งานระบบด้วย
            </p>
          </Flex>
          <Form name="admin_login" onFinish={onFinish}>
            <Form.Item name="email">
              <Input
                size="middle"
                placeholder="Email"
                prefix={<MailOutlined style={{ color: "#4B4B4B" }} />}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                size="middle"
                placeholder="Password"
                prefix={<KeyOutlined style={{ color: "#4B4B4B" }} />}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Flex>
                {error ? (
                  <Text style={{ padding: 5 }} type="danger">
                    Invalid email or password
                  </Text>
                ) : (
                  <></>
                )}
              </Flex>
            </Form.Item>
            <Flex className="contentsHome">
              <Form.Item>
                <Button
                  htmlType="submit"
                  className="btn-login"
                  style={{ padding: "0px 78px 0px 78px" }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Form.Item>
            </Flex>
            <Flex className="contentsHome">
              <Divider> OR </Divider>
            </Flex>

            <Flex
              className="contentsHome"
              style={{ padding: "10px 10px 40px 10px" }}
            >
              <Button className="btn-login-google" onClick={() => signIn()}>
                <img
                  src="/assets/google-auth.png"
                  style={{ width: 15, margin: "3px 5px 5px 0px" }}
                />
                | Google Authentication
              </Button>
            </Flex>
          </Form>
        </StyledModal>

        {/* ---------------- Profile ------------------- */}

        <ProfileModal
          visible={isProfileVisible}
          footer={null}
          onCancel={() => setIsProfileVisible(false)}
        >
          {userdata ? (
            <Flex flexDirection="column">
              <Flex className="contentsHome">
                <h2>{userdata?.username}</h2>
              </Flex>
              <Flex className="contentsHome">
                <p>{userdata?.email}</p>
              </Flex>
              <Flex>
                <a onClick={() => router.push("/profile")}>
                  {" "}
                  <EditOutlined
                    style={{ padding: "10px 10px", marginLeft: 50 }}
                  />
                  แก้ไขข้อมูลส่วนตัว
                </a>
              </Flex>
              <Flex>
                <a onClick={() => logOut()}>
                  {" "}
                  <LoginOutlined
                    style={{ padding: "10px 10px ", marginLeft: 50 }}
                  />
                  Log Out
                </a>
              </Flex>
            </Flex>
          ) : session ? (
            <Flex flexDirection="column">
              <Flex className="contentsHome">
                <h2>{session?.user.name}</h2>
              </Flex>
              <Flex className="contentsHome">
                <p>{session?.user.email}</p>
              </Flex>
              <Flex>
                <a onClick={() => router.push("/profile")}>
                  {" "}
                  <EditOutlined
                    style={{ padding: "10px 10px", marginLeft: 50 }}
                  />
                  แก้ไขข้อมูลส่วนตัว
                </a>
              </Flex>
              <Flex>
                <a onClick={() => logOut()}>
                  {" "}
                  <LoginOutlined
                    style={{ padding: "10px 10px ", marginLeft: 50 }}
                  />
                  Log Out
                </a>
              </Flex>
            </Flex>
          ) : (
            <Flex flexDirection="column">
              <Flex className="contentsHome">
                <h2>{userdata?.username}</h2>
              </Flex>
              <Flex className="contentsHome">
                <p>{userdata?.email}</p>
              </Flex>
              <Flex>
                <a onClick={() => router.push("/dashboard")}>
                  {" "}
                  <UserOutlined
                    style={{ padding: "10px 10px", marginLeft: 50 }}
                  />
                  Dashboard
                </a>
              </Flex>
              <Flex>
                <a onClick={() => router.push("/dashboard/admin-dashboard")}>
                  {" "}
                  <SettingOutlined
                    style={{ padding: "10px 10px", marginLeft: 50 }}
                  />
                  Admin Dashboard
                </a>
              </Flex>
              <Flex>
                <a onClick={() => logOut()}>
                  {" "}
                  <LoginOutlined
                    style={{ padding: "10px 10px ", marginLeft: 50 }}
                  />
                  Log Out
                </a>
              </Flex>
            </Flex>
          )}
        </ProfileModal>
      </div>
    </>
  );
}
