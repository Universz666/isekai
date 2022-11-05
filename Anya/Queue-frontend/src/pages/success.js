import React, { Component } from "react";
import axios from "axios";
import { Button } from "antd";
import Link from "next/link";

class Success extends Component {
  static async getInitialProps(ctx) {
    const { query } = ctx;
    console.log(query);
    let data;
    try {
      if (query.code) {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", query.code);
        params.append("redirect_uri", "http://localhost:3000/success");
        params.append("client_id", "7F3u6WXDRwJT5lfBrMUvty");
        params.append(
          "client_secret",
          "KYy19TRZi8LM362QDRqpVGDXT5OHcaCAUpvLfMUkIPh"
        );

        const request = await axios.post(
          "https://notify-bot.line.me/oauth/token",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        data = request.data;

        // access token
        axios
          .post(
            `http://localhost:8000/api/v1/line_notify`,
            {
              id: query.state,
              lineNotify: data.access_token,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log("response: ", response);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } catch (e) {
      console.log(e);
    }
    return {
      code: query.code,
      token: data?.access_token,
    };
  }

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <Link href="/">
          <Button
            color="primary"
            onClick={() => window.location.replace("qDisplay")}
            variant="contained"
          >
            กลับ
          </Button>
        </Link>
      </div>
    );
  }
}

export default Success;
