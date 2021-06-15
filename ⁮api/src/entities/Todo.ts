import { User } from './User';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	text: string;

	@Column('boolean', { default: false })
	completed: boolean;

	@Column()
	creatorId: number;

	@ManyToOne(() => User, (u) => u.todos)
	@JoinColumn({ name: 'creatorId' })
	creator: Promise<User>;
}
