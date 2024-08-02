const { GoatWrapper } = require('fca-liane-utils');
const axios = require("axios");

module.exports = {
  config: {
    name: "tempmail2",
    version: "1.0",
    author: "ARN modified by Kyle",
    countDown: 5,
    role: 0,
    category: "tool",
  },

  onStart: async function ({ api, args, event }) {
    try {
      if (args.length === 0) {
        return api.sendMessage("💁🏻‍♂️ 𝗭𝗘𝗣𝗛𝗬𝗥𝗨𝗦 𝗡𝗢𝗧𝗜𝗙.\n▬▬▬▬▬▬▬▬▬▬▬▬\n\nℹ️ Use 'tempmail2 gen' to generate a temporary email or 'tempmail2 inbox (email)' to retrieve inbox messages.", event.threadID, event.messageID);
      }

      const command = args[0].toLowerCase();

      if (command === "gen") {
        let email;
        try {
          const response = await axios.get("https://for-devs.onrender.com/api/mail/gen?apikey=api1");
          email = response.data.email;
        } catch (error) {
          console.error("❌ | Primary API failed for email generation", error);
          try {
            const response = await axios.get("https://markdevs-last-api.onrender.com/api/gen");
            email = response.data.email;
          } catch (error) {
            console.error("❌ | Secondary API failed for email generation", error);
            try {
              const response = await axios.get("https://t-mail.vercel.app/api/generate_email");
              email = response.data.email;
            } catch (error) {
              console.error("❌ | Tertiary API failed for email generation", error);
              return api.sendMessage("❌ | Failed to generate email. Please try again later.", event.threadID, event.messageID);
            }
          }
        }
        return api.sendMessage(`✅ | 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬\n▬▬▬▬▬▬▬▬▬▬▬▬\n\n📩 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 𝗲𝗺𝗮𝗶𝗹: ${email}`, event.threadID, event.messageID);
      } else if (command === "inbox" && args.length === 2) {
        const email = args[1];
        if (!email) {
          return api.sendMessage("❌ | Provide an email address for the inbox.", event.threadID, event.messageID);
        }

        let inboxMessages;
        try {
          const inboxResponse = await axios.get(`https://for-devs.onrender.com/api/mail/inbox?email=${email}&apikey=api1`);
          inboxMessages = inboxResponse.data;
        } catch (error) {
          console.error("❌ | Primary API failed for fetching inbox messages", error);
          try {
            const inboxResponse = await axios.get(`http://markdevs-last-api.onrender.com/api/getmessage/${email}`);
            inboxMessages = inboxResponse.data;
          } catch (error) {
            console.error("❌ | Secondary API failed for fetching inbox messages", error);
            try {
              const inboxResponse = await axios.get(`https://t-mail.vercel.app/api/inbox?email=${email}`);
              inboxMessages = inboxResponse.data;
            } catch (error) {
              console.error("❌ | Tertiary API failed for fetching inbox messages", error);
              return api.sendMessage("❌ | Failed to retrieve inbox messages. Please try again later.", event.threadID, event.messageID);
            }
          }
        }

        if (inboxMessages.length === 0) {
          return api.sendMessage("❌ | No messages found in the inbox.", event.threadID, event.messageID);
        }

        const formattedMessages = inboxMessages.map(({ date, sender, message }) => `📅 𝗗𝗮𝘁𝗲: ${date}\n📧 𝗙𝗿𝗼𝗺: ${sender}\n📩 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${message}`).join('\n\n');
        return api.sendMessage(`✅ | 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬\n▬▬▬▬▬▬▬▬▬▬▬▬\n\n📬 𝗜𝗻𝗯𝗼𝘅 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀 𝗳𝗼𝗿 ${email}:\n\n${formattedMessages}\n\nOld messages will be deleted after some time.`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`❌ | 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.\n▬▬▬▬▬▬▬▬▬▬▬▬\n💁🏻‍♂️ Use 'tempmail2 gen' to generate a temporary email or 'tempmail2 inbox (email)' to retrieve inbox messages.`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: false });
