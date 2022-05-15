import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1652603350689 implements MigrationInterface {
  name = 'userTable1652603350689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_username" character varying(30) NOT NULL, "user_name" character varying NOT NULL, "user_password" character varying NOT NULL, "user_salt" character varying(100) NOT NULL, "user_refresh_token" character varying(100), "user_is_active" boolean NOT NULL DEFAULT true, "user_created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")); COMMENT ON COLUMN "user"."user_is_active" IS 'For deletion'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
