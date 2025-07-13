const os                      = require("os");
const networkInterfaces       = os.networkInterfaces();
const codeRegex = /\b\d{4,8}\b/g;
let ipAddress;
let sym = "𓏺|𓏺";

class ObjectoriesLikeToGetFucked {

    splitQuery(query){
        let splitted = query.split("&")
        let dict = {};
        for (let spl of splitted){
            let _spl = spl.split("=");
            dict[_spl[0]] = _spl[1];
        }
        return dict;
    }

    extractCodes(text){
        let codes = text.match(codeRegex) || [];
        let s = '';
        for (let code of codes){
            if (code != codes[codes.length - 1]){
                s += `<code>${code}</code> , `
            } else {
                s += `<code>${code}</code>`
            }
        }
        return s;
    }

    getServerIP(){
        for (const interfaceName in networkInterfaces) {
            for (const net of networkInterfaces[interfaceName]) {
                if (net.family === 'IPv4' && !net.internal) {
                    ipAddress = net.address;
                    break;
                }
            }
            if (ipAddress){ return ipAddress; }
        }
    }

    build(string) {
        const translationTable = {
            'q': 'ǫ', 'w': 'ᴡ', 'e': 'ᴇ', 'r': 'ʀ', 't': 'ᴛ',
            'y': 'ʏ', 'u': 'ᴜ', 'i': 'ɪ', 'o': 'ᴏ', 'p': 'ᴘ',
            'a': 'ᴀ', 's': 's', 'd': 'ᴅ', 'f': 'ғ', 'g': 'ɢ',
            'h': 'ʜ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'z': 'ᴢ',
            'x': 'x', 'c': 'ᴄ', 'v': 'ᴠ', 'b': 'ʙ', 'n': 'ɴ',
            'm': 'ᴍ'
        };

        return string.split('').map(char => translationTable[char] || char).join('');
    }

}

module.exports = { ObjectoriesLikeToGetFucked };