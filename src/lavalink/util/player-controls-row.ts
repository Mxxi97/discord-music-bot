import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createPlayerControlsRow() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pause')
      .setLabel('Pause')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('skip')
      .setLabel('Skip')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('stop')
      .setLabel('Stop')
      .setStyle(ButtonStyle.Danger),
  );
}
