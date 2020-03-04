import React from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { changeActiveAA } from "../../store/actions/aa";
import { t } from "../../utils";
import styles from "../SelectAA/SelectAA.module.css";
import moment from "moment";
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
    let aaListStorage = scRecentAas;
    if (recentActive) {
      const findAaInRecent = aaListStorage.findIndex(
        aa => aa.address === address
      );
      if (findAaInRecent === -1) {
        if (aaListStorage && aaListStorage.length >= 5) {
          aaListStorage.pop();
        }
        aaListStorage.unshift(aaListByBase.find(aa => aa.address === address));
      } else {
        [aaListStorage[0], aaListStorage[findAaInRecent]] = [
          aaListStorage[findAaInRecent],
          aaListStorage[0]
        ];
      }
      setScRecentAas(aaListStorage);
    }
  };

  const notRecentAaListByBase = aaListByBase.filter(
    aaBase =>
      scRecentAas.find(aa => aa.address === aaBase.address) === undefined
  );

  const test = notRecentAaListByBase.slice().sort((prev, next) => {
    const prevTime = prev.definition["1"].params.expiry_date;
    const nextTime = next.definition["1"].params.expiry_date;
    return moment.utc(nextTime) - moment.utc(prevTime);
  });
  return (
    <Select
      className={styles.select}
      placeholder={t("components.selectAA.placeholder")}
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
        {t("components.selectAA.placeholder")}
      </Option>
      {recentActive && scRecentAas.length >= 1 && (
        <OptGroup label={t("components.selectAA.group.recent")}>
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
          (recentActive &&
            scRecentAas.length >= 1 &&
            t("components.selectAA.group.other")) ||
          t("components.selectAA.group.all")
        }
      >
        {test.map((aa, i) => {
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
