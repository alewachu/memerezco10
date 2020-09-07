import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { Card, List, Avatar } from "antd";
import CreateComment from "../components/CreateComment/CreateComment";
import { commentMeme } from "../helpers/meme";
import { get } from "../helpers/service";

export default function DetailMeme({ match }) {
  //se obtiene el valor de la query string
  const memeId = match.params.id;
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    const getMeme = async () => {
      const response = await get(`/api/v1/memes/${memeId}`);
      setMeme(response.data);
    };
    getMeme();
  }, [memeId]);

  const onSubmitComment = async (message) => {
    const memeWithCommentUpdate = await commentMeme(meme, message);
    setMeme(memeWithCommentUpdate);
  };
  const getUrlImage = async (comment) => {
    let url;
    if (comment.user.id) {
      const response = await get(`/api/v1/users/photo/${comment.user.id}`);
      url = response;
      return url;
    }
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
