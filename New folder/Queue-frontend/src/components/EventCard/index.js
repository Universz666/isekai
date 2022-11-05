import { Button, Card, Col, Row, Divider } from "antd";
import { React, useState } from "react";
import { Flex, Box } from "reflexbox";
import { CopyOutlined, EllipsisOutlined } from "@ant-design/icons";
import Router from "next/router";

import { CopyToClipboard } from "react-copy-to-clipboard";

import useSWR from "swr";
import Link from "next/link";

function EventCard() {
  const copyUrl = `http://localhost:3000/event/`;



  const url = "http://localhost:8000/api/v1/eventInterview";
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(url, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const eventArray = [];
  if (data) {
    for (let i = 0; i < data?.detail.length; i++) {
      eventArray.push(data?.detail[i]);
    }
  }



  return (
    <>
      {eventArray[0] ? (
        <div className="site-card-border-less-wrapper">
          <Row justify="space-between">
            {eventArray.map((eventdata) => (
              <Col
                xs={{ span: 24 }}
                ms={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
                xl={{ span: 8 }}
                xxl={{ span: 8 }}
              >
                <Card
                  key={eventdata}
                  bodyStyle={{ width: 300, height: 200 }}
                  style={{ marginTop: 20, margin: 5 }}
                  bordered={true}
                  title={eventdata.title}
                >
                  <p>{eventdata.faculty}</p>
                  <p>{eventdata.major}</p>
                  <Flex>
                    <Box width={1 / 2}>
                      <CopyToClipboard text={copyUrl+eventdata.requrl}>
                        <Button>
                          <CopyOutlined />
                        </Button>
                      </CopyToClipboard>
                    </Box>
                    <Box width={2 / 2}>
                      <Button
                        onClick={() =>
                          Router.push({
                            pathname: "/dashboard/interview-dashboard",
                            query: {
                              eventId: eventdata?.id,
                              requrl: eventdata?.requrl,
                            },
                          })
                        }
                      >
                        setting
                      </Button>
                    </Box>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default EventCard;
