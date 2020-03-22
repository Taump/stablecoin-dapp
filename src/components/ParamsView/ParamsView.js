import React from "react";
import { Collapse, Icon, Row, Tooltip } from "antd";
import { useSelector } from "react-redux";

import { t } from "../../utils";
import styles from "../LabelForm/LabelForm.module.css";
import config from "../../config";

const { Panel } = Collapse;

export const ParamsView = () => {
  const {
    overcollateralization_ratio,
    decimals,
    oracle,
    max_loan_value_in_underlying,
    auction_period,
    liquidation_ratio,
    feed_name,
    ma_feed_name,
    expiry_date
  } = useSelector(state => state.aa.activeParams);
  const aaActive = useSelector(state => state.aa.active);
  const customPanelStyle = {
    background: "#fff",
    borderRadius: 4,
    border: 0,
    overflow: "hidden"
  };
  return (
    <Row>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header={t("components.paramsView.title")}
          key="1"
          style={customPanelStyle}
        >
          {oracle && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.oracle.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.oracle")}:</b> {oracle}
            </p>
          )}
          {decimals && max_loan_value_in_underlying && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.maxLoan.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.maxLoan")}:</b>{" "}
              {max_loan_value_in_underlying / 10 ** decimals}
            </p>
          )}
          {feed_name && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.feedName.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.feedName")}:</b> {feed_name}
            </p>
          )}
          {ma_feed_name && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.maFeedName.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.maFeedName")}:</b>{" "}
              {ma_feed_name}
            </p>
          )}
          {auction_period && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.auctionPeriod.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.auctionPeriod")}:</b>{" "}
              {auction_period}
            </p>
          )}
          {decimals && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.decimals.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.decimals")}:</b> {decimals}
            </p>
          )}
          {overcollateralization_ratio && (
            <p>
              <Tooltip
                title={t(
                  `forms.deploy.fields.overCollateralizationRatio.descr`
                )}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>
                {t("components.paramsView.params.overCollateralizationRatio")}:
              </b>{" "}
              {overcollateralization_ratio}
            </p>
          )}
          {liquidation_ratio && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.liquidationRatio.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.liquidationRatio")}:</b>{" "}
              {liquidation_ratio}
            </p>
          )}
          {expiry_date && (
            <p>
              <Tooltip
                title={t(`forms.deploy.fields.expiryDate.descr`)}
                placement="top"
              >
                <Icon
                  style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{t("components.paramsView.params.expiryDate")}:</b>{" "}
              {expiry_date}
            </p>
          )}
          <p>
            {aaActive && (
              <a
                href={`https://${config.TESTNET &&
                  "testnet"}explorer.obyte.org/#${aaActive}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on explorer
              </a>
            )}
          </p>
        </Panel>
      </Collapse>
    </Row>
  );
};
