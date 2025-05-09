import { IntentsBitField } from 'discord.js';
import { NecordModule as NecordModuleProvider } from 'necord';
import { join } from 'path';

import { NecordLavalinkModule } from '@necord/lavalink';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { LavalinkModule } from './lavalink/lavalink.module';
import { NecordModule } from './necord/necord.module';
import { Configuration, configValidation } from './util/configuration';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidation,
    }),
    NecordModuleProvider.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService<Configuration>],
      useFactory: (configService: ConfigService<Configuration>) => ({
        token: configService.getOrThrow<string>('DISCORD_BOT_TOKEN'),
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildVoiceStates,
          IntentsBitField.Flags.MessageContent,
        ],
        development: [configService.getOrThrow<string>('DISCORD_DEV_GUILD_ID')],
      }),
    }),
    NecordLavalinkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService<Configuration>],
      useFactory: (configService: ConfigService<Configuration>) => ({
        nodes: [
          {
            authorization: configService.getOrThrow<string>(
              'LAVALINK_AUTHORIZATION',
            ),
            host: configService.getOrThrow<string>('LAVALINK_HOST'),
            port: configService.getOrThrow<number>('LAVALINK_PORT'),
          },
        ],
      }),
    }),
    NecordModule,
    LavalinkModule,
  ],
})
export class AppModule {}
