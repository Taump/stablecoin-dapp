import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Form, Input, Button, Typography, Icon, Result } from "antd";

import {
  pendingCheckToken,
  clearCheckToken,
  tokenRegistryClose
} from "../../store/actions/deploy";
import config from "../../config";
import base64url from "base64url";

const { Title } = Typography;
export const RegistryToken = () => {
  const dispatch = useDispatch();
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const pendingCheck = useSelector(state => state.deploy.checkTokenPending);
  const checkToken = useSelector(state => state.deploy.checkToken);
  const { feed_name, expiry_date } = useSelector(
    state => state.aa.activeParams
  );
  const checkBtn = useRef(null);
  const regBtn = useRef(null);
  const asset = activeInfo.asset;
  const initToken = `${feed_name}_${expiry_date.replace(/-/g, "")}`;
  const [token, setToken] = useState({
    value: initToken,
    valid: true
  });
  const [tokenSupport, setTokenSupport] = useState({
    value: 0.1,
    valid: true
  });
  const handleChangeSymbol = ev => {
    const targetToken = ev.target.value.toUpperCase();
    if (checkToken !== null) {
      dispatch(clearCheckToken());
    } else {
      if (targetToken.length > 0) {
        if (targetToken.length <= 40) {
          setToken({ ...token, value: targetToken, valid: true });
        } else {
          setToken({
            ...token,
            value: targetToken,
            valid: false
          });
        }
      } else {
        setToken({ ...token, value: targetToken, valid: false });
      }
    }
  };

  const handleChangeSupport = ev => {
    const support = ev.target.value;
    const reg = /^[0-9.]+$/;
    const f = x => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);
    if (support) {
      if (reg.test(support) && f(support) <= 9) {
        if (Number(support) >= 0.1) {
          setTokenSupport({ ...token, value: support, valid: true });
        } else {
          setTokenSupport({ ...token, value: support, valid: false });
        }
      }
    } else {
      setTokenSupport({ ...token, value: "", valid: false });
    }
  };

  let validateStatusSymbol;
  let helpSymbol;
  if (!token.valid) {
    if (token.value.length > 40) {
      validateStatusSymbol = "error";
      helpSymbol = "The symbol must be less than 40 characters";
    } else {
      validateStatusSymbol = null;
      helpSymbol = null;
    }
  } else if (token.valid) {
    if (checkToken) {
      validateStatusSymbol = "warning";
      helpSymbol =
        "This token name is already taken. This will start a dispute";
    } else {
      validateStatusSymbol = "success";
      helpSymbol = null;
    }
  }
  const dataString = JSON.stringify({ symbol: token.value, asset });
  const dataBase64 = base64url(dataString);
  const handleSubmit = ev => {
    ev.preventDefault();
    if (checkToken === null) {
      checkBtn.current.click();
    } else {
      regBtn.current.click();
    }
  };
  return (
    <>
      {"asset" in activeInfo ? (
        <Row>
          <Title level={3}>Registry token</Title>
          <Form layout="horizontal" onSubmit={handleSubmit}>
            <Form.Item
              hasFeedback
              validateStatus={validateStatusSymbol}
              help={helpSymbol}
              label="Symbol that identifies an asset"
            >
              <Input
                value={token.value}
                size="large"
                onChange={handleChangeSymbol}
                disabled={pendingCheck}
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              validateStatus={tokenSupport.valid ? "success" : "error"}
              help={!tokenSupport.valid && "Minimum support 0.1 GBYTEs"}
              label="The symbol support (GBYTEs)"
            >
              <Input
                value={tokenSupport.value}
                size="large"
                onChange={handleChangeSupport}
              />
            </Form.Item>
            <Form.Item>
              {checkToken === null ? (
                <Button
                  type="primary"
                  size="large"
                  ref={checkBtn}
                  onClick={() => dispatch(pendingCheckToken(token.value))}
                  loading={pendingCheck}
                  disabled={!token.valid}
                >
                  Check
                </Button>
              ) : (
                <a
                  className="ant-btn ant-btn-primary ant-btn-lg"
                  ref={regBtn}
                  disabled={!tokenSupport.valid}
                  href={`obyte${config.TESTNET ? "-tn" : ""}:${
                    config.TOKEN_REGISTRY_AA_ADDRESS
                  }?amount=${tokenSupport.value *
                    10 ** 9}&base64data=${dataBase64}`}
                >
                  {checkToken ? "Register anyway" : "Register"}
                </a>
              )}
              <Button
                type="danger"
                size="large"
                style={{ marginLeft: 10 }}
                onClick={() => dispatch(tokenRegistryClose())}
              >
                Close
              </Button>
            </Form.Item>
          </Form>
        </Row>
      ) : (
        <div>
          <Result
            icon={<Icon type="loading" />}
            title="We are waiting for the asset issue"
            extra={
              <Button
                type="danger"
                size="large"
                onClick={() => dispatch(tokenRegistryClose())}
              >
                Close
              </Button>
            }
          />
        </div>
      )}
    </>
  );
};
