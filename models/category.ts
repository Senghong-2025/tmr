export interface ICreateCategory {
    userId: string
    name: string
    type: string
    createdOn: string
}

export interface ICategory {
    id?: string
    userId: string
    name: string
    type: string
    createdOn: string
}
