import React from "react";

import "./CardMeme.scss";
import { Card, Avatar, Comment } from "antd";
import {
  DownCircleOutlined,
  UpCircleOutlined,
  MessageOutlined,
  UserOutlined,
  UpCircleTwoTone,
  DownCircleTwoTone,
} from "@ant-design/icons";

export default function CardMeme(props) {
  const {
    user,
    category,
    title,
    image,
    upvotes,
    downvotes,
    vote,
    _id,
  } = props.prop;
  const voteMeme = props.voteMeme;
  return (
    <>
      <Card
        className="card-meme"
        title={
          <Comment
            author={user.name}
            avatar={<Avatar size="large" icon={<UserOutlined />} />}
          />
        }
        extra={<h2>{title}</h2>}
        style={{ width: "100%", height: "60%" }}
        cover={<img alt="example" src={image} />}
        actions={[
          <>
            {vote === 1 && (
              <UpCircleTwoTone
                key="upCircle"
                onClick={() => voteMeme(true, 1, _id)}
              />
            )}
            {vote !== 1 && (
              <UpCircleOutlined
                key="upCircle"
                onClick={() => voteMeme(false, 1, _id)}
              />
            )}
            {upvotes}
          </>,
          <>
            {vote === 0 && (
              <DownCircleTwoTone
                key="upCircle"
                onClick={() => voteMeme(true, 0, _id)}
              />
            )}
            {vote !== 0 && (
              <DownCircleOutlined
                key="upCircle"
                onClick={() => voteMeme(false, 0, _id)}
              />
            )}
            {downvotes}
          </>,
          category.name,
          <MessageOutlined key="message" />,
        ]}
      ></Card>
    </>
  );
}
