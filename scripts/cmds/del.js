module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    author: "Kylepogi",
role: 2,
    category: "𝗱𝗲𝗹𝗲𝘁𝗲 𝗳𝗶𝗹𝗲"
  },

  onStart: async function ({ api, event, args }) {
    const fs = require('fs');
    const path = require('path');

    const fileName = args[0];

    if (!fileName) {
      api.sendMessage("⚠️ Please provide a file name to delete.", event.threadID);
      return;
    }

    const filePath = path.join(__dirname, fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        api.sendMessage(`❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗱𝗲𝗹𝗲𝘁𝗲!!\n▬▬▬▬▬▬▬▬▬▬▬▬\n🗃 𝘾𝙖𝙣𝙘𝙚𝙡 𝙛𝙞𝙡𝙚: ${fileName}.`, event.threadID);
        return;
      }
      api.sendMessage(`♻️ 𝗧𝗥𝗔𝗦𝗛𝗜𝗡𝗚 𝗙𝗜𝗟𝗘:\n▬▬▬▬▬▬▬▬▬▬▬▬\n🗃 𝙁𝙞𝙡𝙚: 『${fileName} 』𝘿𝙚𝙡𝙚𝙩𝙚 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮!\n▬▬▬▬▬▬▬▬▬▬▬▬`, event.threadID);
    });
  }
};
