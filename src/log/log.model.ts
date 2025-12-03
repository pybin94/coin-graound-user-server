export interface PointLog {
    from?: number;
    to: number;
    point: number;
    previousPoint: number | string,
    statusCode: number; // 1: 증가 2: 차감 3: 게임사 머니 이동 4: 게임사 머니 회수
    memo: string;
}

export enum PointMemo {
    POSTING = "게시글 작성",
    LIKEPOST = "게시글 추천",
    JOININ = "로그인",
    JOINUP = "회원가입",
    COMMENT = "댓글 작성",
    POINTPAYMENT = "포인트 선물",  // 시스템, 관리자, 유저 
    GAMEMOVE = "게임 포인트 이동",
    GAMERECOVERY = "게임 포인트 회수",
}

// 1: 증가 2: 차감 3: 게임사 머니 이동 4: 게임사 머니 회수
export enum PointStauts {
    INCREASE = 1,
    DECREASE = 2,
    GAMEMOVE = 3,
    GAMERECOVERY = 4,
}
