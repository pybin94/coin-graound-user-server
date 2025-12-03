import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "user_notice"})
export class UserNotice {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    title: string;

    @Column({ type: "text", nullable: true })
    content: string;

    @Column({ name: "extra_field", nullable: true })
    extraField: number;

    @Column({ name: "is_read", default: false })
    isRead: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}