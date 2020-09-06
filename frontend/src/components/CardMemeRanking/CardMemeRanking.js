import React from "react";
import "./CardMemeRanking.scss";
import { Card } from "antd";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";

export default function CardMemeRanking(props) {
  const { title, image, upvotes, downvotes } = props.prop;
  const tipeRanking = props.tipeRanking;
  return (
    <Card
      className="card-meme-ranking"
      title={<small>{title}</small>}
      cover={<img alt="example" src={image} />}
      actions={[
        <>
          {tipeRanking === "downvotes" && (
            <>
              <DownCircleOutlined />
              <div>{downvotes}</div>
            </>
          )}
        </>,
        <>
          {tipeRanking === "upvotes" && (
            <>
              <UpCircleOutlined /> <div>{upvotes}</div>
            </>
          )}
        </>,
      ]}
    ></Card>
  );
}
