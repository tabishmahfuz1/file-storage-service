import mongoose, { Schema, model, Document } from 'mongoose';
import { IUser } from './interfaces/User';


export interface IUserModel extends IUser, Document {

}

const JobSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    }
});

export const UserModel = model<IUserModel>('User', JobSchema);
