import { envs } from './env';
import { Server } from './server';

(() => {
 main();
})();

function main(): void {
 const server = new Server({
    apiPrefix: '/api',
    port: envs.PORT
 });
 void server.start();
}