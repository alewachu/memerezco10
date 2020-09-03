import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import CardMemeRanking from "../components/CardMemeRanking/CardMemeRanking";
import { List, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import "../App.scss";

const memes = [
  {
    _id: "dlqwmk21klmdlwkdwlq1234",
    user: {
      _id: "dlqwmk21klmdlwkdwlq123",
      name: "Juan Román Riquelme",
    },
    category: {
      _id: "dlqwmk21klmdlwkdwlq",
      name: "Soccer",
      slug: "/soccer",
    },
    title: "El oso polar",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    upvotes: 1024,
    downvotes: 512,
    comments: 256,
    vote: 1, // null/0/1
  },
  {
    _id: "dlqwmk21klmdlwkdwlq1234",
    user: {
      _id: "dlqwmk21klmdlwkdwlq123",
      name: "Juan Román Riquelme",
    },
    category: {
      _id: "dlqwmk21klmdlwkdwlq",
      name: "Soccer",
      slug: "/soccer",
    },
    title: "El oso polar",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    upvotes: 1024,
    downvotes: 512,
    comments: 256,
    vote: 0, // null/0/1
  },
  {
    _id: "dlqwmk21klmdlwkdwlq1234",
    user: {
      _id: "dlqwmk21klmdlwkdwlq123",
      name: "Juan Román Riquelme",
    },
    category: {
      _id: "dlqwmk21klmdlwkdwlq",
      name: "Soccer",
      slug: "/soccer",
    },
    title: "El oso polar",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    upvotes: 1024,
    downvotes: 512,
    comments: 256,
    vote: 1, // null/0/1
  },
  {
    _id: "dlqwmk21klmdlwkdwlq1234",
    user: {
      _id: "dlqwmk21klmdlwkdwlq123",
      name: "Juan Román Riquelme",
    },
    category: {
      _id: "dlqwmk21klmdlwkdwlq",
      name: "Soccer",
      slug: "/soccer",
    },
    title: "El oso polar",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    upvotes: 1024,
    downvotes: 512,
    comments: 256,
    vote: 1, // null/0/1
  },
  {
    _id: "dlqwmk21klmdlwkdwlq1234",
    user: {
      _id: "dlqwmk21klmdlwkdwlq123",
      name: "Juan Román Riquelme",
    },
    category: {
      _id: "dlqwmk21klmdlwkdwlq",
      name: "Soccer",
      slug: "/soccer",
    },
    title: "El oso polar",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    upvotes: 1024,
    downvotes: 512,
    comments: 256,
    vote: 1, // null/0/1
  },
  {
    _id: "dlqwmk21klmdlwkdwlq1234",
    user: {
      _id: "dlqwmk21klmdlwkdwlq123",
      name: "Juan Román Riquelme",
    },
    category: {
      _id: "dlqwmk21klmdlwkdwlq",
      name: "Soccer",
      slug: "/soccer",
    },
    title: "El oso polar",
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    upvotes: 1024,
    downvotes: 512,
    comments: 256,
    vote: 1, // null/0/1
  },
];
export default function Home(props) {
  const { isMobile } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let array = fetchData();
    if (data.length < 5) {
      setData([...data, ...array]);
    }
  }, [data]);

  const fetchData = () => {
    let array = memes;
    return array;
  };

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    if (data.length > 50) {
      // message.warning('Infinite List loaded all');
      setLoading(false);
      setHasMore(false);
      return;
    }

    let array = fetchData();
    setData([...data, ...array]);
    setInterval(() => {
      setLoading(false);
    }, 3000);
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
                <CardMeme key={index} prop={item} />
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
          <div className="ranking-meme">
            <CardMemeRanking key={1} />
          </div>
          <div className="ranking-meme">
            <CardMemeRanking key={2} />
          </div>
          <div className="ranking-meme">
            <CardMemeRanking key={3} />
          </div>
        </div>
      )}
    </div>
  );
}
