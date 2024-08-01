const { GoatWrapper } = require('fca-liane-utils');
 const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "clean",
    aliases: ["c","cl","th","trash"],//["c"] add aliases like that 
    author: "kshitiz",//modified by Kyle
    version: "2.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "help to clean cache and tmp folder"
    },
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {
    const cacheFolderPath = path.join(__dirname, 'cache');
    const tmpFolderPath = path.join(__dirname, 'tmp');


    api.sendMessage({ body: '♻️𝘾𝙡𝙚𝙖𝙣𝙞𝙣𝙜\n▬▬▬▬▬▬▬▬▬▬▬▬\n𝙘𝙖𝙘𝙝𝙚 𝙖𝙣𝙙 𝙩𝙢𝙥 𝙛𝙤𝙡𝙙𝙚𝙧𝙨...', attachment: null }, event.threadID, () => {

      const cleanFolder = (folderPath) => {

        if (fs.existsSync(folderPath)) {

          const files = fs.readdirSync(folderPath);

          if (files.length > 0) {

            files.forEach(file => {
              const filePath = path.join(folderPath, file);

              fs.unlinkSync(filePath);
              console.log(`File ${file} deleted successfully from ${folderPath}!`);
            });

            console.log(`All files in the ${folderPath} folder deleted successfully!`);
          } else {
            console.log(`${folderPath} folder is empty.`);
          }
        } else {
          console.log(`${folderPath} folder not found.`);
        }
      };


      cleanFolder(cacheFolderPath);


      cleanFolder(tmpFolderPath);


      api.sendMessage({ body: '🚮𝗖𝗟𝗘𝗔𝗡𝗜𝗡𝗚\n▬▬▬▬▬▬▬▬▬▬▬▬\n𝘤𝘢𝘤𝘩𝘦 𝘢𝘯𝘥 𝘵𝘮𝘱 𝘧𝘰𝘭𝘥𝘦𝘳𝘴 𝘤𝘭𝘦𝘢𝘯𝘦𝘥 𝘴𝘶𝘤𝘤𝘦𝘴𝘴𝘧𝘶𝘭𝘭𝘺(◍•ᴗ•◍)!!' }, event.threadID);
    });
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: false });
