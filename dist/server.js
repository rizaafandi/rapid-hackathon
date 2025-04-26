"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const env_1 = require("./env");
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const axios_1 = __importDefault(require("axios"));
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        const { port } = options;
        this.port = port;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.use((0, compression_1.default)());
            this.app.use((0, express_rate_limit_1.default)({
                max: 100,
                windowMs: 60 * 60 * 1000,
                message: 'Too many requests from this IP, please try again in one hour'
            }));
            this.app.get('/', (_req, res) => __awaiter(this, void 0, void 0, function* () {
                res.json({ message: 'Welcome to the API!' });
            }));
            this.app.post('/api/chat', (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { query } = req.body;
                const PROMPT = `Kamu adalah Jessica, stylist virtual yang stylish, sopan, dan selalu update.
        Balas kebutuhan fashion ini dengan HTML rapi: ${query}
        Gunakan <p> untuk penjelasan dan <ul><li> untuk list outfit.
        Hindari bahasa yang terlalu santai atau alay.
        Jangan tulis pengantar atau pembuka, langsung tampilkan HTML rapi saja.
    `;
                yield (0, axios_1.default)((_a = env_1.envs.API_URL_GEMINI) === null || _a === void 0 ? void 0 : _a.toString(), {
                    method: 'POST',
                    data: {
                        contents: [{
                                parts: [{ text: PROMPT }]
                            }]
                    },
                    headers: { 'Content-Type': 'application/json' }
                }).then((response) => {
                    return res.json(response.data);
                }).catch(er => {
                    console.error("ERROR: ", er);
                    return res.json(er);
                });
            }));
            this.app.listen(this.port, () => {
                console.log(`Server running on port ${this.port}...`);
            });
        });
    }
}
exports.Server = Server;
