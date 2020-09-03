import React, { useEffect, useState } from "react";
import { enquireScreen } from "enquire-js";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
// Menu top
import MenuTop from "./components/MenuTop/MenuTop";
// Menu bottom
import MenuBottom from "./components/MenuBottom/MenuBottom";
// Pages
import Home from "./Pages/Home";
import Error404 from "./Pages/Error404";

function App() {
  const { Header, Content, Footer } = Layout;
  const [isMobile, setStateIsMobile] = useState(false);

  useEffect(() => {
    enquireScreen((mobile) => {
      if (isMobile !== mobile) {
        mobile = mobile === undefined ? false : true;
        setStateIsMobile(mobile);
      }
    });
  });

  return (
    <Layout>
      <Router>
        <Header>
          <MenuTop isMobile={isMobile} />
        </Header>
        <Content className="site-layout-content">
          <Switch>
            <Route path="/" exact={true}>
              <Home className="content" isMobile={isMobile} />
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

export default App;
