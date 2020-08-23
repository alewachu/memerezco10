import React, { useEffect, useState } from 'react';
import { enquireScreen } from 'enquire-js'
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Menu top
import MenuTop from './components/MenuTop/MenuTop';

// Pages
import Home from './Pages/Home';
import Error404 from './Pages/Error404';

function App() {
  const { Header, Content } = Layout;
  const [isMobile, setStateIsMobile] = useState();

  useEffect(() => {
    enquireScreen((mobile) => {
      if (isMobile !== mobile){
        mobile = ( mobile === undefined) ? false : true;
        setStateIsMobile(mobile);
      }
    });
  })
 
  return (
    <Layout>
      <Router>
        <Header>
          <MenuTop isMobile={isMobile} />
        </Header>
        <Content>
          <Switch>
            <Route path="/" exact={true}>
            {isMobile && <label>Mobile</label>}
          {!isMobile && <label>Desckopt</label>}
              <Home />
            </Route>
            <Route path="*" exact={true}>
              <Error404 />
            </Route>
          </Switch>
        </Content>
      </Router>
    </Layout>
  );
}

export default App;
