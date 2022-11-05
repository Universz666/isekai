import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input, Card, Divider, Checkbox, Button } from "antd";
import { Box, Flex } from "reflexbox";

import Landing from "../../../../components/LayoutsLanding";
import { result_Interview } from "../../../../pages/api";

const { TextArea } = Input;

export default function matchup() {
  const router = useRouter();

  const {
    query: { file, fullName, phoneNumber, province, school, stdId, stdQueue, eventId },
  } = router;

  const props = {
    file,
    fullName,
    phoneNumber,
    province,
    school,
    stdId,
    stdQueue,
    eventId
  };

  const [userData, setUserdata] = useState();
  const [checked, setChecked] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserdata(userData);
  }, []);

  console.log(props.file);

  const onChange = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  const label = `${checked ? "ผ่าน" : "ไม่ผ่าน"}`;

  const newtab = () => {
    window.open(props.file, "_blank");
  };

  const handleSaveSubmit = async () => {
    const payLoad = {
      studentId: props?.stdId,
      result: label,
      note: note,
      updateBy: userData?.id,
      eventId: props?.eventId,
    };
    console.log(payLoad);

    try {
      await result_Interview(payLoad).then((respones) => {
        if (respones.status == 200) {
          console.log("respone ===>", respones);
          router.back();
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Landing>

      <Card style={{ width: "100%", height: "calc(100vh - 100px)" }}>
        <p style={{ fontSize: "20px", marginLeft: 60 }}>
          {" "}
          คิวที่ {props?.stdQueue}{" "}
        </p>
        <Flex style={{ marginLeft: 60 }}>
          <Box width={1 / 2}>
            <Flex>
              <p>{props?.fullName}</p>
            </Flex>
            <Flex>
              <p>{props?.school}</p>
            </Flex>
            <Flex>
              <Box>
                <p> Portfolio : </p>
              </Box>
              <Box style={{ paddingLeft: 5 }}>
                <a onClick={() => newtab()}>{props?.file}</a>
              </Box>
            </Flex>
          </Box>
          <Box width={1 / 2}>
            <Flex>
              <p>{props?.phone}</p>
            </Flex>
            <Flex>
              <p>{props?.province}</p>
            </Flex>
          </Box>
        </Flex>
        <Divider />
        <Flex className="contentsHome">
          <p style={{ fontSize: "20px" }}>ผลการสัมภาษณ์</p>
        </Flex>
        <Flex style={{ marginLeft: 60 }}>
          <Box width={1 / 2}>
            <Flex>
              <Box style={{ marginRight: 20 }}>
                <p>
                  <Checkbox checked={checked} onChange={onChange}>
                    {label}
                  </Checkbox>
                </p>
              </Box>
            </Flex>
            <Flex>
              <p>หมายเหตุ</p>
            </Flex>
            <Flex>
              <TextArea
                rows={6}
                onChange={(e) => setNote(e.target.value)}
              ></TextArea>
            </Flex>
          </Box>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-around">
          <Box>
            <Button
              className="btn-teacher-save"
              style={{
                fontSize: "24px",
                padding: "0px 50px 35px 50px",
                marginTop: 50,
                borderRadius: "5px",
              }}
              onClick={() => handleSaveSubmit()}
            >
              บันทึก
            </Button>
          </Box>
        </Flex>
      </Card>
    </Landing>
  );
}
