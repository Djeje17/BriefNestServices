import { Post } from "../../posts/entities/post.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Exclude() // Empêche l'affichage dans le JSON
  @Column({ select: false }) // Empêche l'affichage dans les requêtes SQL par défaut
  password: string;

  @OneToMany(() => Post, (post) => post.user, { cascade: true, eager: true })
  post: Post[];
}