import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
	@ApiProperty()
	@IsOptional()
	@IsString()
	@MinLength(1)
	title: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@MinLength(1)
	description: string;
}
