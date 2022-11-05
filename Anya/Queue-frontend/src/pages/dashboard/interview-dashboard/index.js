import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input, Card, Divider, Checkbox, Button, Row, Col, Table } from "antd";
import useSWR from "swr";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@ant-design/icons";

import Landing from "../../../components/LayoutsLanding";
import { Flex } from "reflexbox";

export default function interviewDashboard() {
  const router = useRouter();

  const {
    query: { eventId, requrl },
  } = router;

  const props = {
    eventId,
    requrl,
  };

  const url = `http://localhost:8000/api/v1/getResult-interview?eventId=${props.eventId}`;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(url, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const data_all = [];
  if (data) {
    for (let i = 0; i < data?.detail.length; i++) {
      data_all.push(data?.detail[i]);
    }
  }
  console.log(data);

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "fullName",
    },
    {
      title: "อีเมลล์",
      dataIndex: "email",
    },
    {
      title: "โรงเรียน",
      dataIndex: "school",
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
    },
    {
      title: "สัมภาษณ์โดย",
      dataIndex: "updateBy",
    },
    {
      title: "ผลสัมภาษณ์",
      dataIndex: "result",
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
    },
  ];

  const headers = [
    { label: "ชื่อ-นามสกุล", key: "fullName" },
    { label: "อีเมลล์", key: "email" },
    { label: "โรงเรียน", key: "school" },
    { label: "จังหวัด", key: "province" },
    { label: "สัมภาษณ์โดย", key: "updateBy" },
    { label: "ผลสัมภาษณ์", key: "result" },
    { label: "หมายเหตุ", key: "note" },
  ];
  const csvReport = {
    data: data_all,
    headers: headers,
    filename: "UBUinterviews.csv",
  };

  return (
    <Landing>
      {data.detail ? (
        <>
          <Row
            justify="center"
            style={{
              margin: 10,
              fontSize: "24px",
              color: "#4B4B4B",
            }}
          >
            {/* <p>{data.detail[0].title}</p> */}
          </Row>
          <Row justify="center" style={{ margin: 10 }}>
            <CSVLink {...csvReport}>
              {" "}
              <DownloadOutlined style={{ marginRight: "5px" }} />
              ดาวน์โหลด
            </CSVLink>
          </Row>
          <Row justify="center">
            <Table
              columns={columns}
              dataSource={data_all}
              size="large"
              tableLayout="auto"
            ></Table>
          </Row>
        </>
      ) : (
        <></>
      )}
    </Landing>
  );
}
