import React from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../Sidebar/Sidebar.module.css";
import i18n from "../../i18n";
const { Sider } = Layout;

export const Sidebar = ({ active }) => {
  const { t } = useTranslation("", { i18n });
  const dataMenu = [
    {
      key: "home",
      icon: "home",
      title: t("pages.home.title"),
      path: "/"
    },
    {
      key: "deploy",
      icon: "plus-circle",
      title: t("pages.deploy.title"),
      path: "/deploy"
    }
  ];
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
