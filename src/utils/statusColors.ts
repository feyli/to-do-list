import { StatusEnum } from '../types/StatusEnum';

export const statusColors: Record<StatusEnum, string> = {
    [StatusEnum.NEW]: '#3B82F6',
    [StatusEnum.IN_PROGRESS]: '#EAB308',
    [StatusEnum.WAITING]: '#F97316',
    [StatusEnum.SUCCEEDED]: '#22C55E',
    [StatusEnum.ABANDONED]: '#6B7280',
};

export const statusLabels: Record<StatusEnum, string> = {
    [StatusEnum.NEW]: 'New',
    [StatusEnum.IN_PROGRESS]: 'In progress',
    [StatusEnum.WAITING]: 'Waiting',
    [StatusEnum.SUCCEEDED]: 'Succeeded',
    [StatusEnum.ABANDONED]: 'Abandoned',
};
