import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
	title: string;

    @ApiProperty()
	@IsString()
	@MinLength(1)
	description: string;


}

