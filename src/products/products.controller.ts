import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/types/express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('MERCHANT', 'ADMIN')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Product with Image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'iPhone 15' },
        price: { type: 'number', example: 1200 },
        quantity: { type: 'number' },
        listingType: {
          type: 'string',
          enum: ['ECOMMERCE', 'BROKERAGE', 'SERVICE'],
          example: 'ECOMMERCE',
        },
        subCategoryId: { type: 'string' },
        description: { type: 'string', example: 'A premium Apple smartphone' },
        attributes: {
          type: 'object',
          example: { color: 'black', storage: '128GB' },
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const imageUrls = files
      ? await this.cloudinaryService.uploadImage(files)
      : undefined;

    return this.productsService.create(
      { ...createProductDto, imageUrls } as CreateProductDto,
      req.user.userId,
    );
  }
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MERCHANT')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Product with Image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'string' },
        listingType: {
          type: 'string',
          enum: ['ECOMMERCE', 'BROKERAGE', 'SERVICE'],
        },
        subCategoryId: { type: 'string' },
        description: { type: 'string' },
        attributes: { type: 'object' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const imageUrls = files
      ? await this.cloudinaryService.uploadImage(files)
      : undefined;

    return this.productsService.update(id, {
      ...updateProductDto,
      imageUrls,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
