import React from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink } from "react-router-dom";

import styles from "../Sidebar/Sidebar.module.css";

const { Sider } = Layout;

const dataMenu = [
  { key: "home", icon: "home", title: "Home", path: "/" },
  { key: "deploy", icon: "plus-circle", title: "Deploy AA", path: "/deploy" },
  // {
  //   key: "search",
  //   icon: "search",
  //   title: "Search AA",
  //   path: "/search"
  // },
  {
    key: "asset",
    icon: "setting",
    title: "Issuing asset",
    path: "/asset"
  }
];

export const Sidebar = ({ active }) => {
  return (
    <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
      <div className={styles.logo}>
        <img src="/logo.png" className={styles.logo__img} alt="Obyte" />
        <div className={styles.brand}>
          Obyte <div className={styles.product}>Stablecoin</div>
        </div>
      </div>
      <Menu theme="light" defaultSelectedKeys={[active]}>
        {dataMenu.map(item => {
          return (
            <Menu.Item key={item.key}>
              <NavLink to={item.path} activeClassName="selected">
                <Icon type={item.icon} />
                <span className="nav-text">{item.title}</span>
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};
