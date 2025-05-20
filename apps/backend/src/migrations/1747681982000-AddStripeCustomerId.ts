import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeCustomerId1747681982000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "stripeCustomerId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "stripeCustomerId"`,
    );
  }
}
