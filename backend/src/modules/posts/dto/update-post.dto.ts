import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {

    @IsOptional()
	@IsString()
	@MinLength(1)
	title: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	description: string;
}
