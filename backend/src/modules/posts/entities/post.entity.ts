import { User} from "../../users/entities/user.entity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';

    @Entity('posts')
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	title: string;

	@Column({ type: 'text' })
	descritption: string;

    @ManyToOne(() => User, (user) => user.post)
  user: User;

}
