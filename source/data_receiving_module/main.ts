import net from "net"

import { CONFIG } from "../xcore/config"
import { ReceivingData } from "./datas"

export class Data_receiving_sending_module {

    server: net.Server;

    constructor() {
        this.server = net.createServer();
    }

    async run() {

        this.server.maxConnections = 200;


        this.server.on('connection', async (socket: net.Socket) => {
            socket.setTimeout(1000);
            socket.on('timeout', () => {
                if (!socket.connecting) { console.log("!socket.connecting " + !socket.connecting); return; }
                socket.end();
            })
            //Если ошибка
            socket.on('error', (error) => { console.log(error); });
            //Отключение клиента
            socket.on('close', () => {
                if (!socket.connecting) /*console.log("Client OFF");*/ socket.end();
                socket.destroy()
            });

            //При получении данных
            socket.on('data', (data) => {
                console.log("\x1b[32m Message receiving " + Buffer.from(data).toString().trim() + "\x1b[37m");

                //отправляем на модуль передачи данных
                var receiving_datas: ReceivingData = new ReceivingData(Buffer.from(data).toString().trim());
                receiving_datas.saveSqlData();

                socket.end();
            });
        });



        this.server.listen(CONFIG.data_receiving_module.port, CONFIG.data_receiving_module.host, () => {
            console.log(`Data_receiving_module started on ${CONFIG.data_receiving_module.host}:${CONFIG.data_receiving_module.port}`)
        });
    }

}

var data_receiving_sending_module = new Data_receiving_sending_module();
data_receiving_sending_module.run();
