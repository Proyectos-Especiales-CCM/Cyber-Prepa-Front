export type player = {
     id: number;
     ended: boolean;
     time: Date;
     student: string;
     game: number;
}

export type game = {
     id: number;
     plays: player[] | number;
     name: string;
     show: boolean;
     start_time: Date;
     file_route: string;
}

export const template = {
     players_count: 0,
     players: []
};
   