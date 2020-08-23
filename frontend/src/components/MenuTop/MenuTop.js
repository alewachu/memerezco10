import React from "react";
import "./MenuTop.scss";
import { Menu } from "antd";

import { Link } from "react-router-dom";
//import {
//  MenuUnfoldOutlined,
//  MenuFoldOutlined,
//} from '@ant-design/icons';
export default function MenuTop(props) {
  //const [collapsed, setCollapsed] = useState(false);
  const { isMobile } = props;
  //const toggleCollapsed = () => {
  //  setCollapsed(!collapsed)
  // }

  console.log(isMobile);
  return (
    <div className="menu-top">
      <div className="menu-top-logo">Logo</div>
      <Menu
        theme="dark"
        mode={isMobile ? "inline" : "horizontal"}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/">About</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/">Logout</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/">Login</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}
