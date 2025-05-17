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
  @Column({ type: 'uuid', name: 'batch_id' })
  batchId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'selected_languages' })
  selectedLanguages: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.QUEUED,
    name: 'status',
  })
  status: TranslationStatus;

  @Column({ name: 'credits_used' })
  creditsUsed: number;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({
    name: 'deletion_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletionDate: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
