import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { Layout, Menu, Breadcrumb, Card, Row, Col, List, Avatar } from "antd";
import CreateComment from "../components/CreateComment/CreateComment";
const { Meta } = Card;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function DetailMeme({ match }) {
  //se obtiene el valor de la query string
  const memeId = match.params.id;
  const [meme, setMeme] = useState(null);
  const comments = [
    {
      user: {
        name: "ariel",
      },
      comment: "hola jaja",
    },
    {
      user: {
        name: "marcos",
      },
      comment: "jaja me mato de la risa jaja",
    },
  ];

  useEffect(() => {
    async function getMeme() {
      await fetch(
        `https://5f4db01ceeec51001608ed96.mockapi.io/api/meme/${memeId}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //console.log(data);
          setMeme(data);
        });
    }
    getMeme();
  }, [memeId]);

  async function onSubmitComment() {}
  return (
    <>
      {meme && (
        <div style={{ marginLeft: "25%", marginRight: "25%" }}>
          <CardMeme prop={meme}></CardMeme>
          <Card>
            <Comments comments={comments}></Comments>
          </Card>
          
          <Card>
            <CreateComment show={true}></CreateComment>
          </Card>
        </div>
      )}
    </>
  );

  function Comments({ comments }) {
    
    if (comments.length === 0) {
      return null;
    }
    return (
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item>
            <List.Item.Meta
              key={comment.id}
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={<strong>{comment.user.name}</strong>}
              description={comment.comment}
            />
          </List.Item>
        )}
      />
    );
  }
}
