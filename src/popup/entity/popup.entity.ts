import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "popup" })
export class Popup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "is_active", type: "smallint" })
  isActive: number;

  @Column({ name: "show_signin_only", type: "smallint" })
  showSigninOnly: number;

  @Column({ name: "is_auto", type: "smallint" })
  isAuto: number;

  @Column({ name: "position_x", type: "integer" })
  positionX: number;

  @Column({ name: "position_y", type: "integer" })
  positionY: number;

  @Column({ name: "position_z", type: "integer" })
  positionZ: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}