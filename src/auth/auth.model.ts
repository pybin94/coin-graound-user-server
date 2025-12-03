export interface GoogleModel {
    email: string,
    name: string,
    picture: string,
    accessToken: string,
}

export interface NaverModel {
    provider: string,
    snsId: string,
    email: {
        value: string;
    };
    nickname: string,
    profileImage: string,
}

export interface KakaoModel {
    kakaoId: string,
    nickname: string,
    email: string,
    accessToken: string,
}