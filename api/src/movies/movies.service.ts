import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.filme.create({
      data: createMovieDto,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'titulo',
    order: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      this.prisma.filme.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),
      this.prisma.filme.count(),
    ]);

    return {
      data: movies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const movie = await this.prisma.filme.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    try {
      return await this.prisma.filme.update({
        where: { id },
        data: updateMovieDto,
      });
    } catch (error) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.filme.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }
  }

  async searchByTitle(titulo: string) {
    return this.prisma.filme.findMany({
      where: {
        titulo: {
          contains: titulo,
          mode: 'insensitive',
        },
      },
    });
  }

  async searchByActor(ator: string) {
    return this.prisma.filme.findMany({
      where: {
        elenco: {
          has: ator,
        },
      },
    });
  }
} 