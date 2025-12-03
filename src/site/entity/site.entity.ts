import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "site" })
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "is_inspection", type: "smallint", default: 0, comment: '0: 비활성화, 1: 활성화' })
  isInspection: number;

  @Column({ name: "inspection_message", nullable: true, comment: '점검 문구' })
  inspectionMessage: string;

  @Column({ name: "spam_word", nullable: true })
  spamWord: string;

  @Column({ name: "posting_interval", type: "integer", default: 180, comment: "포스팅 간격"})
  postingInterval: number
}