export interface APITokens {
    access: string,
    refresh: string,
}

export interface Play {
    id: number;
    ended: boolean;
    time: string;
    student: string;
    game: number | string;
}

export interface Game {
    id: number,
    plays: number | Play[],
    name: string,
    show: boolean,
    start_time: string,
    image: string,
    needsUpdate: boolean,
}


export interface Student {
    id: string,
    name: string,
    played_today: number,
    weekly_plays: number,
    sanctions_number: number,
    forgoten_id: boolean,
}

export interface User {
    id: number,
    email: string,
    is_admin: boolean,
    theme: string,
    is_active: boolean,
}

export interface Sanction {
    id: number,
    cause: string,
    start_time: string,
    end_time: string,
    play: number,
    student: string,
}

export interface Log {
    line: number,
    timestamp: string,
    user: string,
    action: string,
}

export interface Image {
    id: number,
    image: string,
}

export interface ApiResponse<T> {
    data: T[]
    status: number
}

export interface ApiResponseSingle<T> {
    data: T
    status: number
}

export interface PlayResponse {
    detail: string
    status: number
}

export interface EndPlayResponse {
    id: number,
    plays: Play[],
    name: string,
    show: boolean,
    start_time: string,
    image: string,
}