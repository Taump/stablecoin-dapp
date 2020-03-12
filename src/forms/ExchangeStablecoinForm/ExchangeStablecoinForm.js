import React, { useRef, useState } from "react";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import config from "../../config";

export const ExchangeStablecoinForm = () => {
  const [count, setCount] = useState("");
  const issueBtn = useRef(null);

  const active = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const { decimals } = useSelector(state => state.aa.activeParams);
  const expiry_exchange_rate = Number(activeInfo.expiry_exchange_rate);
  const url = `obyte${config.TESTNET ? "-tn" : ""}:${active}?amount=${count *
    10 ** decimals}&asset=${encodeURIComponent(activeInfo.asset)}`;

  const handleChange = ev => {
    const getCount = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (reg.test(String(getCount)) || getCount === "") {
      setCount(String(getCount));
    }
  };
  return (
    <>
      <Form layout="inline" style={{ marginTop: 25 }}>
        <Form.Item>
          <Input
            placeholder="Count of stablecoin"
            size="large"
            onChange={handleChange}
            value={count}
            style={{ marginBottom: 15 }}
          />
        </Form.Item>
        <Form.Item>
          <a
            href={url}
            className="ant-btn ant-btn-primary ant-btn-lg"
            ref={issueBtn}
            disabled={count === ""}
          >
            Exchange for GBYTEs
          </a>
        </Form.Item>
      </Form>
      {count !== "" && !isNaN(count) && (
        <small>
          You will get {(Number(count) * expiry_exchange_rate).toFixed(9)}{" "}
          GBYTEs
        </small>
      )}
    </>
  );
};
