
/*
    to be used for custom error handling only
*/
module.exports = function asyncMiddleware(handler) {

    return async (req, res, next) => {

        try {
            await handler();
        }
        catch (ex) {
            next(ex);
        }
    };
}