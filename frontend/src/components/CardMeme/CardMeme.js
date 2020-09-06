import React from "react";
import { useHistory } from "react-router-dom";
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
  let history = useHistory();

  const {
    user,
    category,
    title,
    image,
    upvotes,
    downvotes,
    vote,
    id,
  } = props.prop;
  const voteMeme = props.voteMeme;
  const viewMeme = (id) => {
    history.push(`/meme/${id}`);
  };
  console.log("hola", vote);
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
        extra={<h2 onClick={() => viewMeme(id)}>{title}</h2>}
        style={{ width: "100%", height: "60%" }}
        cover={<img alt="example" src={image} onClick={() => viewMeme(id)} />}
        actions={[
          <>
            {vote === 1 && (
              <UpCircleTwoTone
                key="upCircle"
                onClick={() => voteMeme(true, 1, id)}
              />
            )}
            {vote !== 1 && (
              <UpCircleOutlined
                key="upCircle"
                onClick={() => voteMeme(false, 1, id)}
              />
            )}
            {upvotes}
          </>,
          <>
            {vote === 0 && (
              <DownCircleTwoTone
                key="upCircle"
                onClick={() => voteMeme(true, 0, id)}
              />
            )}
            {vote !== 0 && (
              <DownCircleOutlined
                key="upCircle"
                onClick={() => voteMeme(false, 0, id)}
              />
            )}
            {downvotes}
          </>,
          category.name,
          <MessageOutlined key="message" onClick={() => viewMeme(id)} />,
        ]}
      ></Card>
    </>
  );
}
