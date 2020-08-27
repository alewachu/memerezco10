import React from "react";
import "./CardMeme.scss";
import { Card, Avatar, Comment } from "antd";
import {
  DownCircleOutlined,
  UpCircleOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function CardMeme() {
  return (
    <Card
      className="card-meme"
      title={
        <Comment
          author={"Han Solo"}
          avatar={<Avatar size="large" icon={<UserOutlined />} />}
        />
      }
      extra={<h2>Titulo del meme</h2>}
      style={{ width: "100%" }}
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <>
          <UpCircleOutlined key="upCircle" />
          15156516
        </>,
        <>
          <DownCircleOutlined key="downCircle" />
          545
        </>,
        "Categoria",
        <MessageOutlined key="message" />,
      ]}
    ></Card>
  );
}
