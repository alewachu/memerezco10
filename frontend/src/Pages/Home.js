import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import CardMemeRanking from "../components/CardMemeRanking/CardMemeRanking";
import { List, Spin, Modal } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import "../App.scss";
import {
  ExclamationCircleOutlined,
  UpCircleTwoTone,
  DownCircleTwoTone,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { getToken } from "../helpers/authentication";
import { get, post, eliminate, put } from "../helpers/service";
export default function Home(props) {
  let history = useHistory();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(5);
  const [memeRanking, setMemeRanking] = useState([]);
  const [tipeRanking, setTipeRanking] = useState("upvotes");

  useEffect(() => {
    async function fetchMemes() {
      let memes = await fetchData();
      setData([...memes, ...data]);
      setSkip(skip + 5);
    }
    async function rankingMeme() {
      let ranking = await fetchDataRanking(tipeRanking);
      setMemeRanking([...ranking, ...memeRanking]);
    }
    if (data.length < 5) {
      fetchMemes();
    }
    if (memeRanking.length < 3) {
      rankingMeme();
    }
  });

  const fetchDataRanking = async (tipe) => {
    const response = await get(`/api/v1/memes?sort=${tipe}&limit=3`);
    return response.data;
  };

  const fetchData = async () => {
    const response = await get(`/api/v1/memes?limit=5&skip=${skip}`);
    return response.data;
  };

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
  const login = () => {
    history.push("/login");
  };
  const handleInfiniteOnLoad = async () => {
    setLoading(true);
    if (data.length > 16) {
      // message.warning('Infinite List loaded all');
      setLoading(false);
      setHasMore(false);
      return;
    }
    let array = await fetchData();
    setData([...array, ...data]);
    let arrayRanking = await fetchDataRanking();
    setMemeRanking([...arrayRanking, ...memeRanking]);
    setInterval(() => {
      setLoading(false);
    }, 3000);
  };

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

  const changeTipeRankink = async (tipe) => {
    if (tipeRanking !== tipe) {
      setMemeRanking([]);
      setTipeRanking(tipe);
      let ranking = await fetchDataRanking(tipeRanking);
      setMemeRanking([...ranking, ...memeRanking]);
    }
  };

  return (
    <div className="col-memes">
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          hasMore={!loading && hasMore}
          loadMore={handleInfiniteOnLoad}
          pageStart={0}
          useWindow={false}
          threshold={200}
        >
          <div style={{ display: "flex" }}>
            <div style={{ width: "20%" }}>categorias</div>
            <div style={{ width: "60%", marginTop: "40px" }}>
              <List
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item key={index} style={{ padding: "0px" }}>
                    <CardMeme
                      key={index}
                      prop={item}
                      voteMeme={voteMeme}
                      style={{ marginLeft: "10%", marginRight: "10%" }}
                    />
                  </List.Item>
                )}
              ></List>
            </div>
            <div
              style={{ width: "20%", textAlign: "center", marginTop: "5px" }}
            >
              <div>
                <UpCircleTwoTone
                  onClick={() => changeTipeRankink("upvotes")}
                  style={{ fontSize: "20px" }}
                />
                <big>
                  <strong>Ranking</strong>
                </big>
                <DownCircleTwoTone
                  onClick={() => changeTipeRankink("downvotes")}
                  style={{ fontSize: "20px" }}
                />
              </div>
              <List
                dataSource={memeRanking}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <CardMemeRanking
                      key={item}
                      prop={item}
                      tipeRanking={tipeRanking}
                    />
                  </List.Item>
                )}
              ></List>
            </div>
          </div>
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
}

// api/v1/votes
// {meme: {_id: dasdsadsa}, positive: 0}
/*
 {!isMobile && (
        <div style={{ maxWidth: "20ch" }}>
          {memeRanking.map((item, index) => {
            return (
              <div className="ranking-meme">
                <CardMemeRanking
                  key={item}
                  prop={item}
                  tipeRanking={tipeRanking}
                />
              </div>
            );
          })}
        </div>
      )}
      */
