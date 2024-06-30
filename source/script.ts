import { Client, GatewayIntentBits } from 'discord.js';
import { discord } from './config.json';
import { CommandKit } from 'commandkit';
import path from 'path';

const client: Client<boolean> = new Client({
  intents: [GatewayIntentBits.Guilds]
});

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'command-handler'),
  eventsPath: path.join(__dirname, 'event-handler'),
  bulkRegister: true,
});

client.login(discord.token)
  .then(() => console.log('Client logged in...'));