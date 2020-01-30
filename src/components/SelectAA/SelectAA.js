import React from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { changeActiveAA } from "../../store/actions/aa";

import styles from "../SelectAA/SelectAA.module.css";

const { Option, OptGroup } = Select;

export const SelectAA = props => {
  const dispatch = useDispatch();
  const aaListByBase = useSelector(state => state.aa.listByBase);
  const aaActive = useSelector(state => state.aa.active);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const [scRecentAas, setScRecentAas] = useLocalStorage("scRecentAas", []);
  const recentActive = aaListByBase.length > 8;
  const handleSelectAA = address => {
    dispatch(changeActiveAA(address));
    if (recentActive) {
      let aaListStorage = scRecentAas;
      if (aaListStorage.find(aa => aa.address === address) === undefined) {
        if (aaListStorage && aaListStorage.length >= 5) {
          aaListStorage.pop();
        }
        aaListStorage.unshift(aaListByBase.find(aa => aa.address === address));
        setScRecentAas(aaListStorage);
      }
    }
  };

  const notRecentAaListByBase = aaListByBase.filter(
    aaBase =>
      scRecentAas.find(aa => aa.address === aaBase.address) === undefined
  );

  return (
    <Select
      className={styles.select}
      placeholder="Select a AA"
      onChange={handleSelectAA}
      value={aaActive || 0}
      size="large"
      loading={!listByBaseLoaded}
      showSearch={true}
      optionFilterProp="children"
      filterOption={(input, option) => {
        const inputData = input.toLowerCase();
        const viewData = String(option.props.children).toLowerCase();
        return viewData.indexOf(inputData) >= 0;
      }}
      {...props}
    >
      <Option key={"AA0"} value={0} disabled>
        Select a AA
      </Option>
      {recentActive && scRecentAas.length >= 1 && (
        <OptGroup label="Recent AAs">
          {scRecentAas &&
            scRecentAas.map((aa, i) => {
              return (
                <Option
                  key={"AA" + i}
                  value={aa.address}
                  style={{ fontWeight: "regular" }}
                >
                  {aa.view}
                </Option>
              );
            })}
        </OptGroup>
      )}
      <OptGroup
        label={
          (recentActive && scRecentAas.length >= 1 && "Other AAs") || "All AAs"
        }
      >
        {notRecentAaListByBase.map((aa, i) => {
          return (
            <Option
              key={"AA" + i}
              value={aa.address}
              style={{ fontWeight: "regular" }}
            >
              {aa.view}
            </Option>
          );
        })}
      </OptGroup>
    </Select>
  );
};
