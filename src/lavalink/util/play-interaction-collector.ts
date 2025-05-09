import { Logger } from '@nestjs/common';
import {
  ButtonInteraction,
  ComponentType,
  InteractionResponse,
  MessageFlags,
} from 'discord.js';
import { Player } from 'lavalink-client';

export function setupPlayInteractionCollector(
  message: InteractionResponse<boolean>,
  player: Player,
  userId: string,
  logger: Logger,
) {
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 300_000, // 5 minutes
  });

  collector.on('collect', async (btnInteraction: ButtonInteraction) => {
    if (btnInteraction.user.id !== userId) {
      return btnInteraction.reply({
        content: 'You can’t control this player.',
        flags: MessageFlags.Ephemeral,
      });
    }

    switch (btnInteraction.customId) {
      case 'pause':
        await player.pause();
        await btnInteraction.reply({
          content: 'Paused.',
          flags: MessageFlags.Ephemeral,
        });
        break;
      case 'skip':
        await player.skip();
        await btnInteraction.reply({
          content: 'Skipped.',
          flags: MessageFlags.Ephemeral,
        });
        break;
      case 'stop':
        await player.stopPlaying();
        await btnInteraction.reply({
          content: 'Stopped playback.',
          flags: MessageFlags.Ephemeral,
        });
        collector.stop();
        break;
    }
  });

  collector.on('end', async () => {
    try {
      await message.edit({ components: [] });
    } catch (e) {
      logger.warn('Failed to remove buttons after timeout.');
    }
  });
}
