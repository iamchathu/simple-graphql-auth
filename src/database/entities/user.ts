import crypto from 'crypto';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string;

  @Column('varchar', { length: 30, name: 'user_username' })
  username!: string;

  @Column('varchar', { name: 'user_name' })
  name!: string;

  @Column('varchar', { name: 'user_password' })
  password!: string;

  @Column('varchar', { length: 100, name: 'user_salt' })
  salt!: string;

  @Column('varchar', { length: 100, nullable: true, name: 'user_refresh_token' })
  refreshToken?: string;

  @Column('bool', { default: true, name: 'user_is_active', comment: 'For deletion' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'user_created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'user_updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  beforeInsertData(): void {
    this.salt = crypto.randomBytes(64).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  hashPassword(password: string): string {
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 512, 'sha512').toString('base64');
  }

  public authenticate(password: string): boolean {
    return this.password === this.hashPassword(password);
  }
}
