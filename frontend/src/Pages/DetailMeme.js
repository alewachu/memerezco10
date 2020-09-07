import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { Card, List, Avatar, Comment, message, Form } from "antd";
import CreateComment from "../components/CreateComment/CreateComment";
import { commentMeme } from "../helpers/meme";
import { get } from "../helpers/service";

export default function DetailMeme({ match }) {
  //se obtiene el valor de la query string
  const memeId = match.params.id;
  const [meme, setMeme] = useState(null);
  const [commentFather,setCommentFather]= useState(null);

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

  const onClickReply = (fatherComment) => {
    //alert(`comentando a ${fatherComment}`);
    //await commentMeme(fatherComment,message);
    //setCommentChildren(true);
    setCommentFather(fatherComment);

  };
  const onSubmitChildrenComment = async () =>{
    alert(`enviando comentario a comentario id ${commentFather}`);
  }
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
    console.log(comments);
    return (
      <>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              actions={[
                <>
                  <span
                    key="comment-nested-reply-to"
                    onClick={() => onClickReply(comment.id)}
                  >
                    Reply
                  </span>
                </>,
              ]}
              author={<a>{comment.user.name}</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={<p>{comment.comment}</p>}
            >
              {comment.children.length > 0 && (
                <>
                  <ChildrenComments
                    childrenComments={comment.children}
                  ></ChildrenComments>
                </>
              )}
              {comment.id == commentFather && <CreateComment show onSubmitComment={onSubmitChildrenComment}></CreateComment>}
            </Comment>
          );
        })}
      </>
    );
  }
  function ChildrenComments({ childrenComments }) {
    return childrenComments.map((comment) => {
      return (
        <Comment
          content={<p>{comment.comment}</p>}
          author={<a>{comment.user.name}</a>}
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          }
        ></Comment>
      );
    });
  }
}
