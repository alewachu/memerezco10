import React from "react";
import "./CardMemeRanking.scss";
import { Card } from "antd";
import { DownCircleOutlined } from "@ant-design/icons";

export default function CardMemeRanking(props) {
  const { title, image, upvotes } = props.prop;
  return (
    <Card
      className="card-meme-ranking"
      title={<small>{title}</small>}
      cover={<img alt="example" src={image} />}
      actions={[
        <>
          <DownCircleOutlined key="downCircle" />
          <div>{upvotes}</div>
        </>,
      ]}
    ></Card>
  );
}
