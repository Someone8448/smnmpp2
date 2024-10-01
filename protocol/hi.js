var FormData = require('form-data');
if (config.discord) var axios = require('axios');
module.exports.run = async (ws, msg) => {
	ws.ip = ws.upgradeReq.headers['x-forwarded-for'] 
			? ws.upgradeReq.headers['x-forwarded-for'].split(',')[0]
			: ws._socket.remoteAddress;

	ws.ip = ws.ip.includes('::ffff:') ? ws.ip.split('::ffff:')[1] : ws.ip;
if (ws.connected) return;
try {
if (msg.login && msg.login.type === "discord" && config.discord) {
var form = new FormData();
form.append("client_id", config.discord.id);
form.append("client_secret", config.discord.secret);
form.append("code", msg.login.code);
form.append("grant_type", "authorization_code");
form.append('redirect_uri', config.discord.uri)
var auth_request = await axios.request({url: "https://discord.com/api/oauth2/token", method: "POST", data: form, headers: {"Content-Type": "application/x-www-form-urlencoded"}})
//console.log(auth_request.data);
//var form = new FormData();
//form.append('client_id', config.discord.id);
//form.append('client_secret', config.discord.secret);
//form.append('refresh_token', auth_request.data.access_token);
//form.append('grant_type', "access_token");
//form.append('authorization_code', auth_request.data.access_token);
//form.app
var duser = await axios.request({url: "https://discord.com/api/users/@me", method: "GET", headers: {"Authorization": `Bearer ${auth_request.data.access_token}`}});
//console.log(duser.data);
var did = await db.discord.get(duser.data.id);
if (did) {
var user = [];
var U = await db.users.get(did);
user.push(U);
var token = await db.tokens.get(did);
user.push(token);
	console.log(ws.ip);
} else {
var user = fun.fun.newuser();
await db.discord.put(duser.data.id, user[0].p._id);
await db.tokens.put(user[0].p._id, user[1]);
await db.users.put(user[0].p._id, user[0]);
	console.log(ws.ip);
}
user[0].a = {type: "discord", username: duser.data.username, discriminator: duser.data.discriminator, avatar: `https://cdn.discordapp.com/avatars/${duser.data.id}/${duser.data.avatar}.png`};
await db.users.put(user[0].p._id, user[0]);
	console.log(ws.ip);
} else {
if (typeof msg.token !== "string") throw new Error()
if (msg.token.split('.').length != 2) throw new Error()
var token = await db.tokens.get(msg.token.split('.')[0]);
if (!token) throw new Error();
if (token !== msg.token.split('.')[1]) throw new Error();
var U = await db.users.get(msg.token.split('.')[0]);
var user = [];
user.push(U);
user.push(token);
	console.log(ws.ip);
}
} catch (error) {
//console.log(error)
try {
var ip = await db.ips.get(ws.ip);
if (!ip) throw new Error();
var token = await db.tokens.get(ip);
if (!token) throw new Error();
var U = await db.users.get(ip);
var user = [];
user.push(U);
user.push(token);
	console.log(ws.ip);
} catch (error2) {
var user = await fun.fun.newuser();
await db.ips.put(ws.ip, user[0].p._id);
await db.tokens.put(user[0].p._id, user[1]);
await db.users.put(user[0].p._id, user[0]);
	console.log(ws.ip);
}
};
if (user[0].p.vanished && !user[0].r.includes('vanish')) {
	delete user[0].p.vanished;
	await db.users.put(user[0].p._id, user[0])
}
if (user[0].ban) {
	if (!user[0].ban.permanent && Date.now() > user[0].ban.ends) {
		delete user[0].ban;
		await db.users.put(user[0].p._id, user[0]);
	} else {
		if (user[0].ban.permanent) {
			await ws.sendData({"m":"notification","duration":15000,"target":"#room","html":`You are currently banned from the site for forever.<br>Reason: ${user[0].ban.reason}<br>Your _ID: ${user[0].p._id}<br>${config.punishment}`,"title":"Notice"}, true);
		} else await ws.sendData({"m":"notification","duration":15000,"target":"#room","html":`You are currently banned from the site for ${fun.fun.mstotime(user[0].ban.ends - Date.now())}.<br>Reason: ${user[0].ban.reason}<br>Your _ID: ${user[0].p._id}<br>${config.punishment}`,"title":"Notice"}, true);
		await ws[config.uws ? "end" : "close"]();
		return "exit"
	}
}
if (user[0].rank < 2 && !user[0].bot && !ws.code && config.antibot) return;
if (user[0].rank < 2 && !user[0].bot && msg.code !== ws.code && config.antibot) {
	user[0].ban = {permanent: false, duration: 3600000, ends: Date.now() + 3600000, _id: "server", reason: "Using bots outside of a browser without authorization"};
	await db.users.put(user[0].p._id, user[0]);
	connections.filter(a => a._id === user[0].p._id).forEach(a => a.close());
	ws.close();
	return "exit";
}

if (user[0].mute) {
	if (!user[0].mute.permanent && Date.now() > user[0].mute.ends) {
		delete user[0].mute;
		await db.users.put(user[0].p._id, user[0]);
	} else {
		if (user[0].mute.permanent) {
			ws.sendData({"m":"notification","duration":15000,"target":"#room","html":`You are currently ${user[0].mute.type === "all" ? 'note and chat' : user[0].mute.type} muted on the site for forever.<br>Reason: ${user[0].mute.reason}<br>Your _ID: ${user[0].p._id}<br>${config.punishment}`,"title":"Notice"});
		} else ws.sendData({"m":"notification","duration":15000,"target":"#room","html":`You are currently ${user[0].mute.type === "all" ? 'note and chat' : user[0].mute.type} muted on the site for ${fun.fun.mstotime(user[0].mute.ends - Date.now())}.<br>Reason: ${user[0].mute.reason}<br>Your _ID: ${user[0].p._id}<br>${config.punishment}`,"title":"Notice"});
	}
}

//var user = fun.fun.newuser();
//console.log(user)
if (connections.filter(a => a._id === user[0].p._id).length >= user[0].q.clients * config.quotas.clients) {
await ws.sendData({"m":"notification","duration":15000,"target":"#room","html":`You currently have the maximum amount of clients connected.<br>Your _ID: ${user[0].p._id}`,"title":"Notice"}, true);
await ws[config.uws ? "end" : "close"]();
return "exit";
}

var perms = {};
user[0].r.forEach(a => {perms[a] = true});
ws.sendData({m: "hi", token: user[0].p._id + "." + user[1], u: user[0].p, permissions: perms, t: Date.now(), accountInfo: user[0].a});
ws.connected = true;
ws._id = user[0].p._id;
["mouse", "channel", "chat", "kickban", "channelset", "ls", "custom", "crown"].forEach(a => {
ws.quotas[a] = fun.fun.quota(config.quotas[a][0] * user[0].q[a], config.quotas[a][1]);
})
ws.quotas.note = fun.fun.newquota({interval: 2000, points: user[0].q.note * config.quotas.note, allowance: (user[0].q.note * config.quotas.note) / 3});
ws.note = fun.fun.quota(12, 2000);
if (!userset[ws._id]) userset[ws._id] = fun.fun.quota(config.quotas.userset[0] * user[0].q.userset, config.quotas.userset[1])
}
module.exports.name = "hi"
