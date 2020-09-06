import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { Card, List, Avatar } from "antd";
import CreateComment from "../components/CreateComment/CreateComment";
import { commentMeme } from "../helpers/meme";
import { getToken } from "../helpers/authentication";
import Axios from "axios";
export default function DetailMeme({ match }) {
  //se obtiene el valor de la query string
  const memeId = match.params.id;
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    async function getMeme() {
      await fetch(`http://localhost:3001/api/v1/memes/${memeId}`)
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
    const memeWithCommentUpdate = await commentMeme(meme, message, getToken());
    setMeme(memeWithCommentUpdate);
  }
  const getUrlImage = async (comment) => {
    let url;
    if (comment.user.id) {
      let id = comment.user.id;
      url = await Axios.get(
        `http://localhost:3001/api/v1/users/photo/${id}`
      ).then((url) => {
        return url.data;
      });
    }
    console.log(url);
    return url;
  };
  return (
    <>
      {meme && (
        <div style={{ marginLeft: "25%", marginRight: "25%" }}>
          <CardMeme prop={meme}></CardMeme>
          <Card>
            <Comments comments={meme.allComments}></Comments>
          </Card>

          <Card>
            <CreateComment
              show={true}
              onSubmitComment={onSubmitComment}
            ></CreateComment>
          </Card>
        </div>
      )}
    </>
  );

  function Comments({ comments }) {
    console.log(comments);
    if (!comments || comments.length === 0) {
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
              avatar={<Avatar src={getUrlImage(comment)} />}
              title={<strong>{comment.user.name}</strong>}
              description={comment.comment}
            />
          </List.Item>
        )}
      />
    );
  }
}
