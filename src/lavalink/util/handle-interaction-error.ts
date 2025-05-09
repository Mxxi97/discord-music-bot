// src/common/utils/interaction-error-handler.ts
import {
  CacheType,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import { Logger } from '@nestjs/common';

export async function handleInteractionError(
  interaction: ChatInputCommandInteraction<CacheType>,
  error: Error,
  logger: Logger = new Logger('InteractionErrorHandler'),
) {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  logger.error(
    `Error occurred while handling interaction: ${interaction.commandName} - ${interaction.user?.tag} (${interaction.user?.id}) - ${interaction.guild?.name} (${interaction.guild?.id})`,
    error.message || 'An unexpected error occurred',
    // error.stack || 'No stack trace available',
  );

  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply({
      content: `❌ ${message}`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
