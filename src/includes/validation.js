const Authorization = require('./authorization')

class Validation {
    constructor() {
        this.userId = 0;
    }
    async canDoAction ( req, cap,  args, validatedParams = [] ) {
        const auth = await Authorization.authorize(req, cap);
        this.userId = await Authorization.userId
        if ( auth == true ) {
        
            return 200;
        }
        return 401;
    };
}
module.exports = new Validation();
