import { React, useState, useEffect } from "react";
import Layouts from "../../components/Layouts";
import { Box, Flex } from "reflexbox";
import { Input, Menu, Dropdown, Button, Form, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { register_Teacher } from "../api";

const { TextArea } = Input;

function Dashboard() {
  const [userdata, setUserdata] = useState();

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("userData"));
    // console.log(item)
    if (item) {
      setUserdata(item);
    }
  }, []);

  const { Option } = Select;
  const facultyData = [
    "คณะวิทยาศาสตร์",
    "คณะเกษตรศาสตร์",
    "คณะวิศวกรรมศาสตร์",
    "คณะศิลปศาสตร์",
    "คณะเภสัชศาสตร์",
    "คณะบริหารศาสตร์",
    "คณะพยาบาลศาสตร์",
    "วิทยาลัยแพทยศาสตร์และการสาธารณสุข",
    "คณะศิลปประยุกต์และสถาปัตยกรรมศาสตร์",
    "คณะนิติศาสตร์",
    "คณะรัฐศาสตร์",
  ];
  const majorData = {
    คณะวิทยาศาสตร์: [
      "สาขาเคมี",
      "สาขาเทคโนโลยียางและพอลิเมอร์",
      "สาขาฟิสิกส์ชีวการแพทย์",
      "สาขาคณิตศาสตร์",
      "สาขาวิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์",
      "สาขาเทคโนโลยีสารสนเทศและการสื่อสาร",
      "สาขาชีววิทยา",
      "สาขาจุลชีววิทยา",
      "สาขาวิทยาศาสตร์สิ่งแวดล้อม",
      "สาขาอาชีวอนามัยและความปลอดภัย",
    ],
    คณะเกษตรศาสตร์: [
      "สาขาวิชาเกษตรศาสตร์",
      "สาขาวิชาเทคโนโลยีการอาหาร",
      "สาขาวิชาประมง",
    ],
    คณะวิศวกรรมศาสตร์: [
      "ภาควิชาวิศวกรรมเครื่องกล",
      "ภาควิชาวิศวกรรมเคมี",
      "ภาควิชาวิศวกรรมโยธา",
      "ภาควิชาวิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์",
      "ภาควิชาวิศวกรรมอุตสาหการ",
    ],
    คณะศิลปศาสตร์: [
      "สาขาวิชาการจัดการการท่องเที่ยวและการบริการ",
      "สาขาวิชานวัตกรรมการจัดการมรดกทางวัฒนธรรม",
      "สาขาวิชาภาษาอังกฤษเพื่อธุรกิจในยุคดิจิทัล",
      "สาขาวิชาภาษาอังกฤษและการสื่อสาร",
      "สาขาวิชาการพัฒนาสังคม",
      "สาขาวิชานิเทศศาสตร์",
      "สาขาวิชาภาษาจีนและการสื่อสาร",
      "สาขาวิชาภาษาญี่ปุ่นและการสื่อสาร",
      "สาขาวิชาภาษาเวียดนาม",
      "สาขาวิชาภาษาไทยและการสื่อสาร",
      "สาขาวิชาภูมิภาคลุ่มแม่น้ำโขงศึกษา",
      "สาขาวิชาศึกษาศาสตร์",
      "สาขาวิชาภาษาและวัฒนธรรมอาเซียน",
    ],
    คณะเภสัชศาสตร์: ["หลักสูตรเภสัชศาสตรบัณฑิต"],
    คณะบริหารศาสตร์: [
      "สาขาวิชาการบัญชี",
      "สาขาวิชาการเงินและการลงทุน",
      "สาขาวิชาการจัดการธุรกิจ",
      "สาขาวิชาการตลาด",
      "สาขาวิชาการจัดการโรงแรม",
      "สาขาวิชาการจัดการธุรกิจระหว่างประเทศ (หลักสูตรภาษาอังกฤษ)",
    ],
    คณะพยาบาลศาสตร์: [
      "หลักสูตรการพยาบาลศาสตบัณฑิต",
      "หลักสูตรประกาศนียบัตรผู้ช่วยพยาบาล",
      "หลักสูตรการพยาบาลเฉพาะทาง สาขาการพยาบาลผู้ป่วยผ่าตัด",
    ],
    วิทยาลัยแพทยศาสตร์และการสาธารณสุข: [
      "แพทยศาตรบัณฑิต",
      "อนามัยสิ่งแวดล้อม",
      "สาธารณสุขศาสตร์",
    ],
    คณะศิลปประยุกต์และสถาปัตยกรรมศาสตร์: [
      "สถาปัตยกรรมศาสตร์",
      "ออกแบบอุตสาหกรรม",
    ],
    คณะนิติศาสตร์: ["หลักสูตรนิติศาสตรบัณฑิต"],
    คณะรัฐศาสตร์: ["หลักสูตรรัฐศาสตรบัณฑิต", "หลักสูตรรัฐประศาสนศาสตรบัณฑิต"],
  };

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [facultys, setFacultys] = useState(facultyData[0]);

  const [faculties, setFaculties] = useState(majorData[facultyData[0]]);
  const [majorDat, setMajorDat] = useState(majorData[facultyData[0]][0]);

  const handleFacultyChange = (value) => {
    setFacultys(value);
    setFaculties(majorData[value]);
    setMajorDat(majorData[value][0]);
  };
  const onMajorChange = (value) => {
    setMajorDat(value);
  };

  const handleRegister = async () => {
    const payLoad = {
      email: userdata?.email,
      name: userdata?.name,
      full_name: fullname,
      phone: phone,
      faculty: facultys,
      majors: majorDat,
      description: description,
    };
    console.log(payLoad);

    try {
      await register_Teacher(payLoad).then((respones) => {
        if (respones.status == 200) {
          console.log("respone ===>", respones);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Layouts>
        <Flex className="contentsHome" style={{ margin: 20 }}>
          <h2 style={{ fontSize: "24px" }}>อาจารย์ผู้สอบสัมภาษณ์</h2>
        </Flex>

        <Flex flexDirection="column">
          <Form name="regist_Queue">
            <Flex>
              <Box width={1 / 2}>
                <Flex className="input-regist" justifyContent="end">
                  <Form.Item name="email">
                    <Box>
                      <p className="font-regist" style={{ color: "#4B4B4B" }}>
                        {userdata?.email}
                      </p>
                    </Box>
                  </Form.Item>
                </Flex>
              </Box>
              <Box width={1 / 2}>
                <Flex
                  className="input-regist"
                  justifyContent="start"
                  style={{ marginLeft: "40px" }}
                >
                  <Form.Item name="authname">
                    <Box>
                      <p className="font-regist" style={{ color: "#4B4B4B" }}>
                        {userdata?.name}
                      </p>
                    </Box>
                  </Form.Item>
                </Flex>
              </Box>
            </Flex>

            <Flex>
              <Box width={1 / 2}>
                <Flex className="input-regist" justifyContent="end">
                  <Box>
                    <p className="font-regist">ชื่อ-นามสกุล </p>
                  </Box>
                  <Form.Item name="full_name">
                    <Box>
                      <Input onChange={(e) => setFullname(e.target.value)} />
                    </Box>
                  </Form.Item>
                </Flex>
              </Box>
              <Box width={1 / 2}>
                <Flex
                  className="input-regist"
                  justifyContent="start"
                  style={{ marginLeft: "40px" }}
                >
                  <Box>
                    <p className="font-regist">เบอร์โทรศัพท์ </p>
                  </Box>
                  <Form.Item name="phone">
                    <Box>
                      <Input onChange={(e) => setPhone(e.target.value)} />
                    </Box>
                  </Form.Item>
                </Flex>
              </Box>
            </Flex>

            <Flex>
              <Box width={1 / 2}>
                <Flex className="input-regist" justifyContent="end">
                  <Box>
                    <p className="font-regist">คณะ </p>
                  </Box>
                  <Form.Item name="faculty">
                    <Select
                      size="middle"
                      style={{ width: 220 }}
                      defaultValue={facultyData[0]}
                      onChange={handleFacultyChange}
                    >
                      {facultyData.map((faculty) => (
                        <Option key={faculty}>{faculty}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Flex>
              </Box>
              <Box width={1 / 2}>
                <Flex
                  className="input-regist"
                  justifyContent="start"
                  style={{ marginLeft: "40px" }}
                >
                  <Box>
                    <Flex className="input-regist" justifyContent="end">
                      <Box>
                        <p className="font-regist">สาขาวิชา </p>
                      </Box>
                      <Form.Item>
                        <Select
                          size="middle"
                          style={{ width: 220 }}
                          value={majorDat}
                          onChange={onMajorChange}
                        >
                          {faculties.map((major) => (
                            <Option key={major}>{major}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </Flex>
            <Flex>
              <Box width={1 / 2}>
                <Flex className="input-regist" justifyContent="end">
                  <p className="font-regist">นัดหมายสัมภาษณ์ </p>
                  <Form.Item name="description">
                    <Flex>
                      <TextArea
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="สามารถวางลิงก์ได้"
                      ></TextArea>
                    </Flex>
                  </Form.Item>
                </Flex>
              </Box>
            </Flex>
          </Form>
        </Flex>

        {/* ---------------------------Submit-------------------------- */}

        <Flex className="contentsHome">
          <Button
            htmlType="submit"
            className="btn-teacher-save"
            style={{
              fontSize: "24px",
              padding: "0px 50px 35px 50px",
              marginTop: 50,
              borderRadius: "5px",
            }}
            onClick={() => handleRegister()}
          >
            บันทึก
          </Button>
        </Flex>
      </Layouts>
    </>
  );
}

export default Dashboard;
