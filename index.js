const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');

const prefix = '!fi';
var ready = false;

client.once('ready', () => {
	console.log('Ready');
	// TODO - Load channels id for each guilds
	ready = true;
});

client.on('message', message => {
	if(!ready){
		botLog(null, 'Received a message before the bot was ready!');
		return;
	}
	
	const currentMember = message.member;
	if(!currentMember){
		return;// Filter messages sent from the bot itself
	}
	const currentUser = currentMember.user;
	const currentUsername = currentUser.username;
	
	if(message.channel.type == 'text'){
		const currentGuild = message.channel.guild;
		const currentGuildId = currentGuild.id;
		const guildId = currentGuild.id;
		const channelId = message.channel.id;
		const messageContent = message.content;
		if(messageContent.startsWith(prefix + ' ')){
			if(!message.member.hasPermission('ADMINISTRATOR')){
				botLog(currentGuildId, currentUsername + ' tried to use an administrator command : ' + messageContent)
				return;
			}
			const args = messageContent.slice(prefix.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();
			const commandsArgs = args.join(' ');
			switch(command){
				case 'add':
				{
					botLog(currentGuildId, 'add');// TODO - Remove
					// TODO - Check if commandsArgs is like a channelId
					// TODO - Check if channelId for currentGuildId exists
					// TODO - Check if channelId for currentGuildId is not in the list of observed channels
					// TODO - Add channelId to the list of observed channels for currentGuildId
					break;
				}
				case 'del':
				case 'remove':
				{
					botLog(currentGuildId, 'remove');// TODO - Remove
					// TODO - Check if commandsArgs is like a channelId
					// TODO - Check if channelId for currentGuildId exists
					// TODO - Check if channelId for currentGuildId is already in the list of observed channels
					// TODO - Remove channelId to the list of observed channels for currentGuildId
					break;
				}
				case 'log':
				{
					botLog(currentGuildId, 'log');// TODO - Remove
					// TODO - Check if commandsArgs is like a channelId
					// TODO - Check if channelId for currentGuildId exists
					// TODO - Replace currentGuild logChannel
					break;
				}
				default:
				{
					botLog(currentGuildId, 'Unknown command: ' + command);
					break;
				}
			}
		}
		else{
			if(message.channel.name != 'recherche-joueurs'){// TODO - Check if given guildId/channelId is present in currentConfig
				return;
			}
			var discordInvitePattern = /discord\.gg\/(\w+)/g
			var discordInvites = discordInvitePattern.exec(messageContent);
			if(!discordInvites){
				message.delete();
				currentUser.send('Your message was removed because you tried to send a message without an invite.');
				botLog(currentGuildId, currentUsername + ' tried to send a message without any invite!');
				return;
			}
			var discordInvite = discordInvites[1];
			if(discordInvitePattern.exec(messageContent)){
				message.delete();
				currentUser.send('Your message was removed because you tried to send multiple invites at once.');
				botLog(currentGuildId, currentUsername + ' tried to send multiple invites at once!');
				return;
			}
			
			currentGuild.fetchInvites().then(invites => {
				var inviteIsInGuild = false;
				for(var invite of invites){
					if(invite[0] == discordInvite){
						inviteIsInGuild = true;
						break;
					}
				}
				if(!inviteIsInGuild){
					message.delete();
					currentUser.send('Your message was removed because you tried to send an invalid invite for the current server.');
					botLog(currentGuildId, currentUsername + ' tried to invite on another server!');
					return;
				}
			});
		}
	} else {
		currentUser.send('I only answer to guild text channels messages');
		botLog(null, currentUsername + ' tried to speak directly to the bot');
	}
});

function botLog(guildId, message){
	// TODO - Store the log in a file
	// TODO - Store the log on a specific channel if set for that guild
	console.log(message);
}

dotenv.config();
client.login(process.env.TOKEN);
