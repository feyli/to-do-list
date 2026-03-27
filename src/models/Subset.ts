import { ColorEnum } from '../types/ColorEnum';
import { IconEnum } from '../types/IconEnum';

export interface Subset {
    name: string;
    description: string;
    color: ColorEnum;
    icon?: IconEnum;
}

export const createDossier = (
    name: string,
    color: ColorEnum,
    description: string = '',
    icon?: IconEnum
): Subset => {
    if (name.length < 3) {
        throw new Error('L\'intitulé doit contenir au moins 3 caractères');
    }

    return {
        name: name,
        description,
        color: color,
        icon: icon
    };
};
