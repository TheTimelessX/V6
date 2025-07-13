// put http handler 

const net                            = require("net");
const fs                             = require("fs");
const http                           = require("http");
const path                           = require("path");
const url                            = require("url");
const crypto                         = require("crypto");
const TelegramBot                    = require("node-telegram-bot-api");
const {
        theHandler, 
        oltg
    }                                = require("./handler");
const { HttpHandler }                = require("./httphandler");
const { UserDataTransform }          = require("./transform");

const udt = new UserDataTransform();
const handler = new theHandler(udt);
const httpHandler = new HttpHandler();

const server = net.createServer(async (socket) => {
    socket.on('data', async (data) => {
        try{
            let message = JSON.parse(data.toString());
            console.log(message)
            if (Object.keys(message).includes("mask")){
                if (message.mask == "metro"){
                    if (Object.keys(message).includes("port") && Object.keys(message).includes("password")){
                        await udt.getUserByPort(message.port, message.password, async (_port) => {
                            let bot = new TelegramBot(_port.port.token);
                            
                            if (!_port.status){
                                message.shortcut.edit == false ? await bot.sendMessage(
                                    message.shortcut.chat_id,
                                    oltg.build("🔴 𓏺|𓏺 invalid port or password detected"),
                                    {
                                        reply_to_message_id: message.shortcut.message_id
                                    }
                                ) : await bot.editMessageText(
                                    oltg.build("🔴 𓏺|𓏺 invalid port or password detected"),
                                    {
                                        chat_id: message.shortcut.chat_id,
                                        message_id: message.shortcut.message_id
                                    }
                                )
                                return;
                            }

                            if (_port.user.is_ban){
                                message.shortcut.edit == false ? await bot.sendMessage(
                                    message.shortcut.chat_id,
                                    oltg.build("🔴 𓏺|𓏺 sorry but you got banned"),
                                    {
                                        reply_to_message_id: message.shortcut.message_id
                                    }
                                ) : await bot.editMessageText(
                                    oltg.build("🔴 𓏺|𓏺 sorry but you got banned"),
                                    {
                                        chat_id: message.shortcut.chat_id,
                                        message_id: message.shortcut.message_id
                                    }
                                )
                                return;
                            }

                            await handler.addUserToAcceptedPorts({
                                port: message.port,
                                password: message.password,
                                socket: socket
                            })

                            await handler.handleRemote(socket, message, bot);

                        })
                    } else {
                        socket.write(JSON.stringify({
                            status: false,
                            method: Object.keys(message).includes("method") ? message.method : "error",
                            message: "PORT_AND_PASSWORD_NOT_FOUND"
                        }));
                        return;
                    }
                } else {
                    socket.write(JSON.stringify({
                        status: false,
                        method: Object.keys(message).includes("method") ? message.method : "error",
                        message: "PORT_AND_PASSWORD_NOT_FOUND",
                        device_id: message.device_id
                    }));
                    return;
                }
            } else if (Object.keys(message).includes("port") && Object.keys(message).includes("password") && (!Object.keys(message).includes("mask") || message.mask !== "metro")){
                await udt.getUserByPort(message.port, message.password, async (prt) => {
                    if (prt.status){
                        let cli = new TelegramBot(prt.port.token);
                        await handler.handleUser(socket, message, cli);
                    } else {
                        socket.write(JSON.stringify({
                            status: false,
                            message: "INVALID_PORT_OR_PASSWORD"
                        }))
                    }
                })
            }
        } catch (e){ console.log(e);socket.write(JSON.stringify({
            status: false,
            method: "error",
            message: "INVALID_DATA_TYPE"
        })) }
    })

    socket.on("close", async () => {
        let idx = 0;
        let pid = 0;
        for (let u of handler.accepted_users){
            if (u.socket.remoteAddress == socket.remoteAddress){
                handler.accepted_users.splice(idx, 1);
            } else { idx += 1; }
        }

        for (let p of handler.accepted_ports){
            if (p.socket.remoteAddress == socket.remoteAddress){
                handler.accepted_ports.splice(pid, 1);
            } else { pid += 1; }
        }

    })
    socket.on("error", async (errx) => {console.log(errx);})

})
// handle parameters
const httpserver = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        let message = oltg.splitQuery(url.parse(req.url).query);
        message.edit = Boolean(message.edit);
        message.status = Boolean(message.status);
        await udt.getUserByPort(message.port, message.password, async (user) => {
            if (!user.status){
                res.writeHead(404, JSON.stringify({
                    error: "invalid port or password"
                }));
                return;
            }

            if (user.user.is_ban){
                res.writeHead(404, JSON.stringify({
                    error: "you were banned"
                }));
                return;
            }

            let rnd = Math.floor( Math.random() * 999999999999 ) - 100000;
            rnd += "_" + crypto.createHash("md5").update(rnd.toString()).digest('hex');
            const filePath = path.join(__dirname, `${rnd}.${message.ext}`, '.');
            const writeStream = fs.createWriteStream(filePath);
            req.pipe(writeStream);

            let bot = new TelegramBot(user.port.token);

            writeStream.on('finish', async () => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify({status: true}));
                await httpHandler.handle(message, bot, oltg);
            });
        })
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <form method="POST" enctype="multipart/form-data">
                <input type="file" name="file" />
                <button type="submit">Upload</button>
            </form>
        `);
    }
});

server.listen(9932, "0.0.0.0", () => {
    let getCurrentIp = oltg.getServerIP();
    console.log("[B] socket-server connected");
    console.log("[B] socket-connection -> 127.0.0.1:9932");
    if (!getCurrentIp == "127.0.0.1"){
        console.log(`[B] socket-connection -> ${getCurrentIp}:9932`);
    }
})

httpserver.listen(5567, "0.0.0.0", () => {
    let getCurrentIp = oltg.getServerIP();
    console.log("[B] http-server connected");
    console.log("[B] http-connection -> 127.0.0.1:5567");
    if (!getCurrentIp == "127.0.0.1"){
        console.log(`[B] http-connection -> ${getCurrentIp}:5567`);
    }
})

process.on("uncaughtException", async (err) => {
    console.log("[B] error detected:", err);
})