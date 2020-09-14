import React, { useState } from "react";
import "./MenuTop.scss";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, List } from "antd-mobile";
import MenuItem from "antd/lib/menu/MenuItem";
import Logo from "../../assets/logo.png";
export default function MenuTop(props) {
  const { userAuth, isMobile, logout } = props;
  const [docker, setDocker] = useState(false);

  const onDock = () => {
    setDocker(!docker);
  };
  const handleLogout = () => {
    logout();
  };
  const sidebar = (
    <List>
      <List.Item key={1}>
        <Link to={"/"}>Home</Link>
      </List.Item>
      <List.Item key={2}>
        <Link to={"/about"}>About</Link>
      </List.Item>
      {userAuth && (
        <List.Item key={3}>
          <Link onClick={handleLogout} to="/">
            Logout
          </Link>
        </List.Item>
      )}
      {!userAuth && (
        <List.Item key={4}>
          <Link to={"/login"}>Login</Link>
        </List.Item>
      )}
      {userAuth && (
        <List.Item key={5}>
          <Link to={"/upload"}>Upload</Link>
        </List.Item>
      )}
    </List>
  );

  return (
    <div className="menu-top">
      <div className="menu-top-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" style={{ width: 50, heigth: 50 }} />
        </Link>
      </div>
      {isMobile && (
        <div>
          <Drawer
            className="my-drawer"
            contentStyle={{
              color: "#A6A6A6",
              textAlign: "center",
            }}
            sidebarStyle={{
              border: "1px solid #ddd",
              width: "70%",
              backgroundColor: "#ffffff",
            }}
            sidebar={sidebar}
            docked={docker}
            children={
              <Button
                style={{
                  zIndex: "100",
                  width: "64px",
                  height: "64px",
                  float: "left",
                }}
                onClick={() => onDock()}
              >
                <MenuOutlined />
              </Button>
            }
          ></Drawer>
        </div>
      )}

      {!isMobile && (
        <Menu theme="dark" mode={isMobile ? "inline" : "horizontal"}>
          <MenuItem>
            <Link to="/">Home</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/about">About</Link>
          </MenuItem>
          {userAuth && (
            <MenuItem>
              <Link to="/upload">Upload meme</Link>
            </MenuItem>
          )}
          {userAuth && (
            <MenuItem>
              <Link onClick={handleLogout} to="/">
                Logout
              </Link>
            </MenuItem>
          )}
          {!userAuth && (
            <MenuItem>
              <Link to="/login">Login</Link>
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  );
}
