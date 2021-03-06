import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Result, Spin } from "antd";
import obyte from "obyte";
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
import history from "../../history";
import { subscribeTokenRegistry } from "../../store/actions/aa/subscribeTokenRegistry";
export const WatcherUpdate = props => {
  const dispatch = useDispatch();
  const aaActive = useSelector(state => state.aa.active);
  const listByBase = useSelector(state => state.aa.listByBase);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const network = useSelector(state => state.aa.network);

  useEffect(() => {
    if (aaActive) {
      history.replace({ ...history.location.pathname, hash: `#${aaActive}` });
    }
    const unlisten = history.listen((location, action) => {
      if (action === "PUSH" || action === "PUP") {
        if (aaActive) {
          history.replace({ ...location.pathname, hash: `#${aaActive}` });
        }
      }
    });
    return () => {
      unlisten();
    };
  }, [dispatch, aaActive]);
  useEffect(() => {
    if (history.location.hash !== "") {
      if (listByBaseLoaded) {
        const address = history.location.hash.slice(1);
        if (obyte.utils.isValidAddress(address)) {
          if (aaActive !== address) {
            const wasFound = listByBase.findIndex(aa => aa.address === address);
            if (wasFound !== -1) {
              dispatch(changeActiveAA(address));
            } else {
              message.error("Address is not found!");
            }
          }
        } else {
          message.error("Address is not valid!");
        }
      }
    }
    // eslint-disable-next-line
  }, [dispatch, listByBaseLoaded]);
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
      dispatch(subscribeTokenRegistry());
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
  if (!listByBaseLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh"
        }}
      >
        <div>
          <Spin size="large" />
        </div>
      </div>
    );
  }
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
