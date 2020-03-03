import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Result } from "antd";

import {
  changeActiveAA,
  watchRequestAas,
  getAasByBase,
  subscribeBaseAA,
  openNetwork,
  closeNetwork,
  updateRate
} from "../../store/actions/aa";
import client from "../../socket";

export const WatcherUpdate = props => {
  const dispatch = useDispatch();
  const aaActive = useSelector(state => state.aa.active);
  const network = useSelector(state => state.aa.network);

  // useEffect(() => {
  //   dispatch(subscribeBaseAA());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (aaActive === null) {
  //     dispatch(getAasByBase());
  //   }
  // }, [dispatch, aaActive]);

  // useEffect(() => {
  //   if (aaActive && network) {
  //     const update = setInterval(() => {
  //       dispatch(updateRate());
  //     }, 60000);
  //     return () => {
  //       clearInterval(update);
  //     };
  //   }
  // }, [aaActive, dispatch, network]);

  // useEffect(() => {
  //   dispatch(watchRequestAas());
  // }, [dispatch]);

  // useEffect(() => {
  //   try {
  //     if (client && client.client && client.client.ws) {
  //       // if (aaActive) {
  //       //   dispatch(changeActiveAA(aaActive));
  //       // }
  //       client.client.ws.addEventListener("close", () => {
  //         dispatch(closeNetwork());
  //       });
  //     } else {
  //       dispatch(closeNetwork());
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });

  useEffect(() => {
    client.onConnect(async () => {
      dispatch(subscribeBaseAA());
      // if (aaActive === null) {
      dispatch(getAasByBase());
      // }

      client.client.ws.addEventListener("close", () => {
        dispatch(closeNetwork());
        clearInterval(update);
        clearInterval(heartbeat);
      });

      const heartbeat = setInterval(function() {
        client.api.heartbeat();
      }, 10 * 1000);

      if (aaActive) {
        dispatch(changeActiveAA(aaActive));
      }
      dispatch(openNetwork());
      dispatch(watchRequestAas());
      const update = setInterval(() => {
        dispatch(updateRate());
      }, 60000);
      return () => {};
    });
  });

  // useEffect(() => {
  //   if (!network) {
  //     // const subscribable = setInterval(() => {
  //     if (client && client.client && client.client.open) {
  //       if (aaActive) {
  //         dispatch(changeActiveAA(aaActive));
  //       }
  //       dispatch(openNetwork());
  //       client.client.ws.addEventListener("close", () => {
  //         dispatch(closeNetwork());
  //       });
  //       // clearInterval(subscribable);
  //     }
  //   }
  //   // , 1000);
  //   // }
  //   console.log("TEST NEW SOCKET");
  // }, [network, dispatch, client, aaActive]);

  if (network) {
    return <div>{props.children}</div>;
  } else if (!network) {
    return (
      <Result
        status="500"
        title="Connection is broken"
        subTitle="Wait until the connection is restored or reload the page"
      />
    );
  }
};
