import { React, useState } from "react";
import { Flex, Box } from "reflexbox";
import { Button, Switch } from "antd";
import { useRouter } from "next/router";

import CompInterview from "../../../components/Dashboard/_interviews";
import Landing from "../../../components/LayoutsLanding";

function Interviews() {
  const [checkstate, setCheckStae] = useState(true);
  const router = useRouter();

  function onChange(checked) {
    setCheckStae(checked);
  }

  return (
    <Landing>
      <Flex>
        <Box>
          <p>สถานะ : </p>
        </Box>
        <Box style={{ padding: "0 10px" }}>
          <Switch
            checkedChildren="พร้อม"
            unCheckedChildren="ไม่พร้อม"
            defaultChecked
            onChange={onChange}
          />
        </Box>
        <Box>
          <Button className="btn-login" style={{width:"80px", height:"30px"}} onClick={() => router.push("/")}>Home</Button>
        </Box>
      </Flex>
      {checkstate ? <CompInterview /> : <></>}
    </Landing>
  );
}

export default Interviews;
