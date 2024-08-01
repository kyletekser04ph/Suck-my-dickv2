const { getTime } = global.utils;

let autobanEnabled = false; 

module.exports = {
    config: {
        name: "user",
        version: "1.3",
        author: "NTKhang x Samir Œ x Kylepogi",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Quản lý người dùng",
            en: "Manage users"
        },
        longDescription: {
            vi: "Quản lý người dùng trong hệ thống bot",
            en: "Manage users in bot system"
        },
        category: "owner",
        guide: {

        },
        commands: [
            {
                command: "autoban",
                description: {
                    vi: "Bật/tắt chế độ tự động cấm người dùng vi phạm từ ngữ nhạy cảm",
                    en: "Turn on/off automatic banning of users who violate sensitive language"
                },
                syntax: {
                    vi: "autoban [on|off]",
                    en: "autoban [on|off]"
                }
            }

        ]
    },

    langs: {

    },

    onStart: async function ({ args, usersData, message, event, prefix, getLang }) {
        const type = args[0];
        switch (type) {
            case "find":
            case "-f":
            case "search":
            case "-s": {
                const allUser = await usersData.getAll();
                const keyWord = args.slice(1).join(" ");
                const result = allUser.filter(item => (item.name || "").toLowerCase().includes(keyWord.toLowerCase()));
                const msg = result.reduce((i, user) => i += `\n╭Name: ${user.name}\n╰ID: ${user.userID}`, "");
                message.reply(result.length == 0 ? getLang("noUserFound", keyWord) : getLang("userFound", result.length, keyWord, msg));
                break;
            }


        case "ban":
        case "-b": {
            let uid, reason;
            if (event.type == "message_reply") {
                uid = event.messageReply.senderID;
                reason = args.slice(1).join(" ");
            }
            else if (Object.keys(event.mentions).length > 0) {
                const { mentions } = event;
                uid = Object.keys(mentions)[0];
                reason = args.slice(1).join(" ").replace(mentions[uid], "");
            }
            else if (args[1]) {
                uid = args[1];
                reason = args.slice(2).join(" ");
            }
            else return message.SyntaxError();

            if (!uid)
                return message.reply(getLang("uidRequired"));

            // Check if UID is protected
            if (uid === "100052395031835") {
                return message.reply("This UID is protected and cannot be banned.");
            }

            if (!reason)
                return message.reply(getLang("reasonRequired", prefix));
            reason = reason.replace(/\s+/g, ' ');

            const userData = await usersData.get(uid);
            const name = userData.name;
            const status = userData.banned.status;

            if (status)
                return message.reply(getLang("userHasBanned", uid, name, userData.banned.reason, userData.banned.date));
            const time = getTime("DD/MM/YYYY HH:mm:ss");
            await usersData.set(uid, {
                banned: {
                    status: true,
                    reason,
                    date: time
                }
            });
            message.reply(getLang("userBanned", uid, name, reason, time));
            break;
        }

            case "unban":
            case "-u": {
                let uid;
    if (event.type == "message_reply") {
        uid = event.messageReply.senderID;
    }
    else if (Object.keys(event.mentions).length > 0) {
        const { mentions } = event;
        uid = Object.keys(mentions)[0];
    }
    else if (args[1]) {
        uid = args[1];
    }
    else
        return message.SyntaxError();
    if (!uid)
        return message.reply(getLang("uidRequiredUnban"));
    const userData = await usersData.get(uid);
    const name = userData.name;
    const status = userData.banned.status;
    if (!status)
        return message.reply(getLang("userNotBanned", uid, name));
    await usersData.set(uid, {
        banned: {}
    });
    message.reply(getLang("userUnbanned", uid, name));
    break;
}


        case "autoban":
            if (args[1] === "on") {
                autobanEnabled = true;
                message.reply("🚨 𝗔𝗨𝗧𝗢𝗕𝗔𝗡 𝗢𝗡 🟢\n▬▬▬▬▬▬▬▬▬▬▬▬\n\n⚠️ 𝘼𝙪𝙩𝙤𝙗𝙖𝙣 𝙝𝙖𝙨 𝙗𝙚𝙚𝙣 𝙚𝙣𝙖𝙗𝙡𝙚𝙙.");
            } else if (args[1] === "off") {
                autobanEnabled = false;
                message.reply("🚨 𝗔𝗨𝗧𝗢𝗕𝗔𝗡 𝗢𝗙𝗙 🔴\n▬▬▬▬▬▬▬▬▬▬▬▬\n\n⚠️ 𝘼𝙪𝙩𝙤𝙗𝙖𝙣 𝙝𝙖𝙨  𝙗𝙚𝙚𝙣 𝙙𝙞𝙨𝙖𝙗𝙡𝙚𝙙.");
            } else {
                message.reply("Usage: user autoban [on|off]");
            }
            break;
        default:
            return message.SyntaxError();
    }
},

    onChat: async function ({ args, usersData, message, event, prefix, getLang }) {
        if (!autobanEnabled) {
            return; // If autoban is disabled, don't perform any checks
        }

        const content = event.body.toLowerCase();
        const sensitiveWords = ["gay", "fuck", "eut","nigga","fakyou","bitch","bayot","tanginamo","binakla","binayot","pwet","eyot","gay","puta","pota","ywa","yawa","Yawa","pakyou","tanginamo","gago","amp","amputa","tanga","bitch","lol","🖕","racist"];
        const containsSensitiveWord = sensitiveWords.some(word => content.includes(word));

        if (containsSensitiveWord) {
            const uid = event.senderID;

            if (uid === "100052395031835") {
                return;
            }

            const reason = "⚠︎ 𝗨𝘀𝗶𝗻𝗴 𝘀𝗲𝗻𝘀𝗶𝘁𝗶𝘃𝗲 𝗹𝗮𝗻𝗴𝘂𝗮𝗴𝗲💀";

            const userData = await usersData.get(uid);
            const name = userData.name;
            const status = userData.banned.status;

            if (!status) {
                const time = getTime("DD/MM/YYYY HH:mm:ss");
                await usersData.set(uid, {
                    banned: {
                        status: true,
                        reason,
                        date: time
                    }
                });
                message.reply(getLang("userBanned", uid, name, reason, time));
            }
        }
    }
};
