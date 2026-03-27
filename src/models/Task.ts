import { StatusEnum } from '../types/StatusEnum';

export interface Task {
    name: string;
    description: string;
    creationDate: Date;
    deadlineDate: Date;
    status: StatusEnum;
    coworkerList: string[];
}

export const createTache = (
    name: string,
    deadlineDate: Date,
    description: string = '',
    status: StatusEnum = StatusEnum.A_FAIRE,
    coworkerDate: string[] = []
): Task => {
    if (name.length < 5) {
        throw new Error('L\'intitulé doit contenir au moins 5 caractères');
    }

    return {
        name: name,
        description,
        creationDate: new Date(),
        deadlineDate: deadlineDate,
        status: status,
        coworkerList: coworkerDate
    };
};
