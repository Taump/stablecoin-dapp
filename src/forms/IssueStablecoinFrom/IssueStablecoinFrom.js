import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { useSelector } from "react-redux";
import { redirect } from "../../utils";
import config from "../../config";
const { Title } = Typography;
export const IssueStablecoinFrom = () => {
  const [count, setCount] = useState("");
  const exchange_rate = useSelector(state => state.aa.activeDataFeed);
  const { overcollateralization_ratio, decimals } = useSelector(
    state => state.aa.activeParams
  );
  const active = useSelector(state => state.aa.active);
  const handleChange = ev => {
    const getCount = ev.target.value;
    const reg = /^[0-9]+$/;
    if (reg.test(String(getCount)) || getCount === "") {
      setCount(String(getCount));
    }
  };
  const newValue = Math.ceil(
    (1000000000 *
      (1 / exchange_rate) *
      overcollateralization_ratio *
      Number(count)) /
      Math.exp(decimals * Math.log(10))
  );
  const handleSubmit = ev => {
    ev.preventDefault();
    redirect(
      `byteball${
        config.TESTNET ? "-tn" : ""
      }:${active}?amount=${newValue}&amp;asset=base`
    );
    setCount("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title level={3}>Issue stablecoins</Title>
      <Form.Item>
        <Input
          size="large"
          placeholder="Number of stablecoins"
          onChange={handleChange}
          value={count}
        />
      </Form.Item>
      <Form.Item>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          disabled={count === ""}
        >
          Send {newValue} bytes
        </Button>
      </Form.Item>
    </Form>
  );
};
