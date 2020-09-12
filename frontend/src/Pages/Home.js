import React, { useState, useEffect } from "react";
import CardMeme from "../components/CardMeme/CardMeme";
import CardMemeRanking from "../components/CardMemeRanking/CardMemeRanking";
import { List, Spin, Modal, Select } from "antd";
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
const { Option } = Select;

export default function Home(props) {
  let history = useHistory();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [skipMemeRanking, setSkipMemeRanking] = useState(5);

  const [memeRanking, setMemeRanking] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [tipeRanking, setTipeRanking] = useState("upvotes");

  useEffect(() => {
    const fetchMemes = async () => {
      let memes = await fetchData(0, null);
      setData([...memes, ...data]);
      setSkip(2);
    };
    const rankingMeme = async () => {
      let ranking = await fetchDataRanking(tipeRanking);
      setMemeRanking([...ranking, ...memeRanking]);
      setSkipMemeRanking(skipMemeRanking + 5);
    };
    const searchCategories = async () => {
      let todoCategories = await fetchCategories();
      setCategories([...categories, ...todoCategories]);
    };
    if (categories.length === 0) {
      searchCategories();
    }
    if (data.length === 0) {
      fetchMemes();
    }
    if (memeRanking.length === 0) {
      rankingMeme();
    }
  }, []);

  const fetchDataRanking = async (tipe) => {
    const response = await get(`/api/v1/memes?limit=5&skip=${skipMemeRanking}`);
    return response.data;
  };

  const fetchData = async (skip, category) => {
    let url = `/api/v1/memes?limit=2&skip=${skip}`;
    if (category) {
      url = url + `&category=${category}`;
    }
    console.log(url);
    const response = await get(url);
    return response.data;
  };

  const fetchCategories = async () => {
    const response = await get("/api/v1/categories");
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
    let array = await fetchData(skip + 2, selectCategory);
    setData([...array, ...data]);
    setSkip(skip + 2);

    let arrayRanking = await fetchDataRanking();
    setMemeRanking([...arrayRanking, ...memeRanking]);
    setSkipMemeRanking(skipMemeRanking + 5);

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

  const onChange = async (value) => {
    if (selectCategory !== value) {
      value = value ? value : null;
      let array = await fetchData(0, value);
      setData(array);
      setSkip(2);
      setSelectCategory(value);
      console.log(`selected ${value}`);
    }
  };

  const onBlur = () => {
    console.log("blur");
  };

  const onFocus = () => {
    console.log("focus");
  };

  const onSearch = (val) => {
    console.log("search:", val);
  };

  const changeTipeRankink = async (tipe) => {
    if (tipeRanking !== tipe) {
      setMemeRanking([]);
      setSkipMemeRanking(5);
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
            <div style={{ width: "20%" }}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Categorias"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                defaultValue=""
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="">Todos</Option>
                {categories.map((category) => (
                  <Option value={category.id} key={category.key}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
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
                renderItem={(memer, index) => (
                  <List.Item key={index}>
                    <CardMemeRanking
                      key={memer}
                      prop={memer}
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
