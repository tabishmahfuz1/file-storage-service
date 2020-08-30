import Controller, { ApiError } from "./Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IFileRepository } from "../database/repositories/FileRepository";
import { IFileModel } from "../database/models/File";

@injectable()
export class SearchFilesController extends Controller {
    
    constructor(
        @inject(TYPES.FileRepository) private _fileRepo: IFileRepository
    ) {
        super();
    }

    handle(req: any): Promise<IFileModel[]> {
        // const { body: { labels, name, extension } } = req;
        return this._fileRepo.find(req.body);
    }

}