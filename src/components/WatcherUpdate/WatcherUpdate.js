import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  // changeActiveAA,
  updateInfoActiveAA,
  watchRequestAas,
  // clearSubscribesAA,
  // subscribeActualAA,
  getAasByBase,
  subscribeBaseAA
} from "../../store/actions/aa";

export const WatcherUpdate = props => {
  const dispatch = useDispatch();
  const aaActive = useSelector(state => state.aa.active);

  useEffect(() => {
    dispatch(subscribeBaseAA());
  }, [dispatch]);

  useEffect(() => {
    const watch = async () => {
      if (aaActive === null) {
        await dispatch(getAasByBase());
        // await dispatch(subscribeActualAA());
      }
    };
    watch();
  }, [dispatch, aaActive]);

  useEffect(() => {
    if (aaActive) {
      const update = setInterval(
        () => dispatch(updateInfoActiveAA(aaActive)),
        10000
      );
      return () => {
        clearInterval(update);
      };
    }
  }, [aaActive, dispatch]);

  useEffect(() => {
    dispatch(watchRequestAas());
  }, [dispatch]);
  //
  // useEffect(() => {
  //   client.client.ws.addEventListener("close", () => {
  //     dispatch(clearSubscribesAA());
  //   });
  //   client.client.ws.addEventListener("open", () => {
  //     if (aaActive) {
  //       dispatch(changeActiveAA(aaActive));
  //     }
  //   });
  // }, [dispatch, aaActive]);
  return <div>{props.children}</div>;
};
