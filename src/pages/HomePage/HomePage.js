import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "../../components/Layout/Layout";
import { Form, Row, Col, Typography } from "antd";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import { LoanListByAddress } from "../../components/LoanListByAddress/LoanListByAddress";
import { IssueStablecoinFrom, UserForm } from "../../forms";
import { useSelector } from "react-redux";

const { Title } = Typography;

export const HomePage = props => {
  const { t } = useTranslation();
  const active = useSelector(state => state.aa.active);
  const [address, setAddress] = useState("");

  return (
    <Layout title={t("pages.home.title")} page="home">
      <Form>
        <Form.Item>
          <SelectAA autoFocus={true} />
        </Form.Item>
      </Form>
      {active && (
        <>
          <Row>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <IssueStablecoinFrom />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 14, offset: 2 }}>
              <Title level={3}>Informations</Title>
              <ul>
                <li>Всего монеток</li>
                <li>Мои монетки</li>
              </ul>
            </Col>
          </Row>
          <Row>
            <UserForm onChange={address => setAddress(address)} />
            <Row>
              {address && (
                <LoanListByAddress address={address} active={active} />
              )}
            </Row>
          </Row>
        </>
      )}
    </Layout>
  );
};
