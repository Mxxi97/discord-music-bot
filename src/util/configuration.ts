import { plainToInstance } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, validateSync } from 'class-validator';

export class Configuration {
  @IsDefined()
  @IsNumber()
  APP_PORT: number = 3000;
  @IsDefined()
  APP_HOST: string = '0.0.0.0';
  @IsDefined()
  ASSET_FOLDER_PATH: string;
  @IsDefined()
  LOG_LEVEL: string = 'info';

  @IsDefined()
  DB_HOST: string;
  @IsDefined()
  DB_USERNAME: string;
  @IsDefined()
  DB_PASSWORD: string;
  @IsDefined()
  DB_NAME: string;
  @IsDefined()
  DB_PORT: number = 3306;
  @IsOptional()
  DB_LOGGING: boolean = false;
  @IsOptional()
  SYNCHRONIZE_DB: boolean = false;

  @IsDefined()
  DISCORD_BOT_TOKEN: string;
  @IsDefined()
  DISCORD_CLIENT_ID: string;
  @IsDefined()
  DISCORD_CLIENT_SECRET: string;
  @IsDefined()
  DISCORD_CALLBACK_URL: string;

  @IsOptional()
  DISCORD_DEV_GUILD_ID: string;

  @IsDefined()
  LAVALINK_AUTHORIZATION: string;
  @IsDefined()
  LAVALINK_HOST: string;
  @IsDefined()
  LAVALINK_PORT: number = 2333;
}

export function configValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(Configuration, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
