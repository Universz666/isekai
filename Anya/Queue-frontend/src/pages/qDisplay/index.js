import { React, useState, useEffect } from "react";
import Landing from "../../components/LayoutsLanding";
import { Flex, Box } from "reflexbox";
import { Card, Col, Row, Divider, Input, Button } from "antd";
import { NotificationOutlined, CheckCircleOutlined } from "@ant-design/icons";

import Link from "next/link";

function qDisplay() {
  const [queueData, setQueueData] = useState();
  const [eventdata, setEventdata] = useState();
  const [status, setStatus] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState();
  const [line, setLine] = useState();

  let ws = null;

  useEffect(() => {
    const eventdata = JSON.parse(localStorage.getItem("eventdata"));
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserData(userData);
      setLine(userData.lineNotify);
    }
    setEventdata(eventdata);
    ws = new WebSocket("ws://localhost:8000/ws");
    setInterval(async () => {
      // console.log("Interva");
      if (eventdata) {
        const userJson = {
          eventId: eventdata.id,
          userId: userData.id,
        };
        ws.send(JSON.stringify(userJson));
      }
      // console.log("test send");
      await onmeaage();
    }, 1000);
  }, []);

  const onmeaage = () => {
    ws.onmessage = (event) => {
      // console.log("xx");
      const dump = JSON.parse(event?.data);
      if (dump) {
        setQueueData(dump);
        if (dump?.status === "interviewing") {
          setStatus(true);
          setSuccess(false);
        } else if (dump?.status === "success") {
          setStatus(false);
          setSuccess(true);
        } else {
          setStatus(false);
          setSuccess(false);
        }
      }
      //
    };
  };

  // const date = new Date(eventdata?.startDate);

  return (
    <Landing>
      <Flex style={{ background: "#F6F6F6" }}>
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

      {queueData ? (
        <div className="site-card-border-less-wrapper">
          <Row justify="center">
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Flex className="contentsHome">
                <Card
                  className="card-box-q"
                  style={{ backgroundColor: "#0B3B7D", margin: 20 }}
                >
                  <p style={{ fontSize: "18px" }}>ผู้เข้าสัมภาษณ์ทั้งหมด</p>
                  <p className="txt-q">{queueData?.total_queue}</p>
                </Card>
              </Flex>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Flex className="contentsHome">
                <Card
                  className="card-box-q"
                  style={{ backgroundColor: "#4CAF50", margin: 20 }}
                >
                  <p style={{ fontSize: "18px" }}>คิวที่กำลังสัมภาษณ์</p>
                  <p className="txt-q">{queueData?.current_queue}</p>
                </Card>
              </Flex>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Flex className="contentsHome">
                <Card
                  className="card-box-q"
                  style={{ backgroundColor: "#E7B400", margin: 20 }}
                >
                  <p style={{ fontSize: "18px" }}>คิวของคุณ</p>
                  <p className="txt-q">{queueData?.std_queue}</p>
                </Card>
              </Flex>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="site-card-border-less-wrapper">
          <Row justify="center">
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Flex className="contentsHome">
                <Card
                  className="card-box-q"
                  style={{ backgroundColor: "#0B3B7D", margin: 20 }}
                >
                  <p style={{ fontSize: "18px" }}>ผู้เข้าสัมภาษณ์ทั้งหมด</p>
                  <p className="txt-q">0</p>
                </Card>
              </Flex>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Flex className="contentsHome">
                <Card
                  className="card-box-q"
                  style={{ backgroundColor: "#4CAF50", margin: 20 }}
                >
                  <p style={{ fontSize: "18px" }}>คิวที่กำลังสัมภาษณ์</p>
                  <p className="txt-q">0</p>
                </Card>
              </Flex>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Flex className="contentsHome">
                <Card
                  className="card-box-q"
                  style={{ backgroundColor: "#E7B400", margin: 20 }}
                >
                  <p style={{ fontSize: "18px" }}>คิวของคุณ</p>
                  <p className="txt-q">0</p>
                </Card>
              </Flex>
            </Col>
          </Row>
        </div>
      )}
      {status ? (
        <Row justify="center">
          <Card style={{ width: "calc(100vh - 50px)" }}>
            <Flex style={{ fontSize: "24px", color: "#4B4B4B" }}>
              <p>{eventdata?.major}</p>
              <p style={{ paddingLeft: "10px" }}>{eventdata?.faculty}</p>
            </Flex>
            <Flex style={{ margin: "20px 0px 0px 30px", fontSize: "18px" }}>
              <p>เข้าร่วมสอบสัมภาษณ์ได้ ณ ตอนนี้</p>
            </Flex>
            <Flex style={{ margin: "0px 0px 0px 30px", fontSize: "18px" }}>
              <Link href={queueData?.description}>
                <a target="_blank" rel="noopener noreferrer">
                  {queueData?.description}
                </a>
              </Link>
            </Flex>
          </Card>
        </Row>
      ) : success ? (
        <Row justify="center">
          <Card
            style={{ width: "calc(100vh - 200px)", backgroundColor: "#F6F6F6" }}
          >
            <Flex className="contentsHome">
              <h1 style={{ fontSize: "48px", color: "#6BD716" }}>
                สัมภาษณ์เสร็จแล้ว !!!!
              </h1>
            </Flex>
          </Card>
        </Row>
      ) : (
        <></>
      )}
      <Flex className="contentsHome">
        <Link
          href={{
            pathname: "https://notify-bot.line.me/oauth/authorize",
            query: {
              response_type: "code",
              client_id: "7F3u6WXDRwJT5lfBrMUvty",
              redirect_uri: "http://localhost:3000/success",
              scope: "notify",
              state: `${userData?.id}`,
            },
          }}
        >
          <Button
            className="btn-line"
            style={{
              fontSize: "18px",
              borderRadius: "5px",
              padding: "0px 15px 0px 15px",
            }}
          >
            <NotificationOutlined />
            รับแจ้งเตือนผ่าน LINE
          </Button>
        </Link>
      </Flex>
    </Landing>
  );
}

export default qDisplay;
