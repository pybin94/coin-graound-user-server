import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "src/board/entity/board.entity";

@Entity({ name: "board_meta" })
export class BoardMeta {
    @PrimaryGeneratedColumn()
    id: number;
        
    @ManyToOne(type => Board, board => board.id, {onDelete: "CASCADE",})
    @JoinColumn({ name: "board_id" })
    board: Board;

    @Column({ type: "integer" })
    type: number;

    @Column()
    description: string;
}