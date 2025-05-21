import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChargeIdToPayments1747681993000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payments
      ADD COLUMN "chargeId" VARCHAR NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payments
      DROP COLUMN "chargeId";
    `);
  }
}
