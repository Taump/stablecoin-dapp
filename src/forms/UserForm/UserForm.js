import React, { useState } from "react";
import { Form, Input, Button, Select, Row, Col, Modal, Typography } from "antd";
import { t } from "../../utils";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import obyte from "obyte";
const { Option } = Select;
const { Title } = Typography;

export const UserForm = ({ onChange }) => {
  const [scWallets, setScWallets] = useLocalStorage("scWallets", []);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState({
    value: "",
    valid: true,
    error: {
      status: "",
      help: ""
    }
  });
  const handleChangeAddress = ev => {
    const value = ev.target.value;
    if (value) {
      if (obyte.utils.isValidAddress(value)) {
        setAddress({
          value,
          valid: true,
          error: {
            status: "success",
            help: ""
          }
        });
      } else {
        setAddress({
          value,
          valid: false,
          error: {
            status: "error",
            help: t("forms.error.notValid", { field: "Address" })
          }
        });
      }
    } else {
      setAddress({
        value: "",
        valid: false,
        error: {
          status: "",
          help: ""
        }
      });
    }
  };
  const handleClickAdd = address => {
    setModalVisible(false);

    if (scWallets.find(wallet => wallet === address) === undefined) {
      const wallets = scWallets.slice();
      wallets.unshift(address);
      setScWallets(wallets);
    }

    setAddress({
      value: "",
      valid: false,
      error: {
        status: "",
        help: ""
      }
    });
  };
  const handleSubmit = ev => {
    if (ev) {
      ev.preventDefault();
    }
    handleClickAdd(address.value);
  };
  return (
    <Form>
      <Row>
        <Title level={3}>My loans</Title>
        <Col md={{ span: 16 }} xs={{ span: 24 }}>
          <Form.Item>
            <Select
              key={"5464564590"}
              size="large"
              placeholder="Select wallet address"
              onChange={onChange}
            >
              {scWallets.map((arr, i) => (
                <Option key={`${arr}${i}`} value={arr}>
                  {arr}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 6, offset: 2 }} xs={{ span: 24 }}>
          <Button
            size="large"
            type="primary"
            onClick={() => setModalVisible(true)}
            icon="plus"
          >
            Add
          </Button>
        </Col>
      </Row>
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={() => handleClickAdd(address.value)}
            disabled={!address.valid}
          >
            Add
          </Button>
        ]}
      >
        <Title level={3}>Add new wallet address</Title>
        <Form onSubmit={handleSubmit}>
          <Form.Item
            help={address.error.help}
            hasFeedback
            validateStatus={address.error.status}
          >
            <Input
              placeholder="Your wallet address"
              size="large"
              value={address.value}
              onChange={handleChangeAddress}
              autoFocus={true}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};
