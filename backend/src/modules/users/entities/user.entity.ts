import { Post } from "../../posts/entities/post.entity";
import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,

}from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    name: string;

    @Column({unique: true, length: 150})
    email: string;

    @Column({select: false})
    password: string;

    @OneToMany(() => Post, (post) => post.user, { cascade: true, eager: true })
  post: Post[];
    
}
