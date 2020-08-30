import mongoose, { Schema, model, Document } from 'mongoose';
import { IFile } from './interfaces/File';

export interface IFileModel extends IFile, Document {

}

const FileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    labels: [String],
    extension: String,
    mimetype: String,
    directory: String
});

export const FileModel = model<IFileModel>('File', FileSchema);
