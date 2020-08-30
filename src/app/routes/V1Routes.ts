import Routes, { IControllerRoute } from './Routes'
import { container } from '../inversify.config'
import { injectable } from 'inversify'
import { FileUploadController, FileUploadMiddleware } from '../controllers/FileUploadController';
import { SearchFilesController } from '../controllers/SearchFilesController';
import { GetFileController } from '../controllers/GetFileController';

@injectable()
export default class V1Routes extends Routes {

    /**
	 * IMPORTANT: User the '/' prefix before the path name
	 * to avoid the 404 Error
	 */
    basePath(): string {
        return '/v1'
    }

    /**
	 * IMPORTANT: User the '/' prefix before the path name
	 * to avoid the 404 Error
	 */
    controllers(): IControllerRoute[]  {
        return [{
            path: '/upload',
            controller: container.get(FileUploadController),
            method: 'post',
            middlewares: [(container.get(FileUploadMiddleware)).handle]
        },{
            path: '/search',
            controller: container.get(SearchFilesController),
            method: 'post',
        },{
            path: '/get/:id',
            controller: container.get(GetFileController),
            method: 'get',
        }]
    }

}