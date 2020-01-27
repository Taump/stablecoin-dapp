import React from "react";
import { Layout as LayoutAntd, Typography } from "antd";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "../Layout/Layout.module.css";

const { Content } = LayoutAntd;
const { Title } = Typography;

export const Layout = ({ children, title, page }) => (
  <LayoutAntd className={styles.layout}>
    <Sidebar active={page} />
    <LayoutAntd>
      <Content className={styles.content}>
        <div className={styles.wrap}>
          <Title level={1}>{title}</Title>
          {children}
        </div>
      </Content>
    </LayoutAntd>
  </LayoutAntd>
);
