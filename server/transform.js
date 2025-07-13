const SERVER = "127.0.0.1";
const SERVER_PORT = 9932;

const portsubs = {
  "7": 20,
  "15": 30,
  "30": 60
}

const mysql        = require("mysql");
const TelegramBot  = require("node-telegram-bot-api");
const crypto       = require("crypto");
const { exec } = require("child_process");
const { unlink } = require("fs");

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "drugs"
});

con.connect(async (err) => {
  if (err){
    console.error("error: " + err.stack);
    return;
  }

  console.log(`[transform] connected -> ${con.threadId}`);

  con.query("CREATE TABLE IF NOT EXISTS ctomers (id BIGINT PRIMARY KEY, charged INT, ports TEXT, is_ban INT NULL, gwallet INT)", (err, results) => {
    if (err){
      console.log("[transform] error while creating table -> " + err)
    }
  });

  con.query("CREATE TABLE IF NOT EXISTS trans (hash VARCHAR(64) NOT NULL)", (err, res) => {
    if (err){
      console.log("[transform] error while creating trans table -> " + err);
    }
  })

  con.query("CREATE TABLE IF NOT EXISTS gifts (id VARCHAR(16) PRIMARY KEY, about INT)", (err, res) => {
    if (err){
      console.log("[transform] error while creating gifts table -> " + err)
      return;
    }
  })

  con.query("CREATE TABLE IF NOT EXISTS global_gifts (id VARCHAR(16) PRIMARY KEY, about INT, opened TEXT, until BIGINT)", (err, res) => {
    if (err){
      console.log("[transform] error while creating global-gifts table -> " + err)
      return;
    }
  })

  con.query("CREATE TABLE IF NOT EXISTS panel (sid INT, admins TEXT, pay INT)", (err, res) => {
    if (err){
      console.log("[transform] error while creating panel -> " + err);
      return;
    }
    con.query("SELECT * FROM panel", (err, res) => {
      if (res.length < 1){
    
        con.query("INSERT INTO panel (sid, admins, pay) VALUES (?, ?, ?)", [1, JSON.stringify([5483232752]), 6])
      }
    })
  })

})

class UserDataTransform {

  async getAll(callback = () => {}){
    con.query("SELECT * FROM ctomers", (err, results) => {
      if (err){
        callback([]);
        console.log(err);
      } else {
        callback(results);
      }
    })
  }

  async getUserById(id, callback = () => {}){
    await this.getAll((users) => {
      for (let i = 0;i < users.length; i++){
        let user = users[i];
        if (user.id == id){
          user.ports = JSON.parse(user.ports);
          user.is_ban = user.is_ban == 0 ? false : true;
          callback({status: true, user: user});
          return;
        }
      }
      callback({status: false, message: "ID_NOT_FOUND"});
    })
  }

  async getUserByPort(port, password, callback = () => {}){
    await this.getAll(async (users) => {
      for (let i = 0;i< users.length; i++){
        let user = users[i];
        let prt = JSON.parse(user.ports);
        if (Object.keys(prt).length != 0){
          if (prt.name == port && prt.password == password){
            callback({
              status: true,
              port: prt,
              user: user
            });
            return;
          }
        }
      }
      callback({status: false});
    })
  }

  createGiftId(){
    return crypto.createHash("md5").update(
      ( Math.floor( Math.random() * 99999999 ) - 1000 ).toString()
    ).digest("hex").slice(0, 16);
  }

  async createGift(about, callback = () => {}){
    let tox = this.createGiftId();
    con.query("INSERT INTO gifts (id, about) VALUES (?, ?)", [tox, about]);
    callback({status: true, gift: tox})
  }

  async useGift(id, gid, callback = () => {}){
    con.query("SELECT * FROM gifts", async (err, rows) => {
      if (err){
        callback({status: false, message: err});
        return;
      }
      for (let gift of rows){
        if (gift.id == gid){
          await this.getUserById(id, async (tl) => {
            if (tl.user){
              tl.user.gwallet += gift.about
              con.query("DELETE FROM gifts WHERE id = ?", gid);
              con.query("UPDATE ctomers SET gwallet = ? WHERE id = ?", [tl.user.gwallet, id])
              callback({status: true, charged: tl.user.charged, about: gift.about});
              return;
            }
          })
        }
      }
      callback({status: false})
    })
  }

  async getGifts(callback = () => {}){
    con.query("SELECT * FROM gifts", (err, res) => {
      if (err){
        callback({status: false, message: err});
        return;
      }
      callback({status: true, gifts: res});
    })
  }
  
  async getGlobalGifts(callback = () => {}){
    con.query("SELECT * FROM global_gifts", (err, res) => {
      if (err){
        callback({status: false, message: err});
        return;
      }
      let thegifs = [];
      for (let gift of res){
        gift.opened = JSON.parse(gift.opened);
        thegifs.push(gift);
      }
      callback({status: true, gifts: thegifs});
    })
  }

  async deleteGlobalGift(id, callback = () => {}){
    await this.getGlobalGifts(async (allgifts) => {
      for (let gift of allgifts.gifts){
        if (gift.id == id){
          con.query("DELETE FROM global_gifts WHERE id = ?", id);
          callback({ status: true });
          return;
        }
      }

      callback({ status: false, message: "GIFT_CODE_NOT_FOUND" });
      return;

    })
  }

  async createGlobalGift(about, since, callback = () => {}){
    let tox = this.createGiftId();
    con.query("INSERT INTO global_gifts (id, about, opened, until) VALUES (?, ?, ?, ?)", [tox, about, "[]", Date.now()+since]);
    callback({status: true, gift: tox})
  }

  async useGlobalGift(id, gid, callback = () => {}){
    await this.getGlobalGifts(async (allgifts) => {
      let f = false;
      for (let gift of allgifts.gifts){
        if (gift.id == gid){
          f = true;
          await this.getUserById(id, async (tl) => {
            if (tl.status){
              if (gift.opened.includes(tl.user.id)){
                callback({status: false, message: "CANNOT_USE_TWICE"});
                return;
              } else {
                tl.user.gwallet += gift.about
                gift.opened.push(id);
                con.query("UPDATE global_gifts SET opened = ? WHERE id = ?", [JSON.stringify(gift.opened), gid]);
                con.query("UPDATE ctomers SET gwallet = ? WHERE id = ?", [tl.user.gwallet, id])
                callback({status: true, charged: tl.user.charged, about: gift.about, until: gift.until});
                return;
              }
            } else {
              callback({status: false, message: "INVALID_USER_ID"});
              return;
            }
          })
        }
      }

      if (!f){
        callback({ status: false, message: "INVALID_GIFT_CODE" });
        return;
      }
    })
  }

  async isPortExists(port, callback = () => {}){
    await this.getAll((users) => {
      for (let i = 0;i<users.length;i++){
        let user = users[i];
        if (user.ports == port){
          callback(true);
          return;
        }
      }
      callback(false);
    })
  }

  async addHash(hash, callback = () => {}){
    con.query("INSERT INTO trans (hash) VALUES (?)", [hash], (err, res) => {
      if (err){
        callback({status: false, message: err});
        return;
      } else {
        callback({status: true});
        return;
      }
    })
  }

  async isHashExists(hash, callback = () => {}){
    con.query("SELECT * FROM trans", (err, res) => {
      if (err){
        callback({status: false, message: err});
        return;
      } else {
        for (let hsh of res){
          if (hsh.hash == hash){
            callback({status: true});
            return;
          }
        }
        callback({status: false, message: "HASH_NOT_FOUND"});
      }
    })
  }

  async add(id, callback = () => {}){
    await this.getUserById(id, (u) => {
      if (u.status){
        callback({status: false, message: "EXISTS_USER"});
        return;
      }
    
      con.query("INSERT INTO ctomers (id, charged, ports, is_ban, gwallet) VALUES (?, ?, ?, ?, ?)", [id, 0, "{}", 0, 0], (err, data) => {
        if (err){
          callback({status: false, message: err});
          console.log(err);
        } else {
          callback(data);
        }
      })
    })
  }

  async getTracInfo(hash, callback = () => {}){
    let ready = `https://apilist.tronscanapi.com/api/transaction-info?hash=${hash}`;
    await axios.get(ready).then((item) => {
      if (item.data){
        callback({status: true, amount: item.data.contractData.amount / 1000000, from: item.data.contractData.owner_address, to: item.data.contractData.to_address})
      } else {
        callback({status: false})
      }
    })
  }

  async increaseCharge(id, amount, isgift, callback = () => {}){
    await this.getUserById(id, async (user) => {
      if (!user.status){
        callback({status: false, message: user.message});
        return;
      }

      user.user.charged += amount;
      user.user.gwallet = user.user.gwallet === undefined || user.user.gwallet === null ? 0 : user.user.gwallet;
      if (isgift){
        if (user.user.gwallet !== undefined || user.user.gwallet !== null){
          user.user.gwallet += amount;
        } else {
          user.user.gwallet = amount;
        }
      }
      con.query("UPDATE ctomers SET charged = ? , gwallet = ? WHERE id = ?", [user.user.charged, user.user.gwallet, id], (err, res) => {
        if (err){
          callback({status: false, message: err});
          return;
        }
        callback({status: true, charged: user.user.charged});
      })

    })
  }

  async decreaseCharge(id, amount, callback = () => {}){
    await this.getUserById(id, async (user) => {
      if (!user.status){
        callback({status: false, message: user.message});
        return ;
      }
      user.user.gwallet = user.user.gwallet === undefined || user.user.gwallet === null ? 0 : user.user.gwallet;
      console.log(user.user.gwallet);
      if (user.user.gwallet >= amount){
        console.log('using gwallet')
        user.user.gwallet -= amount
        con.query("UPDATE ctomers SET gwallet = ? WHERE id = ?", [user.user.gwallet, id], (err, res) => {
          if (err){
            callback({status: false, message: err});
            return;
          }
          callback({status: true})
        })
      } else if (user.user.gwallet < amount && user.user.gwallet != 0 && (user.user.charged + user.user.gwallet) >= amount ){
        console.log("using second loop")
        user.user.charged += user.user.gwallet;
        user.user.gwallet = 0;
        user.user.charged -= amount;
        con.query("UPDATE ctomers SET charged = ? , gwallet = ? WHERE id = ?", [user.user.charged, user.user.gwallet, id], (err, res) => {
          if (err){
            callback({status: false, message: err});
            return;
          }
          callback({status: true});
        })
      } else if (user.user.gwallet == 0 && user.user.charged >= amount){
        user.user.charged -= amount;
        console.log("using only main wallet")
        con.query("UPDATE ctomers SET charged = ? WHERE id = ?", [user.user.charged, id], (err, res) => {
          if (err){
            callback({status: false, message: err});
            return;
          }
          callback({status: true, charged: user.user.charged});
        })
      } else {
        callback({status: false, message: "NOT_ENOUGH_MONEY"});
      }
    })
  }

  async getPaid(callback = () => {}){
    con.query("SELECT * FROM panel", (err, result) => {
      if (err){
        callback({status: false, message: err});
        return;
      }
      callback({status: true, paid: result[0].pay, admins: JSON.parse(result[0].admins)});
    })
  }

  async createPort(id, port, password, token, chat_id, until, much, callback = () => {}){
    await this.getUserById(id, async (user) => {
      if (!user.status){
        callback({status: false, message: user.message});
        return;
      }
      if (Object.keys(user.user.ports).length != 0){
        callback({status: false, message: "CANNOT_BUY_TWICE"});
        return;
      }
      await this.isPortExists(port, async (doesit) => {
        if (doesit){
          callback({status: false, message: "EXISTS_PORT"});
          return;
        }

        await this.decreaseCharge(id, much, async (dch) => {
          if (!dch.status){
            callback(dch);
            return;
          }
        
          let portobj = {
            name: port,
            token: token,
            password: password,
            chat_id: chat_id,
            activated_in: new Date().getTime(),
            will_end: until
          };
          con.query("UPDATE ctomers SET ports = ? WHERE id = ?", [JSON.stringify(portobj), id], (err, res) => {
            if (err){
              callback({status: false, message: err});
              return;
            }

            exec(`node remote.js ${token} ${chat_id} ${port} ${password} ${id} ${SERVER} ${SERVER_PORT}`);
            callback({status: true, port: portobj});
          })
        })
      })
    })
  }

  async changePaid(paid, callback = () => {}){
    con.query("UPDATE panel SET pay = ? WHERE sid = ?", [paid, 1]);
    callback({status: true});
  }

  async addAdmin(adid, callback = () => {}){
    await this.getPaid((res) => {
      if (!res.status){
        callback(res);
        return;
      }
      res.admins.push(adid);
      con.query("UPDATE panel SET admins = ? WHERE sid = ?", [JSON.stringify(res.admins), 1]);
      callback({status: true});
    })
  }

  async removeAdmin(adid, callback = () => {}){
    await this.getPaid((res) => {
      if (!res.status){
        callback(res);
        return;
      }
      if (res.admins.includes(adid)){
        res.admins.splice(res.admins.indexOf(adid));
      }
      con.query("UPDATE panel SET admins = ? WHERE sid = ?", [JSON.stringify(res.admins), 1]);
      callback({status: true});
    })
  }

  async safeRemovePort(id){
    await this.getUserById(id, async (user) => {
      if (user.status){
        if (user.user.ports.will_end <= new Date().getTime()){
          let text = `👤 | اشتراک ریموت وکس به اتمام رسید !\n🫆 | توجه داشته باشید که با شارژ کردن حسابتون میتونید دوباره اشتراک تهیه کنید\n\n❄️ | برای خرید اشتراک به @OX_CookerBot مراجعه کنید`
          try{
            let cli = new TelegramBot(user.user.ports.token);
            await cli.sendMessage(
              user.user.ports.chat_id,
              text,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "تمدید ⚙️",
                        url: "t.me/OX_CookerBot"
                      }
                    ]
                  ]
                }
              }
            )
          } catch (e) {true}
          con.query("UPDATE ctomers SET ports = ? WHERE id = ?", ["{}", id]);
        }
      }
    })
  }

  async restartAll(){
	  await this.getAll(async (allusers) => {
      for (let user of allusers){
        if (user.ports != "{}"){
          let prt = JSON.parse(user.ports);
          exec(`node remote.js ${prt.token} ${prt.chat_id} ${prt.name} ${prt.password} ${user.id} ${SERVER} ${SERVER_PORT}`);
        }
      }
    })
  }

  async bandana(id, ban, callback = () => {}){
    await this.getUserById(id, async (user) => {
      if (!user.status){
        callback(user);
        return;
      }
      con.query("UPDATE ctomers SET is_ban = ? WHERE id = ?", [ban == true ? 1 : 0, id], (err, res) => {
        if (err){
          callback({status: false, message: err});
          return;
        }
        callback({status: true});
      })
    })
  }

  async changePassword(id, newpass, callback = () => {}){
    await this.getUserById(id, async (user) => {
      if (!user.status){
        callback(user);
        return;
      }

      if (Object.keys(user.user.ports).length === 0){
        callback({
          status: false,
          message: "USER_HAS_NO_PORT"
        });
        return;
      }

      user.user.ports.password = newpass.trim();

      con.query("UPDATE ctomers SET ports = ? WHERE id = ?", [JSON.stringify(user.user.ports), id], (err, res) => {
        if (err){
          callback({status: false, message: err.message});
          return;
        }
        callback({status: true});
      })

    })
  }

}

module.exports = { UserDataTransform };
