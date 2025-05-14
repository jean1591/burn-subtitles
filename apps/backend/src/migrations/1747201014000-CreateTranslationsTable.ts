import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTranslationsTable1747201014000
  implements MigrationInterface
{
  name = 'CreateTranslationsTable1747201014000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for status
    await queryRunner.query(`
            CREATE TYPE translation_status AS ENUM ('queued', 'in_progress', 'done', 'error');
        `);

    // Create translations table
    await queryRunner.query(`
            CREATE TABLE translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                batch_id UUID NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                selected_languages TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                status translation_status NOT NULL DEFAULT 'queued',
                credits_used INTEGER NOT NULL,
                user_id UUID NOT NULL,
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );
        `);

    // Create indexes
    await queryRunner.query(`
            CREATE INDEX idx_translations_batch_id ON translations(batch_id);
            CREATE INDEX idx_translations_user_id ON translations(user_id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
            DROP INDEX IF EXISTS idx_translations_batch_id;
            DROP INDEX IF EXISTS idx_translations_user_id;
        `);

    // Drop table
    await queryRunner.query(`
            DROP TABLE IF EXISTS translations;
        `);

    // Drop enum type
    await queryRunner.query(`
            DROP TYPE IF EXISTS translation_status;
        `);
  }
}
