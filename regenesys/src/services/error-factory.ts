const convert = require('xml-js');
const message = require('../../message.json');
export class ErrorFactory {
    public databaseError = (err?: any) => {
        if (err) {
            if (err.code && err.statusCode && err.message) {
                return err;
            }
            if (err.errors) {
                return {
                    code: 'INTERNAL_SERVER_ERROR',
                    statusCode: 500,
                    message: err.errors.map((e: any) => e.message)
                };
            }
            if (err.message) {
                return { code: 'INTERNAL_SERVER_ERROR', statusCode: 500, message: err.message };
            }
            return { code: 'INTERNAL_SERVER_ERROR', statusCode: 500, message: 'internal server error' };
        }
        return { code: 'INTERNAL_SERVER_ERROR', statusCode: 500, message: 'internal server error' };
    };

    public unauthorizedRequest = (code: any = '', err?: any) => {
        if (err && err.code && err.statusCode && err.message) {
            return err;
        }
        return {
            code: 'UNAUTHORIZED_REQUEST',
            statusCode: 401,
            message: message.UNAUTHORIZED[code] || message.UNAUTHORIZED.DEFAULT
        };
    };
    public merchantAuthorizedError = (code: string) => ({
        code,
        statusCode: 401,
        message: message.MERCHANTAUTHORIZEDERROR[code] || code
    });
    public invalidRequest = (code: string) => ({
        code: 'INVALID_REQUEST',
        statusCode: 400,
        message: message.BAD_REQUEST[code] || code
    });
    public invalidParameter = (msg: any) => ({
        code: 'INVALID_PARAMETERS',
        statusCode: 422,
        message: msg
    });
    public notFoundData = (code: any) => ({
        code: 'INVALID_REQUEST',
        statusCode: 404,
        message: message.NOT_FOUND[code] || code
    });
    public getErrorMessage = (code: string) => message[code] || message.DEFAULT;
    public alreadyExist = (code: any, isConflictCode = false) => ({
        code: isConflictCode ? 'CONFLICT' : 'ALREADY_EXIST',
        statusCode: 409,
        message: message.CONFLICT[code] || code
    });
    public internalServerError = () => ({
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        message: message.INTERNAL_SERVER_ERROR
    });
    public forbidden = (code: any) => ({
        code: 'INVALID_REQUEST',
        statusCode: 403,
        message: message.FORBIDDEN[code] || code
    });

    public convertResponse = (contentType: string, msg: any) => {
        const convertedMsg: any = {
            'text/xml': () => convert.json2xml(msg, { compact: true }),
            'application/xml': () => convert.json2xml(msg, { compact: true }),
            'application/json': () => msg,
            default: () => msg
        };

        return (convertedMsg[contentType] || convertedMsg.default)();
    };
}
