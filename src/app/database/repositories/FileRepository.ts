import { BaseRepository, FieldSelection } from "./BaseRepository";
import { IFile } from "../models/interfaces/File";
import { IFileModel, FileModel } from "../models/File";
import { injectable } from "inversify";

export interface IFileRepository extends BaseRepository<IFile, IFileModel>{
    findByLabels(labels: string[]): Promise<IFileModel[]>;
}

@injectable()
export class MongooseFileRepository implements IFileRepository {
    
    create(data: IFile): Promise<IFileModel> {
        return FileModel.create(data);
    }
    findById(id: string, fields?: FieldSelection): Promise<IFileModel> {
        return FileModel.findById(id, fields).exec();
    }
    findOne(filters?: any, fields?: FieldSelection): Promise<IFileModel> {
        return FileModel.findOne(filters).exec();
    }

    /**
     * Returns array of File Documents matched 
     * by one or more of the labels provided 
     * @param labels Array of labels to match
     * @returns Array of FileModel Documents matched by labels
     */
    findByLabels(labels: string[]): Promise<IFileModel[]> {
        return FileModel.find({ labels: { $all: labels } }).exec();
        // return FileModel.find({ labels: { $in: labels } }).exec();
    }

    find(filters?: any, fields?: any, populateRelations?: boolean): Promise<IFileModel[]> {
        const { labels } = filters;
        if(labels) filters.labels = { $all: labels };
        // console.log(filters)
        return FileModel.find(filters).exec();
    }
    delete(id: string): Promise<IFileModel> {
        throw new Error("Method not implemented.");
    }
    deleteMany(filters: any): Promise<Number> {
        throw new Error("Method not implemented.");
    }
}