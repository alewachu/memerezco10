import React, { useState } from "react";
import { Row, Col } from "antd";

import {
  UpCircleTwoTone,
  DownCircleTwoTone,
  HomeTwoTone,
} from "@ant-design/icons";

import "./MenuBottom.scss";
export default function MenuBottom() {
    
  const [ranking, setRanking] = useState(false);

  const changeRanking = () => {
    setRanking(!ranking);
  };

  return (
    <Row className="footer">
      <Col span={12}>
        <h2 className="option">
          <HomeTwoTone />
          Home
        </h2>
      </Col>
      <Col span={12}>
        <h2 className="option" onClick={() => changeRanking()}>
          Ranking
          {ranking && <UpCircleTwoTone />}
          {!ranking && <DownCircleTwoTone />}
        </h2>
      </Col>
    </Row>
  );
}
