const { GoatWrapper } = require('fca-liane-utils');
const fs = require("fs-extra");

const axios = require("axios");

const path = require("path");

const { getPrefix } = global.utils;

const { commands, aliases } = global.GoatBot;

const doNotDelete = "GoatBot V2"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy



module.exports = {

  config: {

    name: "helpall",

    version: "1.0",

    author: "Kyle", //don't  change the author nigga

    countDown: 5,

    role: 0,

    shortDescription: {

      en: "View command usage and list all commands directly",

    },

    longDescription: {

      en: "View command usage and list all commands directly",

    },

    category: "𝗵𝗲𝗹𝗽𝗮𝗹𝗹",

    guide: {

      en: "{pn} / help cmdName ",

    },

    priority: 1,

  },



  onStart: async function ({ message, args, event, threadsData, role }) {

    const { threadID } = event;

    const threadData = await threadsData.get(threadID);

    const prefix = getPrefix(threadID);



    if (args.length === 0) {

      const categories = {};

      let msg = "𓃵 𝗭𝗘𝗣𝗛 𝗟𝗜𝗦𝗧-𝗔𝗟𝗟-𝗖𝗠𝗗𝗦\n▬▬▬▬▬▬▬▬▬▬▬▬";



      msg += ``; // replace with your name 



      for (const [name, value] of commands) {

        if (value.config.role > 1 && role < value.config.role) continue;



        const category = value.config.category || "Uncategorized";

        categories[category] = categories[category] || { commands: [] };

        categories[category].commands.push(name);

      }



      Object.keys(categories).forEach((category) => {

        if (category !== "info") {

          msg += `\n➤〔 ${category.toUpperCase()}  〕\n`;



          const names = categories[category].commands.sort();

          for (let i = 0; i < names.length; i += 3) {

            const cmds = names.slice(i, i + 3).map((item) => `[🏷] <◉> ${item}\n`);

            msg += ` ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;

          }



          msg += ``;

        }

      });



      const totalCommands = commands.size;

      msg += ``;

      msg += `\n𝘁𝗼𝘁𝗮𝗹 𝗼𝗳 𝗯𝗼𝘁 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 » 『${totalCommands}』\n▬▬▬▬▬▬▬▬▬▬▬▬\n𝚃𝚑𝚒𝚜 𝚋𝚘𝚝 𝚒𝚜 𝚛𝚎𝚖𝚊𝚍𝚎 𝚘𝚏 𝙰𝚞𝚝𝚘𝚋𝚘𝚝 𝚡 𝚇𝚊𝚟𝚒𝚊 𝚋𝚘𝚝 𝚡 𝙶𝚘𝚊𝚝𝚋𝚘𝚝𝚟𝟸 𝚋𝚢 𝚝𝚑𝚎 (𝚘𝚠𝚗𝚎𝚛)\n\n𝚘𝚛𝚒𝚐𝚒𝚗𝚊𝚕 𝚜𝚛𝚌 𝚒𝚜 𝙶𝚘𝚊𝚝𝚋𝚘𝚝𝚟𝟸 𝚋𝚢 (𝙽𝚃𝚔𝚑𝚊𝚗𝚐)\n╔═══════════╗\n  𝚘𝚠𝚗𝚎𝚛:𝗞𝗬𝗟𝗘 \n╚═══════════╝`; // its not decoy so change it if you want 



      await message.reply(msg);

    } else {

      const commandName = args[0].toLowerCase();

      const command = commands.get(commandName) || commands.get(aliases.get(commandName));



      if (!command) {

        await message.reply(`Command "${commandName}" not found.`);

      } else {

        const configCommand = command.config;

        const roleText = roleTextToString(configCommand.role);

        const author = configCommand.author || "Unknown";



        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";



        const guideBody = configCommand.guide?.en || "No guide available.";

        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);



        const response = `[📜] - 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗛𝗲𝗹𝗽\n▬▬▬▬▬▬▬▬▬▬▬▬\n◉𝖭𝖺𝗆𝖾 » ${configCommand.name} \n◉credits » ${author} \n◉𝖠𝗅𝗂𝖺𝗌𝖾𝗌 » ${configCommand.aliases ? configCommand.aliases.join():"Do Not Have"} \n◉𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇 » ${longDescription} \n◉𝖴𝗌𝖺𝗀𝖾 » ${usage}`;



        await message.reply(response);

      }

    }

  },

};



function roleTextToString(roleText) {

  switch (roleText) {

    case 0:

      return "0 (All users)";

    case 1:

      return "1 (Group administrators)";

    case 2:

      return "2 (Admin bot)";

    default:

      return "Unknown role";

  }

	    }

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: false });
