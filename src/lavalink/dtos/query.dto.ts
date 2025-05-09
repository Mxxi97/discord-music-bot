import { StringOption } from 'necord';

export class PlayQueryDto {
  @StringOption({
    name: 'query',
    description: 'The name or URL of the song you want to play',
    required: false,
  })
  query?: string;
}

export class AddQueryQueryDto {
  @StringOption({
    name: 'query',
    description: 'The name or URL of the song you want to play',
    required: true,
  })
  query!: string;
}
