import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

    @Entity('posts')
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	title: string;

	@Column({ type: 'text' })
	descritption: string;

}
