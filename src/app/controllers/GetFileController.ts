import Controller from "./Controller";
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IFileRepository } from "../database/repositories/FileRepository";
import { IStorage } from "../providers/Storage";

@injectable()
export class GetFileController extends Controller {
    
    constructor(
        @inject(TYPES.FileRepository) private _fileRepo: IFileRepository,
        @inject(TYPES.Storage) private _storage: IStorage
    ){
        super();
    }

    async handle({ params: { id } }: any): Promise<any> {
        const { path, name } =  await this._fileRepo.findById(id);
        const file = await this._storage.get(path);

        this.res.setHeader('Content-Disposition', 'attachment; filename=' + name);
        this.res.setHeader('Content-Transfer-Encoding', 'binary');
        // this.res.setHeader('Content-Type', 'application/octet-stream');
        this.res.send(file);
        this.responseSent = true;
    }

}