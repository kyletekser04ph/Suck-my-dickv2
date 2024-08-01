const moment = require("moment-timezone");

module.exports = {
 config: {
 name: "accpuser",
 aliases: ['acpr','acceptuser'],
 version: "1.0",
 author: "Kylepogi",
 countDown: 5,
 role: 2,
 shortDescription: "accept  users",
 longDescription: "accept friend request by users",
 category: "ADMIN",
 },

 onReply: async function ({ message, Reply, event, api, commandName, UID }) {
   const permission = (global.GoatBot.config && global.GoatBot.config.adminBot) || [];
   if (!permission.includes(event.senderID)) {
     api.sendMessage("You don't have enough permission to use this command. Only admin users have access.", event.threadID, event.messageID);
     return;
   }

   const { author, listRequest } = Reply;
   if (author !== event.senderID) return;
   const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

   const form = {
     av: api.getCurrentUserID(),
     fb_api_caller_class: "RelayModern",
     variables: {
       input: {
         source: "friends_tab",
         actor_id: api.getCurrentUserID(),
         client_mutation_id: Math.round(Math.random() * 19).toString()
       },
       scale: 3,
       refresh_num: 0
     }
   };

   const success = [];
   const failed = [];

   if (args[0] === "add") {
     form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
     form.doc_id = "3147613905362928";
   } else if (args[0] === "del") {
     form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
     form.doc_id = "4108254489275063";
   } else {
     return api.sendMessage("Please select <add | del> <target number | all>", event.threadID);
   }

   let targetIDs = args.slice(1);

   if (args[1] === "all") {
     targetIDs = [];
     const lengthList = listRequest.length;
     for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
   }

   const newTargetIDs = [];
   const promiseFriends = [];

   for (const stt of targetIDs) {
     const u = listRequest[parseInt(stt) - 1];
     if (!u) {
       failed.push(`Can't find stt ${stt}`);
       continue;
     }
     form.variables.input.friend_requester_id = u.node.id;
     form.variables = JSON.stringify(form.variables);
     newTargetIDs.push(u);
     promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
     form.variables = JSON.parse(form.variables);
   }

   const lengthTarget = newTargetIDs.length;
   for (let i = 0; i < lengthTarget; i++) {
     try {
       const friendRequest = await promiseFriends[i];
       if (JSON.parse(friendRequest).errors) {
         failed.push(newTargetIDs[i].node.name);
       } else {
         success.push(newTargetIDs[i].node.name);
         // Modify the success message here
         if (args[0] === "add") {
           api.sendMessage(`${newTargetIDs[i].node.name}'s request has been accepted by the admin user.`, event.threadID);
         } else if (args[0] === "del") {
           api.sendMessage(`${newTargetIDs[i].node.name}'s friend request has been rejected.`, event.threadID);
         }
       }
     } catch (e) {
       failed.push(newTargetIDs[i].node.name);
     }
   }

   api.sendMessage(`${failed.length > 0 ? `The following ${failed.length} people encountered errors:\n${failed.join("\n")}` : ""}`, event.threadID, event.messageID);
 },

 onStart: async function ({ event, api, commandName }) {
   const form = {
     av: api.getCurrentUserID(),
     fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
     fb_api_caller_class: "RelayModern",
     doc_id: "4499164963466303",
     variables: JSON.stringify({ input: { scale: 3 } })
   };
   const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
   let msg = "";
   let i = 0;
   for (const user of listRequest) {
     i++;
     msg += (`\n${i}. Name: ${user.node.name}`
     + `\nID: ${user.node.id}`
     + `\nURL: ${user.node.url.replace("www.facebook", "fb")}`
     + `\nTime: ${moment(user.time * 1000).tz("Africa/Lagos").format("DD/MM/YYYY HH:mm:ss")}\n`);
   }
   api.sendMessage(`${msg}\nReply to this message with content: <add | del> <target number | all>`, event.threadID, (e, info) => {
     global.GoatBot.onReply.set(info.messageID, {
       commandName,
       messageID: info.messageID,
       listRequest,
       author: event.senderID,
     });
   }, event.messageID);
 },
};

//Made By Sammy Fix By Kylepogi
