import obyte from "obyte";
import config from "./config";

const client = new obyte.Client("wss://obyte.org/bb-test", {
  testnet: config.testnet,
  reconnect: true
});

setInterval(function() {
  client.api.heartbeat();
}, 10 * 1000);
export default client;
