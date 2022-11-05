import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex } from "reflexbox";
import { Col, Form, Row, Select } from "antd";

import { useSession } from "next-auth/react";

import Landing from "../../components/LayoutsLanding";
import StudentForm from "../../components/UserRegister/studentForm";
import TeacherForm from "../../components/UserRegister/teacherForm";


function RegisterDesktop() {
  const router = useRouter();

  const { Option } = Select;

  const [authdata, setAuthdata] = useState();

  const roleData = ["นักเรียน", "อาจารย์"];
  const [role, setRole] = useState(roleData[0]);
  const handleRoleChange = (value) => {
    setRole(value);
  };

  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      sessionStorage.setItem("authdata", JSON.stringify(session.user));
      setAuthdata(session.user);
    }
  }, [session?.user]);

  return (
    <>
      <Landing>
        <div className="container">
          <Row>
            <Col span={24}>
              <Flex>
                <Box
                  style={{
                    padding: "10px 20px 0px 50px",
                    fontSize: "24px",
                    color: "#4B4B4B",
                  }}
                >
                  <p>งานสัมภาษณ์เข้าศึกษาต่อมหาวิทยาลัยอุบลราชธานี</p>
                </Box>
              </Flex>

              {/* --------------------------------------register------------------ */}

              <div className="site-content">
                <Flex className="contentsHome" style={{ margin: 20 }}>
                  <p className="font-regist" style={{ fontSize: "24px" }}>
                    ลงทะเบียน
                  </p>
                </Flex>

                <Flex flexDirection="column">
                  <Flex className="contentsHome">
                    <p style={{ fontSize: "18px" }}>ลงทะเบียนด้วยสถานะ</p>
                  </Flex>
                  <Flex className="contentsHome">
                    <Select
                      size="large"
                      style={{ width: 220 }}
                      defaultValue={roleData[0]}
                      onChange={handleRoleChange}
                    >
                      {roleData.map((value) => (
                        <Option key={value}>{value}</Option>
                      ))}
                    </Select>
                  </Flex>
                </Flex>

                <Flex style={{ margin: "40px 0px -20px 20px" }}>
                  <Col md={{ span: 24 }} lg={{ span: 12 }}>
                    <Flex className="input-regist" justifyContent="end">
                      <Form.Item name="email">
                        <Box>
                          <p
                            className="font-regist"
                            style={{ color: "#4B4B4B" }}
                          >
                            {session?.user.email}
                          </p>
                        </Box>
                      </Form.Item>
                    </Flex>
                  </Col>
                  <Col md={{ span: 24 }} lg={{ span: 12 }}>
                    <Flex
                      className="input-regist"
                      justifyContent="start"
                      style={{ marginLeft: "40px" }}
                    >
                      <Form.Item name="authname">
                        <Box>
                          <p
                            className="font-regist"
                            style={{ color: "#4B4B4B" }}
                          >
                            {session?.user.name}
                          </p>
                        </Box>
                      </Form.Item>
                    </Flex>
                  </Col>
                </Flex>
                

                {/* reder components */}

                {role === roleData[1] ? (
                  <Flex className="registerCompo">
                    <TeacherForm />
                  </Flex>
                ) : (
                  <Flex className="registerCompo">
                    <StudentForm />
                  </Flex>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Landing>
    </>
  );
}

export default RegisterDesktop;
