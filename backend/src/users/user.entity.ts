import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  myname: string;

  @Column()
  myposition: string;

  @Column()
  picture: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' }) 
  role: Role;

  @Column({ type: 'timestamp' })
  create_datetime: Date;

  @Column({ type: 'timestamp' })
  update_datetime: Date;

  @Column()
  create_by: string;

  @Column()
  update_by: string;
}
