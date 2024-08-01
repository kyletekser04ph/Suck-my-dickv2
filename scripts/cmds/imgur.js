const axios = require('axios');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
		config: {
				name: "imgur",
				version: "1.0.0",
				role: 0,
				author: "cliff modified by kylepogi",
				shortDescription: "imgur upload",
				countDown: 0,
				category: "imgur",
				guide: {
						en: '[reply to image]'
				}
		},

		onStart: async ({ api, event }) => {
				let link2;

				if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
						link2 = event.messageReply.attachments[0].url;
				} else if (event.attachments.length > 0) {
						link2 = event.attachments[0].url;
				} else {
						return api.sendMessage('⛔ 𝗡𝗼 𝗮𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁 𝗱𝗲𝘁𝗲𝗰𝘁𝗲𝗱\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n ❗Please reply to an image.', event.threadID, event.messageID);
				}

				try {
						const res = await axios.get(`http://158.101.198.227:8609/imgur2?link=${encodeURIComponent(link2)}`);
						const link = res.data.uploaded.image;
						return api.sendMessage(`✅ 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗜𝗺𝗴𝘂𝗿 𝗟𝗶𝗻𝗸\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n❗link for the image you provided:\n\n${link}`, event.threadID, event.messageID);
				} catch (error) {
						console.error("Error uploading image to Imgur:", error);
						return api.sendMessage("An error occurred while uploading the image to Imgur.", event.threadID, event.messageID);
				}
		}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: false });
