export interface APITokens {
    access: string,
    refresh: string,
}

export interface Notice {
    id: number,
    cause: string,
    play: number,
    student: string,
    created_at: string,
}

export interface Material {
    id: number;
    name: string;
    amount: number;
    description?: string;
}

export interface OwedMaterial {
    id: number,
    material: number,
    material_name: string,
    amount: number,
    delivered: number,
    student: string,
    delivery_deadline?: string,
    updated_at: string,
    created_at: string,
}

export interface PlaysPagination {
    count: number,
    num_pages: number,
    page_size: number,
}

export interface Play {
    id: number;
    ended: boolean;
    time: string;
    student: string;
    game: number | string;
    notices: Notice[];
    owed_materials: OwedMaterial[];
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