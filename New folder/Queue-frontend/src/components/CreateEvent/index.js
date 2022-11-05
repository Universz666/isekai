import { React, useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { Flex, Box } from "reflexbox";
import styled from "@emotion/styled";
import Router, { useRouter } from "next/router";
import useSWR from "swr";
import { useSession, signIn, signOut } from "next-auth/react";

import { create_Event } from "../../pages/api";

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

function ModalEvent() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

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

  const [title, setTitle] = useState("");
  const [facultys, setFacultys] = useState(facultyData[0]);
  const [createDate, setCreateDate] = useState();

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

  

  const handleCreateEvent = async () => {
    let datestring =
      createDate.getFullYear() +
      "-" +
      (createDate.getMonth() + 1) +
      "-" +
      createDate.getDate() +
      " " +
      ("0" + createDate.getHours()).slice(-2) +
      ":" +
      ("0" + createDate.getMinutes()).slice(-2) +
      ":" +
      ("0" + createDate.getSeconds()).slice(-2);

    let randomPath = require("randomstring").generate(6);
    
    let userId = JSON.parse(localStorage.getItem("userData")).id;
    const payLoad = {
      title: title,
      faculty: facultys,
      major: majorDat,
      startDate: datestring,
      CreateByUserID: userId,
      requrl:randomPath
    };
    console.log(payLoad);

    try {
      await create_Event(payLoad).then((respones) => {
        if (respones.status == 200) {
          console.log("respone ==>", respones);
        }
        // setIsModalVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      });
    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <Flex flexDirection="column">
      <Flex className="contentsHome" style={{ marginTop: 50 }}>
        <Button
          className="ant-btn-primary"
          style={{
            fontSize: "24px",
            padding: "0px 40px 38px 40px",
            marginBottom: 80,
            alignItems: "center",
            borderRadius: "10px",
          }}
          onClick={() => setIsModalVisible(true) }
        >
          Create Event
        </Button>
      </Flex>
      <StyledModal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Flex className="contentsHome">
          <p style={{ fontSize: "20px", color: "#4B4B4B" }}>
            สร้างอีเว้นท์สัมภาษณ์
          </p>
        </Flex>
        <Form name="create_Event">
          <Form.Item name="title">
            <Input
              size="middle"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="faculty">
            <Select
              defaultValue={facultyData[0]}
              onChange={handleFacultyChange}
            >
              {facultyData.map((faculty) => (
                <Option key={faculty}>{faculty}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select value={majorDat} onChange={onMajorChange}>
              {faculties.map((major) => (
                <Option key={major}>{major}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="วันที่และเวลาเริ่มสัมภาษณ์">
            <Flex>
              <Box width={1 / 2}>
                <DatePicker style={{width: '100%'}} showTime onOk={(e) => setCreateDate(new Date(e))} />
              </Box>
            </Flex>
          </Form.Item>
          <Flex className="contentsHome">
            <Form.Item>
              <Button
                htmlType="submit"
                className="btn-login"
                style={{ padding: "0px 78px 0px 78px" }}
                onClick={() => handleCreateEvent()}
              >
                สร้างอีเว้นท์
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </StyledModal>
    </Flex>
  );
}

export default ModalEvent;
