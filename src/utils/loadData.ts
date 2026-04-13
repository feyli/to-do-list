import { Subset, Task } from '../models';
import { Relation } from '../types/Relation';
import { StatusEnum } from '../types/StatusEnum';
import { ColorEnum } from '../types/ColorEnum';
import { IconEnum } from '../types/IconEnum';

export interface AppData {
    tasks: Task[];
    subsets: Subset[];
    relations: Relation[];
}

const statusMap: Record<string, StatusEnum> = {
    'New': StatusEnum.NEW,
    'In progress': StatusEnum.IN_PROGRESS,
    'Waiting': StatusEnum.WAITING,
    'Succeeded': StatusEnum.SUCCEEDED,
    'Abandoned': StatusEnum.ABANDONED,
};

const colorMap: Record<string, ColorEnum> = {
    '#EF4444': ColorEnum.RED,
    '#F97316': ColorEnum.ORANGE,
    '#EAB308': ColorEnum.YELLOW,
    '#22C55E': ColorEnum.GREEN,
    '#3B82F6': ColorEnum.BLUE,
    '#6366F1': ColorEnum.INDIGO,
    '#A855F7': ColorEnum.PURPLE,
    '#EC4899': ColorEnum.PINK,
    '#6B7280': ColorEnum.GRAY,
    '#92400E': ColorEnum.BROWN,
};

const iconMap: Record<string, IconEnum> = {
    'star': IconEnum.STAR,
    'heart': IconEnum.HEART,
    'home': IconEnum.HOME,
    'briefcase': IconEnum.WORK,
    'alert-circle': IconEnum.URGENT,
    'bookmark': IconEnum.IMPORTANT,
    'folder': IconEnum.PROJECT,
    'user': IconEnum.PERSONAL,
    'activity': IconEnum.HEALTH,
    'shopping-cart': IconEnum.SHOPPING,
};

export const loadData = async (): Promise<AppData> => {
    const response = await fetch('/data/data.json');
    const json = await response.json();

    const tasks: Task[] = json.tasks.map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        creationDate: new Date(t.creationDate),
        deadlineDate: new Date(t.deadlineDate),
        status: statusMap[t.status] || StatusEnum.NEW,
        coworkerList: t.coworkerList || [],
    }));

    const subsets: Subset[] = json.subsets.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        color: colorMap[s.color] || ColorEnum.GRAY,
        icon: s.icon ? iconMap[s.icon] : undefined,
    }));

    const relations: Relation[] = json.relations.map((r: any) => ({
        taskId: r.taskId,
        subsetId: r.subsetId,
    }));

    return {tasks, subsets, relations};
};
