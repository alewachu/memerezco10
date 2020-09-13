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
  const { isMobile } = props;

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
  /**
   * @description Busca los memes
   *
   * @param {*} tipe
   * @return {*}
   */
  const fetchDataRanking = async (tipe) => {
    const response = await get(`/api/v1/memes?limit=5&skip=${skipMemeRanking}`);
    return response.data;
  };

  const fetchData = async (skip, category) => {
    let url = `/api/v1/memes?limit=2&skip=${skip}`;
    if (category) {
      url = url + `&category=${category}`;
    }
    const response = await get(url);
    return response.data;
  };

  const fetchCategories = async () => {
    const response = await get("/api/v1/categories");
    return response.data;
  };

  /**
   *@description Modal para indicar que se tiene que logear para votar
   *
   */
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
   *@description Redirecciona al login
   *
   */
  const login = () => {
    history.push("/login");
  };

  /**
   * @description Busca mas memes para mostrar, tanto para rankin como para la lista principal
   *
   * @return {*}
   */
  const handleInfiniteOnLoad = async () => {
    setLoading(true);

    // Buscara un maximo de 16 memes
    if (data.length > 16) {
      setLoading(false);
      setHasMore(false);
      return;
    }

    // Busca los memes de una categoria
    let array = await fetchData(skip + 2, selectCategory);
    setData([...array, ...data]);
    setSkip(skip + 2);

    // Busca los memes del ranking
    let arrayRanking = await fetchDataRanking();
    setMemeRanking([...arrayRanking, ...memeRanking]);
    setSkipMemeRanking(skipMemeRanking + 5);

    setInterval(() => {
      setLoading(false);
    }, 3000);
    return;
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

  /**
   *@description Si selecciono una categoria busca los memes de ese tipo. En caso que seleccione la misma categoria no hace la busqueda
   *
   * @param {*} value
   */
  const onChange = async (value) => {
    if (selectCategory !== value) {
      value = value ? value : null;
      let array = await fetchData(0, value);
      setData(array);
      setSkip(2);
      setSelectCategory(value);
    }
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

  const colPrincipalStyle = isMobile ? null : { display: "flex" };
  const selectCategoryStyle = isMobile
    ? { width: "100%", position: "fixed", marginTop: "-66px", zIndex: 2 }
    : { width: "20%" };
  const colMemesStyle = isMobile
    ? {
        width: "100%",
        marginTop: "40px",
        marginLeft: "5%",
        marginRight: "auto",
      }
    : { width: "60%", marginTop: "40px" };

  const demoInfiniteContainer = isMobile
    ? {
        zIndex: 2,
        border: "1px solid #e8e8e8",
        borderRadius: "4px",
        overflow: "auto",
        height: "80vh",
        marginTop: "25px",
      }
    : {
        zIndex: 2,
        border: "1px solid #e8e8e8",
        borderRadius: "4px",
        overflow: "auto",
        height: "90vh",
      };
  return (
    <div className="col-memes">
      <div style={demoInfiniteContainer}>
        <InfiniteScroll
          initialLoad={false}
          hasMore={!loading && hasMore}
          loadMore={handleInfiniteOnLoad}
          pageStart={0}
          useWindow={false}
          threshold={200}
        >
          <div style={colPrincipalStyle}>
            <div style={selectCategoryStyle}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Categorias"
                optionFilterProp="children"
                onChange={onChange}
                defaultValue=""
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="">All</Option>
                {categories.map((category) => (
                  <Option value={category.id} key={category.key}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div style={colMemesStyle}>
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
            {!isMobile && (
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
                        key={memer.id}
                        prop={memer}
                        tipeRanking={tipeRanking}
                      />
                    </List.Item>
                  )}
                ></List>
              </div>
            )}
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
