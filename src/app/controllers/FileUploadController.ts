import Controller, { ApiError } from "./Controller";
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IFileRepository } from "../database/repositories/FileRepository";
import multer from 'multer';
import Config from "../providers/config/Config";
import { join, sep } from "path";
import { IStorage } from "../providers/Storage";
import { unlink, readFile, exists } from "fs";
import { ensureDir } from "../providers/Helpers";
import { Logger } from "../Log";

@injectable()
export class FileUploadController extends Controller {

    constructor(
        @inject(TYPES.FileRepository) private fileRep: IFileRepository,
        @inject(TYPES.Storage) private _storage: IStorage,
        @inject(TYPES.Config) private _config: Config,
    ){
        super();
    }

    async handle(req: any): Promise<any> {
        if ( !req.file ) {
            throw new ApiError("MISSING_FILE", "Missing file to upload");
        }

        this.logger.debug("FILE UPLOADED", req.file);

        const fname: string = req.body.name || req.file.originalname;
        const extension = req.body.extension || fname.split('.').reverse()[0];
        
        const fileDoc = { 
            name: req.body.name || req.file.originalname,
            extension,
            directory: req.body.directory || '',
            mimetype: req.body.mimetype || req.file.mimetype,
            labels: JSON.parse(req.body.labels)
        };

        const res = this.readFileFromPath(req.file.path)
        .then(file => this._storage.put(file, `uploads/${req.body.directory || ''}${req.file.filename}`))
        .then(path => this.fileRep.create({ ...fileDoc, path }))
        
        this.deleteFileFromPath(req.file.path)
        .then(path => this.logger.debug("File deleted", path));

        return res;
    }

    
    async readFileFromPath(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(path, (err, data) => {
                if(err) return reject(err);
                resolve(data);
            });
        });
    }

    async deleteFileFromPath(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exists(path, is => {
                !is && unlink(path, (err) => {
                    if(err) return reject(err);
                    this.logger.debug("File Deleted", path)
                    resolve(path);
                });

                is && this.logger.debug("File doesn't exist", path);
            });
        });
    }
}

@injectable()
export class MulterStorage {
    tempPath: string;
    constructor(
        @inject(TYPES.Config) private _config: Config,
        @inject(TYPES.Logger) private _logger: Logger
    ) {
        this.tempPath = join(__dirname, '../../../', '/tmp/uploads');
        ensureDir(this.tempPath)
        .then(created => 
            created && this._logger.debug("FileUploadController::Created Directory", this.tempPath))
    }
    // var DIR = './uploads/';
    // const upload = multer({dest: DIR});
    getMiddlewareGenerator() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.tempPath)
            },
            filename: function (req, file, cb) {
                console.log(file, file.originalname,`${(new Date()).getTime()}-${file.originalname}`)
                cb(null, `${(new Date()).getTime()}-${file.originalname}`)
            }
        });
        
        return multer({ storage,
            onError : function(err, next) {
                console.error('error', err);
                next(err);
            } });
        // return upload.single('file');
    }
}

@injectable()
export class FileUploadMiddleware  {
    constructor(private multerStorage: MulterStorage) {}
    handle = this.multerStorage.getMiddlewareGenerator().single('file');
}