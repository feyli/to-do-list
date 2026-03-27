import { StatutEnum } from '../types/StatutEnum';

export interface Tache {
    intitule: string;
    description: string;
    dateCreation: Date;
    dateEcheance: Date;
    statut: StatutEnum;
    listeEquipiers: string[];
}

export const createTache = (
    intitule: string,
    dateEcheance: Date,
    description: string = '',
    statut: StatutEnum = StatutEnum.A_FAIRE,
    listeEquipiers: string[] = []
): Tache => {
    if (intitule.length < 5) {
        throw new Error('L\'intitulé doit contenir au moins 5 caractères');
    }

    return {
        intitule,
        description,
        dateCreation: new Date(),
        dateEcheance,
        statut,
        listeEquipiers
    };
};
