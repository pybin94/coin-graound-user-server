export const nowDate = (date?: string) => {
    const nowDate = date ? new Date(date) : new Date()
    const setTimeZone = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)) // Asia/Seoul
    return setTimeZone.toISOString().slice(0, 19).replace('T', ' ');
}

export const dateFormat = (utcDate: Date | string): Date => {
    const timeOffset = 9 * 60; 
    const localTimeOffset = new Date(utcDate).getTime() + timeOffset * 60 * 1000;
    return new Date(localTimeOffset);
}

export const minuteCalculator = (date: string, setMinute: number) => {
    const dateTime = new Date(date).getTime();
    const fixTime = dateTime - (new Date(date).getTimezoneOffset() * 60000) + setMinute * 1000;
    return new Date(fixTime).toISOString().slice(0, 19).replace('T', ' ');
}

export const moneyFormat = (money: number | string) => {
    if(!money) return "0";
    
    let setMoney: number;
    let removeDecimal: number;

    if(typeof money === 'string'){
        setMoney = parseInt(money)
    } else if (typeof money === 'number'){
        setMoney = money
    }

    removeDecimal = Math.floor(setMoney)
    const format = removeDecimal.toLocaleString('ko-KR');
    return format;
}