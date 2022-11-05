import { React, useState, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import { Input, Button, message, Select, Row, Col } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";

import { useRouter } from "next/router";
import { update_data } from "../../../pages/api";

export default function _StudentRole() {
  const router = useRouter();

  const [userData, setUserData] = useState();
  const [userInfo, setUserInfo] = useState();

  const [provincedata, setProvinceData] = useState(null);

  const [username, setUsername] = useState();
  const [filename, setFilename] = useState();
  const [fullname, setFullname] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState();

  useEffect(async () => {
    const item = JSON.parse(localStorage.getItem("userData"));
    if (item) {
      setUserData(item);
      axios
        .get(
          `http://localhost:8000/api/v1/userInfo-role?id=${item?.id}&role=${item?.role}`
        )
        .then((response) => {
          if (response) {
            console.log("response ==>", response.data.result);
            setUserInfo(response.data.result);
            setFilename(response.data.result.file);
            setFullname(response.data.result.fullName);
            setPhone(response.data.result.phone);
            setProvince(response.data.result.province);
            setSchool(response.data.result.school);
            setUsername(response.data.result.username);
          }
        });
    }
  }, []);

  useEffect(() => {
    fetch("https://thaiaddressapi-thaikub.herokuapp.com/v1/thailand/provinces")
      .then((res) => res.json())
      .then((data) => {
        setProvinceData(data.data);
      });
  }, []);

  const provinceArray = [];
  if (provincedata) {
    for (let i = 0; i < provincedata.length; i++) {
      // console.log(provincedata[i]);
      provinceArray.push(provincedata[i].province);
    }
  }

  const provinceChange = (value) => {
    setProvince(value);
  };

  const handleSubmit = async () => {
    const payLoad = {
      id: userData?.id,
      email: userData?.email,
      username: username,
      fullName: fullname,
      phone: phone,
      role: "student",
      school: school,
      province: province,
      file: filename,
    };
    console.log(payLoad);

    try {
      await update_data(payLoad).then((response) => {
        if (response) {
          console.log("respone ==>", response);
          localStorage.setItem("userData", response.data?.result);
          router.back()
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Row>
      <Flex flexDirection="column">
        <Flex>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex className="input-regist" justifyContent="end">
              <Box>
                <></>
              </Box>
              <Box>
                <p className="font-regist">{userData?.email}</p>
              </Box>
            </Flex>
          </Col>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex
              className="input-regist"
              justifyContent="start"
              style={{ marginLeft: "40px" }}
            >
              <Box>
                <p className="font-regist">username</p>
              </Box>
              <Box>
                <Input
                  style={{ width: "180px" }}
                  placeholder={userData?.username}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </Box>
            </Flex>
          </Col>
        </Flex>
        <Flex>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex className="input-regist" justifyContent="end">
              <Box>
                <p className="font-regist">ชื่อ-นามสกุล </p>
              </Box>
              <Box>
                <Input
                  style={{ width: "200px" }}
                  placeholder={userData?.fullName}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </Box>
            </Flex>
          </Col>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex
              className="input-regist"
              justifyContent="start"
              style={{ marginLeft: "40px" }}
            >
              <Box>
                <p className="font-regist">โรงเรียน</p>
              </Box>
              <Box>
                <Input
                  style={{ width: "200px" }}
                  placeholder={userInfo?.school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </Box>
            </Flex>
          </Col>
        </Flex>
        <Flex>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex className="input-regist" justifyContent="end">
              <Box>
                <p className="font-regist">เบอร์โทรศัพท์ </p>
              </Box>
              <Box>
                <Input
                  style={{ width: "200px" }}
                  placeholder={userData?.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>
            </Flex>
          </Col>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex
              className="input-regist"
              justifyContent="start"
              style={{ marginLeft: "40px" }}
            >
              <Box>
                <p className="font-regist">Portfolio</p>
              </Box>
              <Box>
                <Input
                  style={{ width: "200px" }}
                  placeholder={userInfo?.file}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </Box>
            </Flex>
          </Col>
        </Flex>
        <Flex>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex className="input-regist" justifyContent="end">
              <Box>
                <p className="font-regist">จังหวัด </p>
              </Box>
              <Box>
                <Select
                  showSearch
                  onChange={provinceChange}
                  style={{ width: "200px" }}
                  placeholder={userInfo?.province}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {provinceArray.map((province) => (
                    <Option key={province}>{province}</Option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Col>
        </Flex>

        {/* ---------------------------Submit-------------------------- */}
        <Col span={24}>
          <Flex className="contentsHome">
            <Button
              htmlType="submit"
              className="ant-btn-primary"
              style={{
                fontSize: "18px",
                borderRadius: "5px",
                padding: "0px 20px 0px 20px",
                cursor: "pointer",
              }}
              onClick={() => handleSubmit()}
            >
              บันทึกการเปลี่ยนแปลง
            </Button>
          </Flex>
        </Col>
      </Flex>
    </Row>
  );
}
