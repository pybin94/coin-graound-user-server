import { ResponseFormat, ResponseStatus } from "./config.model";
import { nowDate } from "./tools.config";

export const log = ({
    title, 
    description
}: {
    title: string, 
    description: any
}): void => {
    console.log(`${nowDate()} | [LOG] |TITLE: ${title} | DESCRIPTION: ${description}`)
}

export const handleSend = ({
    data = [], 
    description = "Success", 
    statusCode = 1
}: {
    data?: unknown;
    description?: string;
    statusCode?: ResponseStatus;
}): ResponseFormat => {
    return { statusCode, data, message: description }
}

export const handleError = ({
    title, 
    error, 
    description = "오류! 관리자에게 문의하세요", 
    statusCode = 0,
    data,
}: {
    title: string, 
    error: any, 
    description?: string, 
    statusCode?: ResponseStatus,
    data?: any,
}): ResponseFormat => {
    console.log(`${nowDate()} | [ERROR] | TITLE: ${title} | description: ${description} | error: ${error}`)
    return { statusCode, data, message: description }
}

export const dateFormat = (utcDate: Date): Date => {
    const timeOffset = 9 * 60; 
    const localTimeOffset = new Date(utcDate).getTime() + timeOffset * 60 * 1000;
  
    return new Date(localTimeOffset);
}