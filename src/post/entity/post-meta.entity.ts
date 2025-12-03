import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { Board } from "src/board/entity/board.entity";

@Entity({ name: "post_meta" })
export class PostMeta {
    @PrimaryGeneratedColumn()
    id: number;
        
    @ManyToOne(type => Board, board => board.id, {onDelete: "CASCADE",})
    @JoinColumn({ name: "board_id" })
    board: Board;
    
    @ManyToOne(type => Post, post => post.id, {onDelete: "CASCADE",})
    @JoinColumn({ name: "post_id" })
    post: Post;

    @Column()
    type: string;

    @Column()
    value: string;
    
    @Column({ type: 'integer' })
    priority: number;
}