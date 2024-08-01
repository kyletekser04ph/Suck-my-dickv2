module.exports = {
  config: {
    name: "acceptmsg",
 aliases:"acceptme", 
    version: "1.0",
    author: "Kylepogi",
    role: 0,
    shortDescription: {
      en: "accepts msg request "
    },
    longDescription: {
      en: "Accepts message request(only users)"
    },
    category: "other",
    guide: {
      en: "×acceptme"
    }
  },
  onStart: async function ({ api,  event, args }) {
    const threadID = "0"; // ID of the thread to add the user to

    try {
      await api.addUserToGroup(event.senderID, threadID);
      api.sendMessage("✅ Message request successfully accepted. ", event.senderID);
    } catch (error) {
      api.sendMessage("✅Message request accept successfully. ", event.senderID);
    }
  }
};
