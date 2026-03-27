import { CouleurEnum } from '../types/CouleurEnum';
import { PictogrammeEnum } from '../types/PictogrammeEnum';

export interface Dossier {
    intitule: string;
    description: string;
    couleur: CouleurEnum;
    pictogramme?: PictogrammeEnum;
}

export const createDossier = (
    intitule: string,
    couleur: CouleurEnum,
    description: string = '',
    pictogramme?: PictogrammeEnum
): Dossier => {
    if (intitule.length < 3) {
        throw new Error('L\'intitulé doit contenir au moins 3 caractères');
    }

    return {
        intitule,
        description,
        couleur,
        pictogramme
    };
};
