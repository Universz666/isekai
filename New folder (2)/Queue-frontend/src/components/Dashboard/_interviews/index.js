import { React, useState, useEffect } from "react";
import { Card, Button, Modal } from "antd";
import { Box, Flex } from "reflexbox";
import styled from "@emotion/styled";
import Router from "next/router";

import { update_status } from "../../../pages/api";

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

function CompInterview() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [studentData, setStudentData] = useState();
  const [eventData, setEventData] = useState()
  const [userData, setUserdata] = useState();
  const [chkQueue, setchkQueue] = useState(false);

  let wsm = null;
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserdata(userData);
    const eventdata = JSON.parse(localStorage.getItem("eventdata"));
    setEventData(eventdata)
    wsm = new WebSocket("ws://localhost:8000/ws/matchup");
    setInterval(async () => {
      if (userData) {
        const matching = {
          eventId: eventdata?.id,
          userId: userData?.id,
        };
        // console.log(matching);
        wsm.send(JSON.stringify(matching));
      }
      await onmeaage();
    }, 3000);
  }, []);

  const onmeaage = () => {
    wsm.onmessage = (event) => {
      const dump = JSON.parse(event?.data);
      if (dump) {
        setStudentData(dump);
        localStorage.setItem("std_data", JSON.stringify(dump));
        console.log("WebSocket message received:", dump);
        if (dump?.outofqueue) {
          setchkQueue(false);
        } else {
          setchkQueue(true);
          setIsModalVisible(true);
        }
      }
    };
  };

  const onStart = async () => {
    setIsModalVisible(true);
  };

  const onAccept = async () => {
    if (studentData) {
      Router.push({
        pathname: "/dashboard/interviews/matchup",
        query: {
          file: studentData?.file,
          fullName: studentData?.fullName,
          phoneNumber: studentData?.phoneNumber,
          province: studentData?.province,
          school: studentData?.school,
          stdId: studentData?.stdId,
          stdQueue: studentData?.stdQueue,
          eventId: eventData?.id,
        },
      });
    }
    const payLoad = {
      userId: userData?.id,
      studentId: studentData?.stdId,
      userStatus: "interviewing",
    };

    try {
      await update_status(payLoad).then((response) => {
        if (response.status == 200) {
          console.log("respone ===>", response);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const onDecline = async () => {
    setIsModalVisible(false);
  };
  console.log(chkQueue);

  return (
    <>
      {chkQueue ? (
        <Card style={{ width: "100%", height: "calc(100vh - 100px)" }}>
          <Flex className="contentsHome">
            <Button
              className="btn-teacher-save"
              style={{
                fontSize: "24px",
                padding: "0px 50px 35px 50px",
                marginTop: 50,
                borderRadius: "5px",
              }}
              onClick={() => onStart()}
            >
              เริ่มสัมภาษณ์
            </Button>
          </Flex>
          <StyledModal
            visible={isModalVisible}
            footer={null}
            onCancel={() => setIsModalVisible(false)}
          >
            <Flex className="contentsHome" flexDirection="column">
              <Flex>
                <h3>คิวที่ {studentData?.stdQueue}</h3>
              </Flex>
              <Flex>
                <p>{studentData?.fullName}</p>
                <p>{studentData?.error}</p>
              </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="space-around">
              <Box>
                <Button className="btn-accept" onClick={() => onAccept()}>
                  ยอมรับ
                </Button>
              </Box>
              <Box>
                <Button className="btn-decline" onClick={() => onDecline()}>
                  ปฏิเสธ
                </Button>
              </Box>
            </Flex>
          </StyledModal>
        </Card>
      ) : (
        <Card style={{ width: "100%", height: "calc(100vh - 100px)" }}>
          <Flex className="contentsHome">
            <Button
              disabled
              className="btn-teacher-no"
              style={{
                fontSize: "24px",
                padding: "0px 50px 35px 50px",
                marginTop: 50,
                borderRadius: "5px",
              }}
              onClick={() => onStart()}
            >
              ไม่มีคิว
            </Button>
          </Flex>
        </Card>
      )}
    </>
  );
}

export default CompInterview;
