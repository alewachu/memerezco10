import React, { useEffect, useState } from "react";
import { enquireScreen } from "enquire-js";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setToken, getToken } from "./helpers/authentication";
import "./App.scss";
// Menu top
import MenuTop from "./components/MenuTop/MenuTop";
// Menu bottom
import MenuBottom from "./components/MenuBottom/MenuBottom";
// Pages
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Error404 from "./Pages/Error404";
import DetailMeme from "./Pages/DetailMeme";
import Register from "./Pages/Register";
import Upload from "./Pages/Upload";

export default function App() {
  const { Header, Content, Footer } = Layout;
  const [isMobile, setStateIsMobile] = useState(false);
  const [userAuth, setUserAuth] = useState(false);

  useEffect(() => {
    if (getToken()) {
      setUserAuth(true);
    }

    enquireScreen((mobile) => {
      if (isMobile !== mobile) {
        mobile = mobile === undefined ? false : true;
        setStateIsMobile(mobile);
      }
    });
  }, []);

  async function login(email, password) {
    const data = {
      email: email,
      password: password,
    };
    fetch("https://api.mocki.io/v1/a25c65a9", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserAuth(true);
        //Se guarda en localStorage
        setToken(data.token);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function register(){
    
  }
  return (
    <Layout>
      <Router>
        <Header>
          <MenuTop isMobile={isMobile} />
        </Header>
        <Content className="site-layout-content">
          {userAuth ? (
            <RoutedAuthenticatedUser isMobile={isMobile} />
          ) : (
            <DeauthenticatedUser login={login} register={register} />
          )}
          <Switch>
            <Route path="/" exact={true}>
              <Home className="content" isMobile={isMobile} />
            </Route>
            <Route path="/Upload" exact={true}>
              <Upload className="content" />
            </Route>
            <Route path="*" exact={true}>
              <Error404 />
            </Route>
          </Switch>
        </Content>
        {isMobile && (
          <Footer className="menu-bottom-color">
            <MenuBottom />
          </Footer>
        )}
      </Router>
    </Layout>
  );
}
//Rutas usuario logueado
function RoutedAuthenticatedUser({ isMobile }) {
  return (
    <Switch>
      <Route path="/" exact={true}>
        <Home className="content" isMobile={isMobile} />
      </Route>
      <Route
        path="/meme/:id"
        render={(props) => <DetailMeme {...props}></DetailMeme>}
      ></Route>
    </Switch>
  );
}
//Rutas usuario deslogueado
function DeauthenticatedUser({ login,register }) {
  console.log("here");
  return (
    <Switch>
      <Route
        path="/login"
        render={(props) => <Login {...props} login={login} default></Login>}
        exact
      ></Route>
      <Route
        path="/register"
        render={(props) => <Register {...props} register={register}></Register>}
      ></Route>
    </Switch>
  );
}
