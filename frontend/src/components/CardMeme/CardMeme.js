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
import CreateComment from "../CreateComment/CreateComment";
export default function CardMeme(props) {
  const {
    user,
    category,
    title,
    image,
    upvotes,
    downvotes,
    comments,
    vote,
  } = props.prop;

  function onSubmitComment(mensaje){
    //await createComment(meme,mensaje)

  }


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
            {vote === 1 && <UpCircleTwoTone key="upCircle" />}
            {vote !== 1 && <UpCircleOutlined key="upCircle" />}
            {upvotes}
          </>,
          <>
            {vote === 0 && <DownCircleTwoTone key="upCircle" />}
            {vote !== 0 && <DownCircleOutlined key="upCircle" />}
            {downvotes}
          </>,
          category.name,
          <MessageOutlined key="message" />,
        ]}
      >
       
      </Card>
     
      
    </>
  );
}
