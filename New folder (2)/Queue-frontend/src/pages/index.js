import { React, useEffect, useState } from "react";
import { Button, Col, Input, Row } from "antd";
import { Box, Flex } from "reflexbox";
import { useRouter } from "next/router";

import Layouts from "../components/Layouts";
import ModalEvent from "../components/CreateEvent";
import EventCard from "../components/EventCard";

export default function Home() {

  return (
    <>
      <Layouts>
        <Row >
          <Col span={24}>
            <div className="container">
              <Flex>
                <Col
                  style={{
                    margin: 10,
                    fontSize: "20px",
                    color: "#4B4B4B",
                  }}
                >
                  <p>งานสัมภาษณ์เข้าศึกษาต่อมหาวิทยาลัยอุบลราชธานี</p>
                </Col>
              </Flex>
              {/* con tentCard Event */}

              <Flex className="contentsHome">
                <EventCard />
              </Flex>
              {/* Button Create */}
              <Flex className="contentsHome">
                <ModalEvent />
              </Flex>
            </div>
          </Col>
        </Row>
      </Layouts>
    </>
  );
}
