
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "delete2",
		aliases: ["d", "df"], 
		version: "1.0",
		author: "ZenitshuAgatsuma",
		countDown: 5,
		role: 2,
		shortDescription: "Delete file and folders",
		longDescription: "Delete file",
		category: "owner",
		guide: "{pn}"
	},


  onStart: async function ({ args, message,event}) {
 const permission = ["100052395031835", "100052395031835"];
    if (!permission.includes(event.senderID)) {
      message.reply("You gay cannot do this. This command can only be used by my owner Zenitshu Agatsuma");
      return;
    }
    const commandName = args[0];

    if (!commandName) {
      return message.reply("Type the file name..");
    }

    const filePath = path.join(__dirname, '..', 'cmds', `${commandName}`);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        message.reply(`✅️|A command file has been deleted ${commandName} .`);
      } else {
        message.reply(`command file ${commandName} unavailable.`);
      }
    } catch (err) {
      console.error(err);
      message.reply(`Cannot be deleted because ${commandName}: ${err.message}`);
    }
  }
};
