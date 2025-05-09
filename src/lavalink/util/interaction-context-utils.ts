import {
  CacheType,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';

import { NecordLavalinkService, PlayerManager } from '@necord/lavalink';

let playerManager: PlayerManager;
let lavalinkService: NecordLavalinkService;

export function registerPlayerContext(
  manager: PlayerManager,
  service: NecordLavalinkService,
) {
  playerManager = manager;
  lavalinkService = service;
}

export function getGuildOrReply(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const guild = interaction.guild;
  if (!guild) {
    interaction.reply({
      content: 'This command can only be used in a guild.',
      flags: MessageFlags.Ephemeral,
    });
    throw new Error('This command can only be used in a guild.');
  }
  return guild;
}

export function getMemberOrReply(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const member = interaction.member;
  if (!member || !('voice' in member) || !member.voice.channelId) {
    interaction.reply({
      content: 'You must be in a voice channel to use this command.',
      flags: MessageFlags.Ephemeral,
    });
    throw new Error('You must be in a voice channel to use this command.');
  }
  return member;
}

export function getOrCreatePlayer(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const guild = getGuildOrReply(interaction);

  const existingPlayer = playerManager.get(guild.id);
  if (!existingPlayer!) {
    const player = playerManager.create({
      ...lavalinkService.extractInfoForPlayer(interaction),
      selfDeaf: true,
      selfMute: false,
      volume: 75,
    });
    return player;
  }

  return existingPlayer;
}

export function getPlayerOrReply(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const guild = getGuildOrReply(interaction);

  const player = playerManager.get(guild.id);
  if (!player) {
    interaction.reply({
      content: 'There is no player for this guild.',
      flags: MessageFlags.Ephemeral,
    });

    throw new Error('There is no player for this guild.');
  }
  return player;
}
