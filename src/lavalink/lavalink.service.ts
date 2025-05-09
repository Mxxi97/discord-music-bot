import { MessageFlags } from 'discord.js';
import { Player } from 'lavalink-client';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';

import { NecordLavalinkService, PlayerManager } from '@necord/lavalink';
import { Injectable, Logger } from '@nestjs/common';

import { AddQueryQueryDto, PlayQueryDto } from './dtos/query.dto';
import {
  InjectOrCreatePlayer,
  registerPlayerContext,
} from './player.decorator';
import { handleInteractionError } from './util/handle-interaction-error';
import { setupPlayInteractionCollector } from './util/play-interaction-collector';
import { createPlayerControlsRow } from './util/player-controls-row';

@Injectable()
export class LavalinkService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly playerManager: PlayerManager,
    private readonly lavalinkService: NecordLavalinkService,
  ) {
    registerPlayerContext(this.playerManager, this.lavalinkService);
  }

  @SlashCommand({
    name: 'play',
    description: 'Play a song',
  })
  public async onPlay(
    @Context() [interaction]: SlashCommandContext,
    @Options() { query }: PlayQueryDto,
    @InjectOrCreatePlayer() player: Player,
  ) {
    try {
      await player.connect();

      if (query) {
        try {
          const res = await player.search(
            {
              query,
            },
            interaction.user.id,
          );

          await player.queue.add(res.tracks[0]);

          if (player.playing) player.stopPlaying();
          await player.play();
        } catch (error) {
          this.logger.error(error);
          return interaction.reply({
            content: 'An error occurred while searching for the track.',
            flags: MessageFlags.Ephemeral,
          });
        }
      } else {
        await player.play();
      }

      const row = createPlayerControlsRow();
      const message = await interaction.reply({
        content: query ? `Now playing: ${query}` : `Now playing from queue.`,
        components: [row],
      });

      setupPlayInteractionCollector(
        message,
        player,
        interaction.user.id,
        this.logger,
      );
    } catch (error) {
      handleInteractionError(interaction, error, this.logger);
    }
  }

  @SlashCommand({
    name: 'skip',
    description: 'Skip the current song',
  })
  public async onSkip(
    @Context() [interaction]: SlashCommandContext,
    @Options() { amount }: { amount: number },
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.skip(amount);

    return interaction.reply({
      content: `Skipped ${amount} songs.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'pause',
    description: 'Pause the current song',
  })
  public async onPause(
    @Context() [interaction]: SlashCommandContext,
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.pause();

    return interaction.reply({
      content: `Paused the current song.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'resume',
    description: 'Resume the current song',
  })
  public async onResume(
    @Context() [interaction]: SlashCommandContext,
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.resume();

    return interaction.reply({
      content: `Resumed the current song.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'stop',
    description:
      'Clears the queue and stops playing. Does not destroy the Player and not leave the channel',
  })
  public async onStop(
    @Context() [interaction]: SlashCommandContext,
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.stopPlaying();

    return interaction.reply({
      content: `Stopped the current song.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'destroy',
    description: 'Destroy the player and disconnect from the voice channel',
  })
  public async onDestroy(
    @Context() [interaction]: SlashCommandContext,
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.destroy();

    return interaction.reply({
      content: `Destroyed the current player.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'seek',
    description: 'Seek to a specific position in the current song',
  })
  public async onSeek(
    @Context() [interaction]: SlashCommandContext,
    @Options() { position }: { position: number },
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.seek(position);

    return interaction.reply({
      content: `Seeked to ${position}ms.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'volume',
    description: 'Set the volume of the current player',
  })
  public async onVolume(
    @Context() [interaction]: SlashCommandContext,
    @Options() { volume }: { volume: number },
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.setVolume(volume);

    return interaction.reply({
      content: `Set the volume to ${volume}.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'queue',
    description: 'Get the current queue',
  })
  public async onQueue(
    @Context() [interaction]: SlashCommandContext,
    @InjectOrCreatePlayer() player: Player,
  ) {
    const queue = player.queue.tracks
      .map((track) => track.info.title)
      .join(', ');

    return interaction.reply({
      content: `Current queue: ${queue}`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'nowplaying',
    description: 'Get the current song',
  })
  public async onNowPlaying(
    @Context() [interaction]: SlashCommandContext,
    @InjectOrCreatePlayer() player: Player,
  ) {
    const currentTrack = player.queue.current;
    if (!currentTrack) {
      return interaction.reply({
        content: 'There is no track currently playing.',
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction.reply({
      content: `Now playing: ${currentTrack.info.title}`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: 'add',
    description: 'Add a song to the queue',
  })
  public async onAdd(
    @Context() [interaction]: SlashCommandContext,
    @Options() { query }: AddQueryQueryDto,
    @InjectOrCreatePlayer() player: Player,
  ) {
    await player.connect();
    try {
      const res = await player.search(
        {
          query,
        },
        interaction.user.id,
      );
      await player.queue.add(res.tracks[0]);
    } catch (error) {
      this.logger.error(error);
      return interaction.reply({
        content: 'An error occurred while searching for the track.',
        flags: MessageFlags.Ephemeral,
      });
    }
    return interaction.reply({
      content: `Added ${query} to the queue`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
