import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import CardMemeRanking from "../components/CardMemeRanking/CardMemeRanking";
import { List, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import Axios from "axios";
import "../App.scss";

export default function Home(props) {
  const { isMobile } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(5);
  const [memeRanking, setMemeRanking] = useState([]);

  useEffect(() => {
    async function fetchMemes() {
      let memes = await fetchData();
      setData([...memes, ...data]);
      setSkip(skip + 5);
    }
    async function rankingMeme() {
      let ranking = await fetchDataRankingPositives();
      setMemeRanking([...ranking, ...memeRanking]);
    }
    if (data.length < 5) {
      fetchMemes();
    }
    if (memeRanking.length < 3) {
      rankingMeme();
    }
  });

  const fetchDataRankingPositives = async () => {
    const response = await Axios.get(
      `http://localhost:3001/api/v1/memes?sort=upvotes&limit=3`
    );
    return response.data.data;
  };

  const fetchData = async () => {
    const response = await Axios.get(
      `http://localhost:3001/api/v1/memes?limit=5&skip=${skip}`
    );
    return response.data.data;
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
    if (!votado) {
      Axios({
        method: "POST",
        url: "http://localhost:3001/api/v1/votes",
        data: {
          meme: { _id: meme },
          positive: tipo,
        },
        headers: {
          "Content-Type": "application/json",
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTAyZTlhZDZkYWMzMGY5MDAyZjFmOSIsIm5hbWUiOiJQcnVlYmE2NzY3IiwibWFpbCI6Im1haWwiLCJpYXQiOjE1OTkwOTAzNDQsImV4cCI6MTU5OTM0OTU0NH0.sj9ssTi1oaPnfzQPm_5vYUkhVGkKNcEuPu_NWXhTDvo",
        },
      });

      console.log("aca", tipo, meme);
    } else {
      console.log(tipo, meme);
    }
  };

  const styleCard = !isMobile
    ? { paddingLeft: "20%", paddingRight: "20%" }
    : {};
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
        <div className="ranking-col">
          {memeRanking.map((item, index) => {
            return (
              <div className="ranking-meme">
                <CardMemeRanking key={item} prop={item} />
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
