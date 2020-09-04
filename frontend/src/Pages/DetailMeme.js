import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { Layout, Menu, Breadcrumb, Card, Row, Col, List, Avatar } from "antd";
import CreateComment from "../components/CreateComment/CreateComment";
import {commentMeme} from "../helpers/meme";
import {getToken} from "../helpers/authentication";
const { Meta } = Card;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function DetailMeme({ match }) {
  //se obtiene el valor de la query string
  const memeId = match.params.id;
  const [meme, setMeme] = useState(null);


  useEffect(() => {
    async function getMeme() {
      await fetch(
        `http://localhost:3001/api/v1/memes/${memeId}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //console.log(data);
          setMeme(data.data);
        });
    }
    getMeme();
  }, [memeId]);

  /*function updateMeme(originalMeme,updatedMeme){
    setMeme((meme))=>{

    }


  }*/


  async function onSubmitComment(message) {
    const memeWithCommentUpdate=await commentMeme(meme,message,getToken());
    setMeme(memeWithCommentUpdate);
    
  

  }
  return (
    <>
      {meme && (
        <div style={{ marginLeft: "25%", marginRight: "25%" }}>
          <CardMeme prop={meme}></CardMeme>
          <Card>
            <Comments comments={meme.allComments}></Comments>
          </Card>
          
          <Card>
            <CreateComment show={true} onSubmitComment={onSubmitComment}></CreateComment>
          </Card>
        </div>
      )}
    </>
  );

  function Comments({ comments }) {
    
    if (comments.length === 0) {
      return null;
    }
    console.log(comments);
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
