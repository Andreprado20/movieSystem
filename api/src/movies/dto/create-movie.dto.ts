import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'titulo do filme',
    example: 'The Shawshank Redemption',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Sinopse do filme',
    example: 'Two imprisoned men bond over a number of years',
    required: false,
  })
  @IsOptional()
  @IsString()
  sinopse?: string;

  @ApiProperty({
    description: 'Diretor do filme',
    example: 'Frank Darabont',
    required: false,
  })
  @IsOptional()
  @IsString()
  diretor?: string;

  @ApiProperty({
    description: 'Elenco do filme',
    example: ['Tim Robbins', 'Morgan Freeman'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  elenco?: string[];

  @ApiProperty({
    description: 'Gêneros do filme',
    example: ['Drama', 'Crime'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genero?: string[];

  @ApiProperty({
    description: 'The release year of the movie',
    example: 1994,
  })
  @IsNotEmpty()
  @IsNumber()
  releaseYear: number;

  @ApiProperty({
    description: 'The duration of the movie in minutes',
    example: 142,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'The poster URL of the movie',
    example: 'https://example.com/poster.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;
} 