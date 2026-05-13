import { IsString, MinLength, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255) // Nécessaire pour le test n°6
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number; // Nécessaire pour lier le post à l'user
}