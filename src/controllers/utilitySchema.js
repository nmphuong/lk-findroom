const UtilityModel = require('../models/utilityModel')
// 
const Validation = require('../includes/validation');
// 
const messageVI = require('../includes/message_vi')

exports.addUtility = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'addUtility'
    )
    if (code === 200) {
      const utility = await new UtilityModel({
        ...req.body
      }).save();
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message:"Tạo tiện ích thành công",
        data: utility
      })
    } else {
      return res.status(401).send({
        statusCode: res.statusCode,
        success:false,
        message:"Bạn không thể thực hiện hành động này",
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

exports.updateUtility = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'updateUtility'
    )
    if (code === 200) {
      const utilityExt = await UtilityModel.findById(req.params.id)
      if (!utilityExt || utilityExt.deleted_at != null) {
        return res.status(400).send({
          statusCode: res.statusCode,
          success: false,
          message:"Tiện ích không tồn tại",
          data: utility
        })
      }
      const utility = await UtilityModel.findByIdAndUpdate(req.params.id, {
        ...req.body
      }, {
        new: true
      })
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message:"Cập nhật tiện ích thành công",
        data: utility
      })
    } else {
      return res.status(401).send({
        statusCode: res.statusCode,
        success:false,
        message:"Bạn không thể thực hiện hành động này",
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

exports.deleteUtility = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'deleteUtility'
    )
    if (code === 200) {
      const utilityExt = await UtilityModel.findById(req.params.id)
      if (utilityExt == null || utilityExt == undefined || utilityExt.deleted_at != null) {
        return res.status(400).send({
          statusCode: res.statusCode,
          success: false,
          message:"Tiện ích không tồn tại",
          data: []
        })
      }
      const utility = await UtilityModel.findByIdAndUpdate(req.params.id, {
        deleted_at: new Date().getTime()
      }, {
        new: true
      })
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message:"Xóa tiện ích thành công",
        data: utility
      })
    } else {
      return res.status(401).send({
        statusCode: res.statusCode,
        success:false,
        message:"Bạn không thể thực hiện hành động này",
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

exports.utilities = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'utilities'
    )
    if (code === 200) {
      const utility = await UtilityModel.find({deleted_at: null })
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message:"Lấy danh sách tiện ích thành công",
        data: utility
      })
    } else {
      return res.status(401).send({
        statusCode: res.statusCode,
        success:false,
        message:"Bạn không thể thực hiện hành động này",
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

exports.utility = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'utility'
    )
    if (code === 200) {
      const utility = await UtilityModel.findById(req.params.id)
      if (utility == null || utility == undefined || utility.deleted_at != null) {
        return res.status(400).send({
          statusCode: res.statusCode,
          success: false,
          message:"Tiện ích không tồn tại",
          data: []
        })
      }
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message:"Lấy danh sách tiện ích thành công",
        data: utility
      })
    } else {
      return res.status(401).send({
        statusCode: res.statusCode,
        success:false,
        message:"Bạn không thể thực hiện hành động này",
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
