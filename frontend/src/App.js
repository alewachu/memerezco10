import React, { useEffect, useState } from "react";
import { enquireScreen } from "enquire-js";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setToken, getToken, deleteToken } from "./helpers/authentication";
import { post } from "./helpers/service";

// Menu top
import MenuTop from "./components/MenuTop/MenuTop";
// Menu bottom
import MenuBottom from "./components/MenuBottom/MenuBottom";
import MessageError from "./components/MessageError";
// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import DetailMeme from "./pages/DetailMeme";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import About from "./pages/About";

import "./App.scss";

export default function App() {
  const { Header, Content, Footer } = Layout;
  const [isMobile, setStateIsMobile] = useState(false);
  const [userAuth, setUserAuth] = useState(false);
  const [setUser] = useState(null);
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
  }, [isMobile, userAuth]);

  /**
   * @description Envia las credenciales para iniciar sesion
   *
   * @param {*} email
   * @param {*} password
   * @return {*}
   */
  const login = async (email, password) => {
    const data = {
      mail: email,
      password: password,
    };

    const resp = await post("/auth/login", data);

    if (resp.success) {
      // En caso de que la respuesta sea cierta seteamos los datos
      setUserAuth(true);
      setToken(resp.token);
      setUser(resp.user);
      setError(null);
    } else {
      // En caso que la respuesta sea falsa seteamos el error
      setError(resp.err.message);
    }
    return resp.success;
  };

  /**
   * @description Envia los datos para crear un usuario nuevo
   *
   * @param {*} user
   * @return {*}
   */
  const register = async (user) => {
    let response;
    try {
      const register = await post("/auth/register", user);
      if (register) {
        response = true;
      }
    } catch (e) {
      response = false;
    }
    return response;
  };

  /**
   *@description Setea el mensaje de error
   *
   * @param {*} message
   */
  const showError = (message) => {
    setError(message);
  };

  /**
   *@description Elimina las credenciales
   *
   */
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
            <Route path="/register" exact={true}>
              <Register
                register={register}
                envs={{
                  REACT_APP_CLOUDINARY_DESTINATION:
                    process.env.REACT_APP_CLOUDINARY_DESTINATION,
                  REACT_APP_CLOUDINARY_KEY:
                    process.env.REACT_APP_CLOUDINARY_KEY,
                }}
                className="content"
              />
            </Route>
            <Route path="/upload" exact={true}>
              <Upload
                envs={{
                  REACT_APP_CLOUDINARY_DESTINATION:
                    process.env.REACT_APP_CLOUDINARY_DESTINATION,
                  REACT_APP_CLOUDINARY_KEY:
                    process.env.REACT_APP_CLOUDINARY_KEY,
                }}
                className="content"
              />
            </Route>
            <Route
              path="/meme/:id"
              render={(props) => (
                <DetailMeme {...props} userAuth={userAuth}></DetailMeme>
              )}
            ></Route>
            <Route path="/about" exact={true}>
              <About />
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
