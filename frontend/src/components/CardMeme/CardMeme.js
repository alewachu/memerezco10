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
    positive,
    id,
    idVote,
  } = props.prop;
  const voteMeme = props.voteMeme;
  const viewMeme = (id) => {
    history.push(`/meme/${id}`);
  };
  console.log("vote?", positive);
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
        cover={<img alt="example" src={image} onClick={() => viewMeme(id)} />}
        actions={[
          <>
            {positive === 1 && (
              <UpCircleTwoTone
                key="upCircle"
                onClick={() => voteMeme(1, id, idVote, positive)}
              />
            )}
            {positive !== 1 && (
              <UpCircleOutlined
                key="upCircle"
                onClick={() => voteMeme(1, id, idVote, positive)}
              />
            )}
            {upvotes}
          </>,
          <>
            {positive === 0 && (
              <DownCircleTwoTone
                key="upCircle"
                onClick={() => voteMeme(0, id, idVote, positive)}
              />
            )}
            {positive !== 0 && (
              <DownCircleOutlined
                key="upCircle"
                onClick={() => voteMeme(0, id, idVote, positive)}
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
