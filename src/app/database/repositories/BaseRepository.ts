export interface FieldSelection {
    [field: string]: boolean
}

export interface BaseRepository<IT, ITM> {
    create(data: IT): Promise<ITM>;
    findById(id: string, fields?: FieldSelection): Promise<ITM>;
    findOne(filters?: any, fields?: FieldSelection): Promise<ITM>;
    find(filters?: any, fields?: any, populateRelations?:boolean): Promise<ITM[]>;
    delete(id: string): Promise<ITM>;
    deleteMany(filters: any): Promise<Number>;
}
