import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import { List, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import "../App.scss";
export default function Home() {
  // const item = [1, 2, 3, 4, 5];
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
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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

  return (
    <div className="demo-infinite-container">
      <InfiniteScroll
        initialLoad={false}
        hasMore={!loading && hasMore}
        loadMore={handleInfiniteOnLoad}
        pageStart={0}
        useWindow={false}
        threshold={20}
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CardMeme key={item} prop={item} />
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
  );
}
