"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const server_1 = require("./server");
(() => {
    main();
})();
function main() {
    const server = new server_1.Server({
        apiPrefix: '/api',
        port: env_1.envs.PORT
    });
    void server.start();
}
