import { IconType } from 'react-icons';
import { FiActivity, FiAlertCircle, FiBookmark, FiBriefcase, FiFolder, FiHeart, FiHome, FiShoppingCart, FiStar, FiUser } from 'react-icons/fi';
import { IconEnum } from '../types/IconEnum';

export const iconComponentMap: Record<IconEnum, IconType> = {
    [IconEnum.STAR]: FiStar,
    [IconEnum.HEART]: FiHeart,
    [IconEnum.HOME]: FiHome,
    [IconEnum.WORK]: FiBriefcase,
    [IconEnum.URGENT]: FiAlertCircle,
    [IconEnum.IMPORTANT]: FiBookmark,
    [IconEnum.PROJECT]: FiFolder,
    [IconEnum.PERSONAL]: FiUser,
    [IconEnum.HEALTH]: FiActivity,
    [IconEnum.SHOPPING]: FiShoppingCart,
};
