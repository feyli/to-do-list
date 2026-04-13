import { ColorEnum } from '../types/ColorEnum';
import { IconEnum } from '../types/IconEnum';

export interface Subset {
    id: number;
    name: string;
    description: string;
    color: ColorEnum;
    icon?: IconEnum;
}

export const createSubset = (
    id: number,
    name: string,
    color: ColorEnum,
    description: string = '',
    icon?: IconEnum
): Subset => {
    if (name.length < 3) {
        throw new Error('Name must be at least 3 characters long');
    }

    return {
        id,
        name,
        description,
        color,
        icon
    };
};
