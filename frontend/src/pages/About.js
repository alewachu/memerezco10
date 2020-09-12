import React from "react";
import { useHistory } from "react-router-dom";

import { Card, Col, Row, Image } from "antd";
import "../App.scss";
const { Meta } = Card;

export default function About() {
  let history = useHistory();

  return (
    <div>
      <Row>
        <Col span={12} style={{ textAlign: "center" }}>
          <Card
            hoverable
            style={{ width: 280, margin: "5px" }}
            cover={
              <Image
                className="imagenAbout"
                alt="Foto  de alexis"
                src="https://scontent.faep8-1.fna.fbcdn.net/v/t31.0-8/16797120_10212064748672506_4541513388153657452_o.jpg?_nc_cat=105&_nc_sid=09cbfe&_nc_ohc=kM_IB_4uhcMAX_yZfR3&_nc_ht=scontent.faep8-1.fna&oh=724e7524698da90dee4526c71a6686a6&oe=5F82C363"
              />
            }
          >
            <Meta title="Bascuñan Alexis" description="Software Engineer" />
          </Card>
        </Col>
        <Col span={12} style={{ textAlign: "center" }}>
          <Card
            hoverable
            style={{ width: 280, margin: "5px" }}
            cover={
              <Image
                className="imagenAbout"
                alt="Foto de Ivan"
                src="https://scontent.faep8-2.fna.fbcdn.net/v/t31.0-1/c0.78.200.200a/p200x200/14468717_10209360489743039_2613642932811376117_o.jpg?_nc_cat=104&_nc_sid=7206a8&_nc_ohc=cG2BgdKXMHkAX-iTGLf&_nc_ht=scontent.faep8-2.fna&oh=4ed34fb951efb3f7cba547acb37a2725&oe=5F826E0C"
              />
            }
          >
            <Meta
              title="Wasilewski Ivan Alejandro"
              description="Software Engineer"
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ textAlign: "center" }}>
          <Card
            hoverable
            style={{ width: 280, margin: "5px" }}
            cover={
              <Image
                className="imagenAbout"
                alt="Foto de Diego"
                src="https://scontent.faep8-2.fna.fbcdn.net/v/t1.0-9/19029665_1321319801250285_8187147560062178936_n.jpg?_nc_cat=109&_nc_sid=09cbfe&_nc_ohc=TOsiR9IIR5sAX9PxChe&_nc_ht=scontent.faep8-2.fna&oh=28f0bc5579dd7a25a0b152ff77f684ad&oe=5F84D267"
              />
            }
          >
            <Meta
              title="Montes Diego Nicolas"
              description="Software Engineer"
            />
          </Card>
        </Col>
        <Col span={12} style={{ textAlign: "center" }}>
          <Card
            hoverable
            style={{ width: 280, margin: "5px" }}
            cover={
              <Image
                className="imagenAbout"
                alt="Foto de Ariel"
                src="https://scontent.faep8-1.fna.fbcdn.net/v/t1.0-9/15940501_1266923510021507_3739048722995912489_n.jpg?_nc_cat=111&_nc_sid=174925&_nc_ohc=e9zxnfrPzzkAX_j-a4d&_nc_ht=scontent.faep8-1.fna&oh=f149a9fcbe9d163eeee8a41c7bbd6d4c&oe=5F84717F"
              />
            }
          >
            <Meta title="Villalobos Ariel" description="Software Engineer" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
