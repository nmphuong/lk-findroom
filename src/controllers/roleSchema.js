const RoleModel = require('../models/roleModel')
// 
const Validation = require('../includes/validation')
// 
const messageVI = require('../includes/message_vi')

exports.addRole = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'addRole'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      const role = await new RoleModel({
        ...req.body
      }).save();
      return res.status(messageVI.mesagesCode.add_role_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.add_role_success.message,
        data: role
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      success:false,
      message: messageVI.mesagesCode.server_error.message,
      data: []
    })
  }
}

exports.addCapabilities = async (req, res, next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'addCapabilities'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      const findRole = await RoleModel.findById(req.params.id)
      var capability = findRole.capabilities
      capability.push(req.body.capability)
      const role = await RoleModel.findByIdAndUpdate(req.params.id, {
        capabilities: capability
      }, {
        new: true
      })
      return res.status(messageVI.mesagesCode.add_capabilities_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.add_capabilities_success.message,
        data: role
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
      success:false,
      message: messageVI.mesagesCode.server_error.message,
      data: []
    })
  }
}

exports.roles = async (req, res, next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'roles'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      const role = await RoleModel.find()
      return res.status(messageVI.mesagesCode.roles_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.roles_success.message,
        data: role
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      success:false,
      message: messageVI.mesagesCode.server_error.message,
      data: []
    })
  }
}

exports.role = async (req, res, next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'role'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      const role = await RoleModel.findById(req.params.id)
      return res.status(messageVI.mesagesCode.role_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.role_success.message,
        data: role
      })
    }
  } catch (e) {
    return res.status(messageVI.mesagesCode.server_error.code).send({
      statusCode: res.statusCode,
      success:false,
      message: messageVI.mesagesCode.server_error.message,
      data: []
    })
  }
}
