const jwt = require('jsonwebtoken')
const { DEFAULT_SECRECT_KEY } = require('../includes/default')

const UserModel = require('../models/userModel')

class Authorization {
    constructor () {
        this.userId = 0
    }

    async authorize(req,  cap ) {
        try {
            if (req.headers.authorization == null || req.headers.authorization == undefined || req.headers.authorization == '') {
                return false
            } else {
                const decodedToken = jwt.verify(req.headers.authorization, DEFAULT_SECRECT_KEY)
                const user = await UserModel.findById(decodedToken.userId).populate('roles')
                this.userId = await decodedToken.userId
                if ( user.roles.capabilities.indexOf(cap) !== -1 ) {
                    return true
                }
                // for ( let role of users.roles ) {
                //     if ( role.capabilities.indexOf(cap) !== -1 ) {
                //         return true
                //     }
                // }
            }
        }
        catch(e) {
            return false
        }

        return false
    }
}

module.exports =  new Authorization()