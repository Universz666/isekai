import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Flex, Box } from "reflexbox";
import { Input, Button, Row, Col, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

import { register_Users } from "../../../pages/api";

const { TextArea } = Input;

function TeacherForm() {
  const router = useRouter();
  const [authdata, setAuthdata] = useState();
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("eventdata"));
    // console.log(item)
    if (items) {
      setEventData(items);
    }
  }, []);
  const [eventdata, setEventData] = useState()


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

  const { data: session } = useSession();


  const handleRegister = async () => {
    const payLoad = {
      email: session?.user.email,
      username: session?.user.name,
      fullName: fullname,
      phone: phone,
      role: "teacher",
      faculty: facultys,
      majors: majorDat,
      description: description,
    };
    console.log(payLoad);
    const requrl = eventdata.requrl;


    try {
      await register_Users(payLoad).then((response) => {
        if (response.status == 201) {
          console.log("respone ===>", response);
          localStorage.setItem("userId", response.data?.userId)
          localStorage.setItem("userRole", payLoad.role)
          setTimeout(() => {
            window.location.replace("/event/" + requrl)
          }, 1000);
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
                <p className="font-regist">ชื่อ-นามสกุล </p>
              </Box>
              <Box>
                <Input
                  style={{ width: 200 }}
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
              <Box width={1 / 2}>
                <p className="font-regist">เบอร์โทรศัพท์ </p>
              </Box>
              <Box>
                <Input
                  style={{ width: 200 }}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>
            </Flex>
          </Col>
        </Flex>
        <Flex>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex className="input-regist" justifyContent="end">
              <Box>
                <p className="font-regist">คณะ </p>
              </Box>
              <Box>
                <Select
                  size="large"
                  style={{ width: 200 }}
                  defaultValue={facultyData[0]}
                  onChange={handleFacultyChange}
                >
                  {facultyData.map((faculty) => (
                    <Option key={faculty}>{faculty}</Option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Col>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Flex
              className="input-regist"
              justifyContent="start"
              style={{ marginLeft: "40px" }}
            >
              <Box width={1 / 2}>
                <p className="font-regist">สาขาวิชา </p>
              </Box>
              <Box>
                <Select
                  size="large"
                  style={{ width: 200 }}
                  value={majorDat}
                  onChange={onMajorChange}
                >
                  {faculties.map((major) => (
                    <Option key={major}>{major}</Option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Col>
        </Flex>
        <Flex>
          <Col span={24}>
            <Flex className="input-regist" justifyContent="center">
              <p className="font-regist">นัดหมายสัมภาษณ์ </p>
            </Flex>
          </Col>
        </Flex>
        <Flex>
          <Col span={24}>
            <Flex className="input-regist" justifyContent="end">
              <TextArea
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{marginLeft:50}}
                placeholder="สามารถวางลิงก์ได้"
              ></TextArea>
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
                marginTop: 30,
              }}
              onClick={() => handleRegister()}
            >
              ยืนยันการลงทะเบียน
            </Button>
          </Flex>
        </Col>
      </Flex>
    </Row>
  );
}

export default TeacherForm;
