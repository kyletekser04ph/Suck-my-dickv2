const fs = require("fs-extra");
const config = require("../../config.dev.json");

module.exports.config = {
  name: "autoout",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "JARiF modified by Kylepogi",
  description: ".",
  commandCategory: "Admin",
  usages: "[number of members]",
  cooldowns: 0
};

module.exports.onLoad = () => {
  if (!config["leave"]) config["leave"] = {};
  if (!config["leave"]["status"]) config["leave"]["status"] = true;
  if (!config["leave"]["number"]) config["leave"]["number"] = 0;
  fs.writeFileSync("./config.dev.json", JSON.stringify(config, null, 4));
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const permission = ["100052395031835"];
  if (!permission.includes(event.senderID))
    return api.sendMessage("⛔ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗.\n▬▬▬▬▬▬▬▬▬▬▬▬\n💁🏻‍♂️ You don't have permission to use this command. Only my boss  Kyle敦. ဗီူ can do it", event.threadID, event.messageID);

  let number = parseInt(args[0]);
  if (isNaN(number)) number = config.leave.number;

  config.leave = {
    status: !config.leave.status,
    number: number
  };
  fs.writeFileSync("./config.dev.json", JSON.stringify(config, null, 4));

  const statusText = config.leave.status ? "enabled" : "disabled";
  return api.sendMessage(
    `ℹ️ Auto-leave feature has been ${statusText}.\n▬▬▬▬▬▬▬▬▬▬▬▬\nThe bot will leave groups with fewer than ${config.leave.number} members.`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, participantIDs } = event;

  if (
    config.leave.status &&
    participantIDs.length <= config.leave.number &&
    event.isGroup &&
    event.senderID !== api.getCurrentUserID() &&
    !config.ADMINBOT.includes(event.senderID)
  ) {
    await api.sendMessage(
      `⚠️ 𝗞𝘆𝗹𝗲 𝗪𝗮𝗿𝗻𝗶𝗻𝗴\n◆═════════════◆\n💁🏻‍♂️ This bot will leave the group because there are fewer than ${config.leave.number} members.\n💁🏻‍♂️ Currently, the number of members is ${participantIDs.length}/${config.leave.number} and the bot cannot operate properly.\n\n💁🏻‍♂️ Please add Kyle敦. ဗီူ to the group.\n🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/kyledev03`,
      threadID
    );

    return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
  }
};
