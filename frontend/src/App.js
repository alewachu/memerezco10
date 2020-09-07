import React, { useEffect, useState } from "react";
import { enquireScreen } from "enquire-js";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setToken, getToken, deleteToken } from "./helpers/authentication";
import { post } from "./helpers/service";
import "./App.scss";
import Axios from "axios";
// Menu top
import MenuTop from "./components/MenuTop/MenuTop";
// Menu bottom
import MenuBottom from "./components/MenuBottom/MenuBottom";
import MessageError from "./components/MessageError";
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
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
      mail: email,
      password: password,
    };

    const resp = await post("/api/v1/login", data);
    //if(resp)
    if (resp.success) {
      setUserAuth(true);
      //Se guarda en sessionStorage
      setToken(resp.token);
      setUser(resp.user);
      setError(null);
      window.location.replace("/");
    } else {
      setError(resp.err.message);
    }
  }
  async function register(user) {
    const { data } = await Axios.post("/api/v1/users", user);
    setUser(data.usuario);
    setToken(data.token);
  }
  function showError(message) {
    setError(message);
  }

  function hiddenError() {
    setUser(null);
  }
  const logout = () => {
    deleteToken();
    setUserAuth(false);
    setUser(null);
  };
  return (
    <Layout>
      <Router>
        <Header>
          <MenuTop isMobile={isMobile} userAuth={userAuth} logout={logout} />
        </Header>
        <MessageError message={error}></MessageError>
        <Content className="site-layout-content">
          <Switch>
            <Route path="/" exact={true}>
              <Home className="content" isMobile={isMobile} />
            </Route>
            <Route
              path="/login"
              render={(props) => (
                <Login
                  {...props}
                  login={login}
                  showError={showError}
                  userAuth={userAuth}
                  setUserAuth={setUserAuth}
                ></Login>
              )}
              exact
            ></Route>

            <Route path="/Upload" exact={true}>
              <Upload className="content" />
            </Route>
            <Route
              path="/meme/:id"
              render={(props) => <DetailMeme {...props}></DetailMeme>}
            ></Route>
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
/*function RoutedAuthenticatedUser({ isMobile }) {
  return (
    <Switch>
      <Route path="/" exact={true}>
        <Home className="content" isMobile={isMobile} />
      </Route>
    </Switch>
  );
}
//Rutas usuario deslogueado
function DeauthenticatedUser({ login, register, showError }) {
  return (
    <Switch>
      <Route
        path="/login"
        render={(props) => (
          <Login {...props} login={login} showError={showError} default></Login>
        )}
        exact
      ></Route>
      <Route
        path="/register"
        render={(props) => (
          <Register
            {...props}
            register={register}
            showError={showError}
          ></Register>
        )}
      ></Route>
    </Switch>
  );
}*/
