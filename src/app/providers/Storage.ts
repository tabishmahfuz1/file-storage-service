import { inject, injectable } from "inversify";
import { writeFile, readFile, existsSync, mkdirSync, exists, mkdir } from "fs";
import { join, resolve, dirname } from "path";
import { ensureDir } from "./Helpers";
import { TYPES } from "../types";
import { Logger } from "../Log";

export interface IStorage {
    put(data: any, path: string): Promise<string>;
    get(path: string): Promise<Buffer>;
}

@injectable()
export class LocalDiskStorage implements IStorage {
    basePath: string;

    constructor(
        @inject(TYPES.Logger) private _logger: Logger
    ) {
        this.basePath = join(__dirname, '../../../storage/');
        ensureDir(this.basePath)
        .then( created =>  
            created && this._logger.debug("LocalDiskStorage::Created Directory", this.basePath));
    }

    /**
     * Store a file to Local Disk Storage
     * @param data File Data
     * @param path Path for the file
     * @returns Path for the file
     */
    put(data: any, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const fullPath = join(this.basePath, path);
            const dir = dirname(fullPath);

            this._logger.debug("Directory to upload", dir)

            ensureDir(dir)
            .then(created => {
                created && this._logger.debug("LocalDiskStorage::Created Directory", fullPath);
                writeFile(fullPath, data, (err) => {
                    err && reject(err);
    
                    resolve(path);
                })
            })
        })
    }

    /**
     * Get a file from the Local Disk Storage
     * @param path Path of the file
     */
    get(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(join(this.basePath, path), (err, data) => {
                err && reject(err);

                resolve(data);
            });
        });
    }

}