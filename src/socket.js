// import obyte from "obyte";
import obyte from "./obyte.min";
import config from "./config";
let client;
try {
  client = new obyte.Client("wss://obyte.org/bb-test", {
    testnet: config.testnet,
    reconnect: true
  });

  const heartbeat = setInterval(function() {
    client.api.heartbeat();
  }, 10 * 1000);

  client.client.ws.addEventListener("close", () => {
    clearInterval(heartbeat);
  });
} catch (e) {
  console.log("socket error: ", e);
}
export default client;
