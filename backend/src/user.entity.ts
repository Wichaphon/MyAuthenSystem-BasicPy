import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'timestamp' })
  create_datetime: Date;

  @Column({ type: 'timestamp' })
  update_datetime: Date;

  @Column()
  create_by: string;

  @Column()
  update_by: string;
}

export default User;
