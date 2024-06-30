import { AscendedProps, InputProps } from './command-interface/interface';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { SlashCommandProps, CommandOptions } from 'commandkit';
import axios, { AxiosResponse } from 'axios';

export const data = new SlashCommandBuilder()
  .setName('asa-search-cluster')
  .setDescription('Searches through the Web API to retrieve server data.')
  .addStringOption(option => option.setName('cluster-name').setDescription('Enter the cluster you wish to search.').setRequired(true))

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply({ ephemeral: false });

  const input: InputProps = {
    cluster: interaction.options.getString('cluster-name')!
  }

  const url: string = 'https://cdn2.arkdedicated.com/servers/asa/unofficialserverlist.json';
  const response: AxiosResponse<AscendedProps[]> = await axios.get(url);

  let globalGameserverCount: number = 0;
  let currentPlayerCount: number = 0, maximumPlayerCount: number = 0, globalPlayerCount: number = 0;
  const tasks = response.data.map((server: AscendedProps) => {
    globalGameserverCount += server.NumPlayers;

    if (server.Name.toLowerCase().includes(input.cluster.toLowerCase())) {
      currentPlayerCount += server.NumPlayers; maximumPlayerCount += server.MaxPlayers;
      globalPlayerCount++;
    }
  })

  await Promise.all(tasks).then(async () => {
    const embed: EmbedBuilder = new EmbedBuilder()
      .setDescription(`**Ark Survival Ascended**\n**Captain's Population App**\nPlayer Count: \`${currentPlayerCount}/${maximumPlayerCount}\`\nGameservers: \`${globalPlayerCount}\`\n\nHolds ${((currentPlayerCount / globalGameserverCount) * 100).toFixed(2)}% of active players.`)
      .setFooter({ text: 'Note: Contact support if issues persist.' })
      .setThumbnail('https://i.imgur.com/NK0ZePZ.png')
      .setColor(0x2ecc71);

    await interaction.followUp({ embeds: [embed] });
  })
}

export const options: CommandOptions = {
  userPermissions: ['Administrator'],
}; 