import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('filmes')
@Controller('filmes')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo filme' })
  @ApiResponse({ status: 201, description: 'O filme foi criado com sucesso' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os filmes com paginação' })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de filmes' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('titulo')) sortBy: string,
    @Query('order', new DefaultValuePipe('asc')) order: 'asc' | 'desc',
  ) {
    return this.moviesService.findAll(page, limit, sortBy, order);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar filmes por titulo' })
  @ApiResponse({ status: 200, description: 'Retorna os filmes encontrados' })
  searchByTitle(@Query('titulo') titulo: string) {
    return this.moviesService.searchByTitle(titulo);
  }

  @Get('search/actor')
  @ApiOperation({ summary: 'Buscar filmes por ator' })
  @ApiResponse({ status: 200, description: 'Retorna os filmes encontrados' })
  searchByActor(@Query('ator') ator: string) {
    return this.moviesService.searchByActor(ator);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um filme por ID' })
  @ApiResponse({ status: 200, description: 'Retorna o filme encontrado' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um filme' })
  @ApiResponse({ status: 200, description: 'O filme foi atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um filme' })
  @ApiResponse({ status: 200, description: 'O filme foi deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
} 