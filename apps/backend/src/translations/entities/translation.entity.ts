import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TranslationStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ERROR = 'error',
}

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  batchId: string;

  @Column()
  fileName: string;

  @Column()
  selectedLanguages: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.QUEUED,
  })
  status: TranslationStatus;

  @Column()
  creditsUsed: number;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;
}
