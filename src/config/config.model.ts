export interface ResponseFormat {
    statusCode: ResponseStatus;
    data: unknown;
    message: string;
}

export enum ResponseStatus {
    ERROR = 0,
    SUCCESS = 1,
    CONFIRM = 2,
    DANGER = 3,
}