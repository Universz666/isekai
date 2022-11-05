import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import { join_Event } from "../api";
import Landing from "../../components/LayoutsLanding";
import { Flex } from "reflexbox";


const Post = (props) => {
  const router = useRouter();
  const [post, setPost] = useState({});
  const [userdata, setUserdata] = useState();

  useEffect(() => {
    if (props) {
      fetchEvent(props);
    }
  }, [props]);

  let fetchEvent = (props) => {
    fetch(`http://localhost:8000/api/v1eventInterview/${props.post}`)
      .then((response) => response.json())
      .then((response) => {
        setPost(response.detail);
        localStorage.setItem("eventdata", JSON.stringify(response.detail));
      });
  };

  const date = new Date(post.startDate);

  async function handleOnJoin() {
    const userdata = await JSON.parse(localStorage.getItem("userData"));
    if (userdata) {
      registerEvent(userdata);
      if (userdata?.role == "student") {
        setTimeout(() => {
          router.push("/qDisplay");
        }, 600);
      } else if (userdata?.role == "teacher") {
        setTimeout(() => {
          router.push("/dashboard/interviews");
        }, 600);
      }
    } else {
      router.push("/registers");
    }
  }
  console.log(userdata?.role);

  const registerEvent = async (userdata) => {
    const payLoad = {
      eventId: post.id,
      userId: userdata.id,
      role: userdata.role,
    };
    console.log(payLoad);
    try {
      await join_Event(payLoad).then((response) => {
        if (response.status == 200) {
          console.log("response ==> ", response);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Landing>
        <div style={{ marginTop: 100 }}>
          <Row justify="center">
            <Col>
              <Flex
                flexDirection="column"
                className="contentsHome"
                style={{ fontSize: "24px", color: "#4B4B4B" }}
              >
                <Flex>
                  <h2 style={{ color: "#4B4B4B" }}>{post.title}</h2>
                </Flex>
                <Flex>
                  <p>{post.faculty}</p>
                </Flex>
                <Flex>
                  <p>{post.major}</p>
                </Flex>
                <Flex>
                  <p style={{ fontSize: "16px" }}>
                    Start IN {date.toLocaleString()}
                  </p>
                </Flex>
                <Flex>
                  <Button
                    htmlType="submit"
                    className="ant-btn-primary"
                    style={{
                      fontSize: "18px",
                      borderRadius: "5px",
                      padding: "0px 20px 0px 20px",
                      cursor: "pointer",
                    }}
                    onClick={handleOnJoin}
                  >
                    เข้าร่วมสัมภาษณ์
                  </Button>
                </Flex>
              </Flex>
            </Col>
          </Row>
        </div>
      </Landing>
    </>
  );
};

Post.getInitialProps = ({ query }) => {
  return {
    post: query.id,
  };
};

export default Post;
