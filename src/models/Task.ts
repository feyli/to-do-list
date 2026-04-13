import { StatusEnum } from '../types/StatusEnum';

export interface Task {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    deadlineDate: Date;
    status: StatusEnum;
    coworkerList: string[];
}

export const createTask = (
    id: number,
    name: string,
    deadlineDate: Date,
    description: string = '',
    status: StatusEnum = StatusEnum.NEW,
    coworkerList: string[] = []
): Task => {
    if (name.length < 5) {
        throw new Error('Name must be at least 5 characters long');
    }

    return {
        id,
        name,
        description,
        creationDate: new Date(),
        deadlineDate,
        status,
        coworkerList
    };
};
