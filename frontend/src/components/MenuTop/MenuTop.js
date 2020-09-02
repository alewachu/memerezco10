import React, { useState } from "react";
import "./MenuTop.scss";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, List } from "antd-mobile";
import { item } from "../../helpers/item.menu";

export default function MenuTop(props) {
  const { isMobile } = props;
  const [docker, setDocker] = useState(false);

  const onDock = () => {
    setDocker(!docker);
  };

  const sidebar = (
    <List>
      {item.map((item) => {
        return (
          <List.Item key={item.key}>
            <Link to={item.to}>{item.name}</Link>
          </List.Item>
        );
      })}
    </List>
  );

  return (
    <div className="menu-top">
      <div className="menu-top-logo">Logo</div>
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
          {item.map((item) => {
            return (
              <Menu.Item key={item.key}>
                <Link to={item.to}>{item.name}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      )}
    </div>
  );
}
//      <Menu theme="dark" mode={isMobile ? "inline" : "horizontal"}>
