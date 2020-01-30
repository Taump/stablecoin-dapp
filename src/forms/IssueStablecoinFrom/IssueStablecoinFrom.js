import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useSelector } from "react-redux";
import { redirect } from "../../utils";
import config from "../../config";
export const IssueStablecoinFrom = ({ params }) => {
  const [value, setValue] = useState(0);
  const [count, setCount] = useState("");
  const exchange_rate = 0.036337209302325583;
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
    (1000000000 * exchange_rate * overcollateralization_ratio * Number(count)) /
      Math.exp(decimals * Math.log(10))
  );
  //10^decimals = e^(decimals * ln(10))
  const handleSubmit = ev => {
    ev.preventDefault();
    redirect(
      `byteball${
        config.TESTNET ? "-tn" : ""
      }:${active}?amount=${newValue}&amp;asset=base`
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Issue stablecoins</h2>
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
