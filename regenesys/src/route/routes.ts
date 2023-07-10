import { Users } from './users';
import { AuthenticateJWTToken } from '../middleware/authenticate-JWT-token';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');
const config: any = require('../../config');

export class Routes {
    public static setup(app: any) {
        // if (config.swagger.enable) {
        //     swaggerDocument.host = config.swagger.swaggerHost;
        //     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        // }

        app.use(`/api/v1/users`, AuthenticateJWTToken.authenticateAccount, Users.manageUsers);
    }
}
