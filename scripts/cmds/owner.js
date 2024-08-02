const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info","Kyle"],
    author: "Kylepogi", 
    version: "2.0",
    cooldowns: 0,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "get bot owner info"
    },
    category: "owner",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {
      try {
        const loadingMessage = "⏱ 𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩......";
        await api.sendMessage(loadingMessage, event.threadID);

        const ownerInfo = {
          name: '𝖪𝗒𝗅𝖾(alyas pogi)',
          gender: '𝖡𝗈𝗒',
          hobby: '𝗉𝗅𝖺𝗒𝗂𝗇𝗀 𝗀𝖺𝗆𝖾𝗌,𝖾𝗍𝖼.',
          relationship: 'yet my life is single.',
          facebookLink: 'https://www.facebook.com/kyledev03',
          bio: 'Be kind whenever possible. It is always possible.'
        };

        const videoUrl = 
["https://i.imgur.com/erqTONU.mp4"];
        
        const tmpFolderPath = path.join(__dirname, 'tmp');

        if (!fs.existsSync(tmpFolderPath)) {
          fs.mkdirSync(tmpFolderPath);
        }

        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

        fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

        const response = `
➣ 📜 | 𝗢𝘄𝗻𝗲𝗿 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 ❏
࿇ ══━━━━✥◈✥━━━━══ ࿇    
 𝗡𝗔𝗠𝗘:${ownerInfo.name}  
 ━━━━━━━━━━━━━━━━━
 👤𝗚𝗘𝗡𝗗𝗘𝗥:${ownerInfo.gender}
 💫𝗛𝗼𝗯𝗯𝘆:${ownerInfo.hobby}
 💞𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: ${ownerInfo.relationship}
  ━━━━━━━━━━━━━━━━━
 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞—[🔗]:${ownerInfo.facebookLink}
  ━━━━━━━━━━━━━━━━━
 𝗠𝗢𝗧𝗧𝗢:${ownerInfo.bio} 
࿇ ══━━━━✥◈✥━━━━══ ࿇
 `;

        await api.sendMessage({
          body: response,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID);
      } catch (error) {
        console.error('Error in owner command:', error);
        api.sendMessage('An error occurred while processing the command.', event.threadID);
      }
    },
    onChat: async function({ api, event }) {
      try {
        const lowerCaseBody = event.body.toLowerCase();

        if (lowerCaseBody === "owner" || lowerCaseBody.startsWith("{p}owner")) {
          await this.onStart({ api, event });
        }
      } catch (error) {
        console.error('Error in onChat function:', error);
      }
    }
  };
