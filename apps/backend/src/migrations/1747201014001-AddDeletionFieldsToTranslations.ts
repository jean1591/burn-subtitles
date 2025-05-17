import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletionFieldsToTranslations1747201014001
  implements MigrationInterface
{
  name = 'AddDeletionFieldsToTranslations1747201014001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.query(`
      ALTER TABLE translations
      ADD COLUMN deletion_date TIMESTAMP WITH TIME ZONE,
      ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
    `);

    // Update existing records to set deletion_date to created_at + 7 days
    await queryRunner.query(`
      UPDATE translations
      SET deletion_date = created_at + INTERVAL '7 days'
      WHERE deletion_date IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE translations
      DROP COLUMN deletion_date,
      DROP COLUMN is_deleted;
    `);
  }
}
