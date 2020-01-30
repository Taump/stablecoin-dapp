import React from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "../../components/Layout/Layout";
import { Form, Row, Col } from "antd";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import { IssueStablecoinFrom } from "../../forms";
import { useSelector } from "react-redux";
export const HomePage = props => {
  const { t } = useTranslation();
  const active = useSelector(state => state.aa.active);
  return (
    <Layout title={t("pages.home.title")} page="home">
      <Form>
        <Form.Item>
          <SelectAA />
        </Form.Item>
      </Form>
      {active && (
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <IssueStablecoinFrom />
          </Col>
        </Row>
      )}
    </Layout>
  );
};
