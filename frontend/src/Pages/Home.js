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
import { get, post } from "../helpers/service";
export default function Home(props) {
  console.log(props);
  let history = useHistory();

  const { isMobile } = props;
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

    setInterval(() => {
      setLoading(false);
    }, 3000);
  };

  const voteMeme = (votado, tipo, meme) => {
    if (getToken()) {
      if (!votado) {
        post("/api/v1/votes", {
          meme,
          positive: tipo,
        });
      } else {
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
  const styleCard = !isMobile
    ? { paddingLeft: "20%", paddingRight: "20%" }
    : {};
  return (
    <div className="col-memes">
      <div>
        <UpCircleTwoTone onClick={() => changeTipeRankink("upvotes")} />
        <DownCircleTwoTone onClick={() => changeTipeRankink("downvotes")} />
      </div>
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          hasMore={!loading && hasMore}
          loadMore={handleInfiniteOnLoad}
          pageStart={0}
          useWindow={false}
          threshold={200}
        >
          <List
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item key={index} style={styleCard}>
                <CardMeme key={index} prop={item} voteMeme={voteMeme} />
              </List.Item>
            )}
          >
            {loading && hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
      {!isMobile && (
        <div>
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
    </div>
  );
}

// api/v1/votes
// {meme: {_id: dasdsadsa}, positive: 0}
