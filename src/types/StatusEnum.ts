export enum StatusEnum {
    NEW = "New",
    IN_PROGRESS = "In progress",
    WAITING = "Waiting",
    SUCCEEDED = "Succeeded",
    ABANDONED = "Abandoned"
}

export const DONE_STATUSES: StatusEnum[] = [StatusEnum.SUCCEEDED, StatusEnum.ABANDONED];
