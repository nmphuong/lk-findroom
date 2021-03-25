const jwt = require('jsonwebtoken')
const brcypt = require('bcryptjs')
// ----------------------------
const UserModel = require('../models/userModel')
const RoleModel = require('../models/roleModel')
// 
const Validation = require('../includes/validation')
const messageVI = require('../includes/message_vi')
// 
const Function = require('../includes/function')
// ----------------------------
const { DEFAULT_SECRECT_KEY, TOKEN_EXPIRED } = require('../includes/default')


exports.checkPhone = async (req, res) => {
  try {
    if (req.body.phone != undefined && req.body.phone != null && req.body.phone != '') {
      const phone = await UserModel.findOne({'phone': req.body.phone})
      if (phone) {
        return res.status(messageVI.mesagesCode.account_exists.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.account_exists.message, 
          success: true, 
          data: phone
        })
      } else {
        return res.status(messageVI.mesagesCode.phone_not_register.code).send({
          statusCode: res.statusCode,
          message:  messageVI.mesagesCode.phone_not_register.message, 
          success: true, 
          data: true
        })
      }
    } else {
      return res.status(messageVI.mesagesCode.please_enter_phone.code).send({
        statusCode: res.statusCode, 
        message: messageVI.mesagesCode.please_enter_phone.message, 
        success: false, 
        data: null
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false, data: null
    })
  }
}

exports.register = async (req, res) => {
  try {
    if (req.body.phone != undefined && req.body.phone != null && req.body.phone != '') {
      req.body.email = req.body.email.toLowerCase()
      const phone = await UserModel.findOne({'phone': req.body.phone})
      const email = await UserModel.findOne({'email': req.body.email})
      if (phone) {
        return res.status(messageVI.mesagesCode.phone_valid.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.phone_valid.message, 
          success: false, 
          data: null
        })
       } else if (email) {
        return res.status(messageVI.mesagesCode.email_valid.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.email_valid.message, 
          success: false, 
          data: null
        })
      } else {
        req.body.password = await brcypt.hashSync(req.body.password)
        const customer = await RoleModel.findOne({'role_name': req.body.role_name})
        req.body.roles = [customer._id]
        req.body = await Function.lowerCaseFunction(req.body)
        const user = await new UserModel(req.body).save()
        const dataUser = await UserModel.findById(user._id).populate('roles','role_name')
        return res.status(messageVI.mesagesCode.register_success.code).send({
          statusCode: res.statusCode,
          success: true, 
          mesage: messageVI.mesagesCode.register_success.mesage,
          data: dataUser
        })
      }
    } else {
      return res.status(messageVI.mesagesCode.please_enter_phone.code).send({
        statusCode: res.statusCode, 
        message: messageVI.mesagesCode.please_enter_phone.message, 
        success: false, 
        data: null
      })
    }
  } catch (err) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ phone: req.body.phone }).populate('roles','role_name');
    if (user) {
      const isEqual = await brcypt.compare(req.body.password, user.password)
      if (isEqual) {
        const token = jwt.sign({ userId: user.id, phone: user.phone }, DEFAULT_SECRECT_KEY, {expiresIn: TOKEN_EXPIRED})
        return res.status(messageVI.mesagesCode.login_success.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.login_success.message,
          success: true,
          data: {
            ...user._doc,
            token: token
          }
        })
      } else {
        return res.status(messageVI.mesagesCode.password_incorect.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.password_incorect.message,
          success: false,
          data: null
        })
      }
    }
    return res.status(messageVI.mesagesCode.phone_not_register_in_login.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.phone_not_register_in_login.message,
      success: false,
      data: null
    })
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.profile = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.headers.authorization, DEFAULT_SECRECT_KEY)
    if (decodedToken) {
      const user = await UserModel.findById(decodedToken.userId).populate('roles')
      return res.status(messageVI.mesagesCode.profile_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.profile_success.message,
        success: true,
        data: user
      })
    } else {
      return res.status(messageVI.mesagesCode.please_login.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.please_login.message,
        success: false,
        data: null
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.updateRole = async (req, res) => {
  try {
    if (req.headers.authorization == null || req.headers.authorization == undefined || req.headers.authorization == '') {
      return res.status(messageVI.mesagesCode.please_login.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.please_login.message,
        success: false,
        data: null
      })
    }
    const decodedToken = jwt.verify(req.headers.authorization, DEFAULT_SECRECT_KEY)
    if (decodedToken) {
      const role = await RoleModel.findOne({'role_name': req.body.role_name})
      if (role) {
        const user = await UserModel.findByIdAndUpdate(decodedToken.userId, {
          roles: role.id
        }, {
          new: true
        })
        return res.status(messageVI.mesagesCode.update_role_success.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.update_role_success.message,
          success: true,
          data: user
        })
      } else {
        return res.status(messageVI.mesagesCode.not_found_role.code).send({
          statusCode: res.statusCode,
          message: messageVI.mesagesCode.not_found_role.message,
          success: false,
          data: null
        })
      }
    } else {
      return res.status(messageVI.mesagesCode.please_login.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.please_login.message,
        success: false,
        data: null
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    if (req.headers.authorization == null || req.headers.authorization == undefined || req.headers.authorization == '') {
      return res.status(messageVI.mesagesCode.please_login.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.please_login.message,
        success: false,
        data: null
      })
    }
    req.body = await Function.lowerCaseFunction(req.body)
    const decodedToken = jwt.verify(req.headers.authorization, DEFAULT_SECRECT_KEY)
    if (decodedToken) {
      if (req.body.password != '' && req.body.password != null && req.body.password != undefined) {
        req.body.password = await brcypt.hashSync(req.body.password)
      }
      const user = await UserModel.findByIdAndUpdate(decodedToken.userId, {
        ...req.body
      }, {
        new: true
      })
      return res.status(messageVI.mesagesCode.update_profile_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.update_profile_success.message,
        success: true,
        data: user
      })
    }
    return res.status(messageVI.mesagesCode.please_login.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.please_login.message,
      success: false,
      data: null
    })
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.usersAdmin = async (req, res) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'usersAdmin'
    )
    if (code === 200) {
      const users = await UserModel.find().populate('roles')
      return res.status(messageVI.mesagesCode.user_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.user_success.message,
        success: true,
        data: users
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.userAdmin = async (req, res) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'userAdmin'
    )
    if (code === 200) {
      const user = await UserModel.findById(req.params.id)
      return res.status(messageVI.mesagesCode.user_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.user_success.message,
        success: true,
        data: user
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.deleteUserAdmin = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'deleteUserAdmin'
    )
    if (code === 200) {
      const user = await UserModel.findByIdAndDelete(req.params.id)
      return res.status(messageVI.mesagesCode.delete_user_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.delete_user_success.message,
        data: user
      })
    } else {
      return res.status(401).send({
        statusCode: res.statusCode,
        success: false,
        message: messageVI.mesagesCode.unauthenticate.message,
        data: []
      })
    }
  } catch (e) {
    return res.status(500).send({
      statusCode: res.statusCode,
      success: false,
      message: messageVI.mesagesCode.server_error.message,
      data: []
    })
  }
}

exports.updateUserAdmin = async (req, res) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'updateUserAdmin'
    )
    if (code === 200) {
      console.log(req.params.id)
      const user = await UserModel.findByIdAndUpdate(req.params.id, {
        ...req.body
      }, {
        new: true
      })
      return res.status(messageVI.mesagesCode.user_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.user_success.message,
        success: true,
        data: user
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}

exports.activeAdmin = async (req, res) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'activeAdmin'
    )
    if (code === 200) {
      console.log(req.params.id)
      const user = await UserModel.update({
        verify: false
      }, {
        $set: {
          verify: true,
        }
      }, {
          multi: true
      })
      return res.status(messageVI.mesagesCode.user_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.user_success.message,
        success: true,
        data: []
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      message: messageVI.mesagesCode.server_error.message,
      success: false,
      data: null
    })
  }
}
