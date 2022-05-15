import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/user';

export class UserSeed1652603387591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<User>(User, {
        username: 'admin',
        name: 'Administrator',
        password: 'admin123',
      }),
    );
    // queryRunner.query(`INSERT INTO "user"(user_username,user_password,user_name) VALUES ($1,$2,$3)`, [
    //   'admin',
    //   'admin123',
    //   'Administrator',
    // ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM 'user' WHERE user_username='admin'`);
  }
}
