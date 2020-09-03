import React from "react";
import "./CardMemeRanking.scss";
import { Card } from "antd";
import { DownCircleOutlined } from "@ant-design/icons";

export default function CardMemeRanking(prop) {
  return (
    <Card
      className="card-meme-ranking"
      title={"Titulo"}
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <>
          <DownCircleOutlined key="downCircle" />
          <div>545</div>
        </>,
      ]}
    ></Card>
  );
}
