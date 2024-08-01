const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "antispamv2",
    version: "1.0.0",
    author: "Kyle",
    countDown: 5,
    role: 0,
    shortDescription: "Ban users for spamming",
    longDescription: "Bans users for spamming, then automatically unbans them after a set period.",
    category: "owner",
    guide: "{pn}"
  },
  onStart: async function ({ api, event, global }) {
    const num = 5; // Number of spam messages before banning
    const timee = 60; // Time period in seconds for spam detection

    return api.sendMessage(
      `⚠️ | 𝗗𝗘𝗧𝗘𝗖𝗧 𝗦𝗣𝗔𝗠𝗠𝗜𝗡𝗚\n▬▬▬▬▬▬▬▬▬▬▬▬\n 💁🏻‍♂️ Automatically bans users if they spam ${num} times\nTime: ${timee}s\n▬▬▬▬▬▬▬▬▬▬▬▬`, 
      event.threadID, 
      event.messageID
    );
  },
  handleEvent: async function ({ Users, Threads, api, event, global }) {
    const { senderID, threadID } = event;
    const num = 5; // Number of spam messages before banning
    const timee = 60; // Time period in seconds for spam detection

    // Get thread information
    let datathread = (await Threads.getData(event.threadID)).threadInfo;

    // Initialize auto-ban data for the sender if not already present
    if (!global.client.autoban) global.client.autoban = {};
    if (!global.client.autoban[senderID]) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    }

    // Check if the message body exists and starts with the prefix
    const threadSetting = global.data.threadData.get(threadID) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    if (!event.body || !event.body.startsWith(prefix)) return;

    // Reset the count if the time period has passed
    if (global.client.autoban[senderID].timeStart + timee * 1000 <= Date.now()) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    } else {
      global.client.autoban[senderID].number++;
      if (global.client.autoban[senderID].number >= num) {
        // Gather user data
        const timeDate = moment.tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss");
        let dataUser = await Users.getData(senderID) || {};
        let data = dataUser.data || {};

        // Ban the user if not already banned
        if (data.banned) return;
        data.banned = true;
        data.reason = `\n\nSpam bot ${num} times/${timee}s\n\n`;
        data.dateAdded = timeDate;

        await Users.setData(senderID, { data });
        global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });

        // Send a message to the thread notifying about the ban
        api.sendMessage(
          `${senderID}\nName: ${dataUser.name}\n⚠️ 𝗦𝗣𝗔𝗠𝗠𝗜𝗡𝗚 𝗗𝗘𝗧𝗘𝗖𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\nReason: Spam bot ${num} times\nAutomatically unban after ${timee} seconds\n\nReport sent to admins\n\n▬▬▬▬▬▬▬▬▬▬▬▬`,
          threadID,
          () => {
            // Notify admins about the spam detection
            const adminIDs = global.config.ADMINBOT;
            for (let ad of adminIDs) {
              api.sendMessage(
                `⚠️ 𝗦𝗣𝗔𝗠𝗠𝗜𝗡𝗚 𝗗𝗘𝗧𝗘𝗖𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\nSpam ban notification\n\nSpam offenders ${num}/${timee}s\nName: ${dataUser.name}\nUser ID: ${senderID}\nGroup ID: ${threadID}\nGroup Name: ${datathread.threadName}\nTime: ${timeDate}\n\n▬▬▬▬▬▬▬▬▬▬▬▬`,
                ad
              );
            }
          }
        );

        // Reset the auto-ban data
        global.client.autoban[senderID] = {
          timeStart: Date.now(),
          number: 0
        };
      }
    }
  }
};
