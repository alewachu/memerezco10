import React, { useState } from "react";
import "./MenuTop.scss";
import { Menu, Button } from "antd";
import { Drawer, List } from "antd-mobile";

import { Link } from "react-router-dom";
import {
  SettingOutlined,
  //  MenuUnfoldOutlined,
  //  MenuFoldOutlined,
} from "@ant-design/icons";
import { item } from "../../helpers/item.menu";
const { SubMenu } = Menu;
export default function MenuTop(props) {
  //const [collapsed, setCollapsed] = useState(false);
  const [docked, setDocked] = useState(false);

  const { isMobile } = props;
  //const toggleCollapsed = () => {
  //  setCollapsed(!collapsed)
  // }
  const sidebar = (
    <List>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
        (i, index) => {
          if (index === 0) {
            return (
              <List.Item
                key={index}
                thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                multipleLine
              >
                Category
              </List.Item>
            );
          }
          return (
            <List.Item
              key={index}
              thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            >
              Category{index}
            </List.Item>
          );
        }
      )}
    </List>
  );

  const onDock = () => {
    console.log(docked);
    setDocked(!docked);
  };
  console.log(props);
  return (
    <div className="menu-top">
      <div className="menu-top-logo">Logo</div>
      <Button onClick={() => onDock()}>Hola</Button>
      <Menu theme="dark" mode={isMobile ? "inline" : "horizontal"}>
        {isMobile && (
          <SubMenu
            key="sub2"
            icon={<SettingOutlined />}
            title="Navigation Three"
          >
            {item.map((item) => {
              return (
                <Menu.Item key={item.key}>
                  <Link to={item.to}>{item.name}</Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        )}

        {!isMobile &&
          item.map((item) => {
            return (
              <Menu.Item key={item.key}>
                <Link to={item.to}>{item.name}</Link>
              </Menu.Item>
            );
          })}

        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight }}
          contentStyle={{
            color: "#A6A6A6",
            textAlign: "center",
            paddingTop: 42,
          }}
          sidebarStyle={{ border: "1px solid #ddd" }}
          sidebar={sidebar}
          docked={docked}
        >
          Click upper-left corner
        </Drawer>
      </Menu>
    </div>
  );
}
