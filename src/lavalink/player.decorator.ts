import { NecordExecutionContext, SlashCommandContext } from 'necord';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { getOrCreatePlayer } from './util/interaction-context-utils';

/**
 * Injects or creates a Lavalink player for the given interaction.
 *
 * If a player already exists for the interaction's guild, it will be returned.
 * Otherwise, a new player will be created and returned.
 *
 * @returns The Lavalink player for the interaction's guild.
 */
export const InjectOrCreatePlayer = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const necordCtx = NecordExecutionContext.create(ctx);
    const [interaction] = necordCtx.getContext<SlashCommandContext>();

    return getOrCreatePlayer(interaction);
  },
);
