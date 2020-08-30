import { exists, mkdir } from "fs"

export const ensureDir = dir => {
    return new Promise((resolve, reject) => {
        exists(dir, dirExists => {
            if (dirExists) return resolve(false);
            mkdir(dir, { recursive: true }, (err) => {
                if ( err ) return reject(err);
                return resolve(true);
            })
        })
    })
}