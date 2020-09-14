import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { Card, Avatar, Comment, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CreateComment from "../components/CreateComment/CreateComment";
import { commentMeme, commentParent } from "../helpers/meme";
import { get, post, eliminate, put } from "../helpers/service";
import { getToken } from "../helpers/authentication";

export default function DetailMeme({ match, userAuth, history }) {
  //se obtiene el valor de la query string
  const memeId = match.params.id;
  const [meme, setMeme] = useState(null);
  const [commentFather, setCommentFather] = useState(null);

  useEffect(() => {
    const getMeme = async () => {
      const response = await get(`/api/v1/memes/${memeId}`);
      setMeme(response.data);
    };
    getMeme();
  }, [memeId]);

  const onSubmitComment = async (message) => {
    if (!userAuth) {
      confirm();
      return;
    }
    const memeWithCommentUpdate = await commentMeme(meme, message);
    setMeme(memeWithCommentUpdate);
  };

  const onClickReply = (fatherComment) => {
    if (!userAuth) {
      confirm();
      return;
    }

    setCommentFather(fatherComment);
  };
  const onSubmitChildrenComment = async (message) => {
    const memeWithCommentUpdate = await commentParent(
      meme,
      message,
      commentFather
    );
    setMeme(memeWithCommentUpdate);
  };
  /* Muestra un modal cuando el usuario no inicio sesion y quiere comentar*/
  const confirm = () => {
    Modal.confirm({
      title: "Alert",
      icon: <ExclamationCircleOutlined />,
      content: "You need to login to vote",
      onOk: login,
      okText: "Log in",
      cancelText: "Cancel",
    });
  };
  /**
   *@description Controla el voto de un meme. Si no esta logeado llama la funcion que abre un modal
   *  Si no habia votado hace post, si el voto es contrario al votado actualiza el voto y si presiona en el mismo voto lo elimina
   * @param {*} tipo
   * @param {*} meme
   * @param {*} voto
   * @param {*} positive
   */
  const voteMeme = (tipo, meme, voto, positive) => {
    if (getToken()) {
      if (voto) {
        if (tipo === positive) {
          eliminate("/api/v1/votes", voto);
        } else {
          put("/api/v1/votes", voto);
        }
      } else {
        post("/api/v1/votes", {
          meme,
          positive: tipo,
        });
      }
    } else {
      confirm();
    }
  };
  /* Funcion para redirigir al login*/
  const login = () => {
    history.push("/login");
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

  if (meme?.allComments && meme.allComments.length > 0) {
    meme.allComments.map(async (comment) => {
      comment.urlAvatar = await getUrlImage(comment);
    });
  }

  return (
    <>
      {meme && (
        <div className="container-content">
          <CardMeme prop={meme} voteMeme={voteMeme}></CardMeme>
          <Card className="container-comment">
            <Comments comments={meme.allComments}></Comments>
            <div>
              <CreateComment
                show={true}
                onSubmitComment={onSubmitComment}
              ></CreateComment>
            </div>
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
              author={<label>{comment.user.name}</label>}
              avatar={
                <Avatar
                  src={
                    comment.urlAvatar
                      ? comment.urlAvatar
                      : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  }
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
              {comment.id === commentFather && userAuth && (
                <CreateComment
                  show
                  onSubmitComment={onSubmitChildrenComment}
                ></CreateComment>
              )}
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
          key={comment.id}
          content={<p>{comment.comment}</p>}
          author={<label>{comment.user.name}</label>}
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
