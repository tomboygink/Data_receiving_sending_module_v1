"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server_Receiver = void 0;
console.log("Hello server receiver");
var net_1 = __importDefault(require("net"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var datas_1 = require("./datas");
var Server_Receiver = (function () {
    function Server_Receiver() {
        this.debug = true;
        this.timeout = 10000;
        this.host = "0.0.0.0";
        this.port = 85;
        this.server = net_1.default.createServer();
        this.scount = 0;
    }
    Server_Receiver.prototype.startServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dir, logs;
            var _this = this;
            return __generator(this, function (_a) {
                dir = 'logs';
                logs = path.join(__dirname, '..', '..', '..', 'logs');
                if (!fs.existsSync(dir)) {
                    console.log('Create folder logs');
                    fs.mkdirSync(dir);
                }
                this.server.maxConnections = 200;
                this.server.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
                    var s_ind;
                    var _this = this;
                    return __generator(this, function (_a) {
                        socket.setTimeout(this.timeout);
                        socket.on('timeout', function () {
                            if (_this.debug) {
                                console.log("socket timeout");
                            }
                            if (!socket.connecting) {
                                return;
                            }
                            socket.end();
                        });
                        s_ind = this.scount;
                        this.scount++;
                        if (this.scount > 2400000)
                            this.scount = 0;
                        socket.on('error', function (err) { console.log(err); });
                        socket.on('close', function () {
                            if (_this.debug)
                                console.log(s_ind, " - Clent socket closed!");
                            if (!socket.connecting)
                                socket.end();
                            socket.destroy();
                        });
                        socket.on('data', function (data) {
                            var month = new Date().getMonth() + 1;
                            var file = 'log ' + new Date().getFullYear() + '.' + month + '.' + new Date().getDate() + '.txt';
                            if (!fs.existsSync(path.join(logs, file))) {
                                console.log('Create file logs');
                                fs.createWriteStream(path.join(logs, file), 'utf-8');
                            }
                            var date_log = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '| ';
                            var data_str = Buffer.from(data).toString().trim();
                            fs.appendFile(path.join(logs, file), date_log + data_str + '\n', 'utf-8', function (err) { });
                            fs.appendFile(path.join(logs, file), '________________________________________________________________________________\n', 'utf-8', function (err) { });
                            console.log("\x1B[37m", data_str);
                            if (data_str.length > 500) {
                                data_str = data_str.substr(0, 500);
                                socket.write('505', function () { if (_this.debug)
                                    console.log(s_ind, " << !505!"); });
                                socket.end();
                            }
                            else {
                                if (data_str[1] + data_str[2] + data_str[3] + data_str[4] === 'Time' || data_str[0] + data_str[1] === '10' || data_str[1] + data_str[2] + data_str[3] + data_str[4] === 'TEST') {
                                    if (data_str.length < 1) {
                                        socket.write('25', function () { if (_this.debug)
                                            console.log(s_ind, " << !25!"); });
                                        return;
                                    }
                                    if (data_str === "10") {
                                        socket.write('30', function () { if (_this.debug)
                                            console.log(s_ind, " << 10 -> !30!"); });
                                        return;
                                    }
                                    if (data_str.trim() === 'TEST') {
                                        socket.write('TEST - OK', function () { if (_this.debug)
                                            console.log(s_ind, " << TEST -> !TEST - OK!"); });
                                        return;
                                    }
                                    socket.write('20', function () { if (_this.debug)
                                        console.log(s_ind, " << !20!"); });
                                }
                                else {
                                    socket.end();
                                }
                            }
                            var srv_datas = new datas_1.ServerData(data_str, s_ind);
                            srv_datas.Run();
                        });
                        return [2];
                    });
                }); });
                this.server.listen(this.port, this.host, function () {
                    console.log("Слушаю порт", _this.port);
                    console.log("Готов к приему данных");
                });
                return [2];
            });
        });
    };
    return Server_Receiver;
}());
exports.Server_Receiver = Server_Receiver;
var server = new Server_Receiver();
server.startServer();
//# sourceMappingURL=main.js.map