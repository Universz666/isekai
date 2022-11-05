import { React, useState, useEffect } from "react";
import { Box, Flex } from "reflexbox";
import Landing from "../../components/LayoutsLanding";
import { Col, Form, Row, Select } from "antd";

import _StudentRole from "../../components/Editeprofile/_StudentRole";
import _TeacherRole from "../../components/Editeprofile/_TeacherRole";

function editProfile() {
  const [userData, setUserData] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("userData"));
    if (item) {
      setUserData(item);
      setRole(item.role);
    }
  }, []);


  return (
    <>
      {" "}
      <Landing>
        <div className="container">
          <Row>
            <Col span={24}>
              <div className="site-content">
                <Flex className="contentsHome" style={{ margin: 20 }}>
                  <p className="font-regist" style={{ fontSize: "24px" }}>
                    แก้ไขข้อมูลส่วนตัว
                  </p>
                </Flex>
                {/* reder components */}

                {role === "student" ? (
                  <Flex className="registerCompo">
                    <_StudentRole />
                  </Flex>
                ) : role === "teacher" ? (
                  <Flex className="registerCompo">
                    <_TeacherRole />
                  </Flex>
                ) : (
                  <></>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Landing>
    </>
  );
}

export default editProfile;
