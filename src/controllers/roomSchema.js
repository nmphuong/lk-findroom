const RoomModel = require('../models/roomModel')
// 
const Validation = require('../includes/validation')
// 
const messageVI = require('../includes/message_vi')
// 
const Function = require('../includes/function')

exports.addRoom = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'addRoom'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      req.body = await Function.lowerCaseFunction(req.body)
      const room = await new RoomModel({
        ...req.body,
        coordinates: [req.body.lat, req.body.lng],
        author: Validation.userId
      }).save()
      const rommCreated = await RoomModel.findById(room._id).populate('author')
      
      return res.status(messageVI.mesagesCode.addroom_success.code).send({
        statusCode: res.statusCode,
        success:true,
        message: messageVI.mesagesCode.addroom_success.message,
        data: rommCreated
      })
    } else {
      return res.status(messageVI.mesagesCode.unauthenticate.code).send({
        statusCode: res.statusCode,
        success:false,
        message: messageVI.mesagesCode.unauthenticate.message,
        data: []
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

exports.updateRoom = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'updateRoom'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      const roomValid = await RoomModel.findById(req.params.id)
      if (roomValid == null || roomValid == undefined || roomValid.deleted_at != null) {
        return res.status(messageVI.mesagesCode.not_found.code).send({
          statusCode: res.statusCode,
          success:false,
          message: messageVI.mesagesCode.not_found.message,
          data: []
        })
      } else {
        if (roomValid.author != Validation.userId) {
          return res.status(messageVI.mesagesCode.unauthenticate.code).send({
            statusCode: res.statusCode,
            success:false,
            message: messageVI.mesagesCode.unauthenticate.message,
            data: []
          })
        } else {
          req.body = await Function.lowerCaseFunction(req.body)
          const room = await RoomModel.findByIdAndUpdate(roomValid._id, {
            ...req.body
          }, {
            new: true
          })
          const rommUpdated = await RoomModel.findById(room._id).populate('author')
          return res.status(messageVI.mesagesCode.addroom_success.code).send({
            statusCode: res.statusCode,
            success:true,
            message: messageVI.mesagesCode.updateroom_success.message,
            data: rommUpdated
          })
        }
      }
    } else {
      return res.status(messageVI.mesagesCode.unauthenticate.code).send({
        statusCode: res.statusCode,
        success:false,
        message: messageVI.mesagesCode.unauthenticate.message,
        data: []
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

exports.rooms = async (req, res, next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'rooms'
    )
    if (code === 200) {
      // if (req.query.hasOwnProperty('type') == false) {
      //   req.query.type = ''
      // } else {
      //   req.query.type = req.query.type.toLowerCase()
      // }
      // if (req.query.hasOwnProperty('location') == false) {
      //   req.query.location = ''
      // } else {
      //   req.query.location = req.query.location.toLowerCase()
      // }
      // const rooms = await RoomModel.find({
      //   $and: [
      //     {deleted_at: null },
      //     {status: true},
      //     { type: {
      //       $regex: '.*' + req.query.type + '.*' 
      //     }},
      //     { location: {
      //       $regex: '.*' + req.query.location + '.*' 
      //     }}
      //   ]
      // }).populate({ path: "author", populate: { path: 'roles',select: 'role_name' } })
      var aggregations = [];
      aggregations.push(
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },
        {
            $unwind: "$author"
        }
      );
      aggregations.push(
        {
            $lookup: {
                from: 'roles',
                localField: 'author.roles',
                foreignField: '_id',
                as: 'roles'
            }
        },
        {
            $unwind: "$roles"
        }
      );
      if (req.query.hasOwnProperty('type')) {
        aggregations.push(
            {
              $match: {type: {$regex: '.*' + req.query.type + '.*'}}
            },
        );
      }
      if (req.query.hasOwnProperty('location')) {
        aggregations.push(
            {
              $match: {location: {$regex: '.*' + req.query.location + '.*'}}
            },
        );
      }
      aggregations.push(
            {
              $match: {status: true}
            },
        );
      // if (req.query.hasOwnProperty("lng") && req.query.hasOwnProperty("lat")) {
      //   var lng = parseInt(req.query.lng)
      //   var lat = parseInt(req.query.lat)
      //   aggregations.push(
      //       {
      //         $match: {
      //           "e": {
      //             $geoWithin: {
      //               $centerSphere: [
      //                 [lng, lat], 2500 / 6378.1521408]
      //             }
      //           }
      //         }
      //       },
      //   )
      // }
      const rooms = await RoomModel.aggregate(aggregations);
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message: messageVI.mesagesCode.get_room_success.message,
        data: rooms
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

exports.room = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'room'
    )
    if (code === 200) {
      const room = await RoomModel.findById(req.params.id).populate('author')
      if (room == null || room == undefined || room.deleted_at != null || room.status == false) {
        return res.status(messageVI.mesagesCode.not_found.code).send({
          statusCode: res.statusCode,
          success:false,
          message: messageVI.mesagesCode.not_found.message,
          data: []
        })
      }
      return res.status(messageVI.mesagesCode.info_room_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.info_room_success.message,
        data: room
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

exports.deleteRoom = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'deleteRoom'
    )
    if (code === 200) {
      const room = await RoomModel.findById(req.params.id).populate('author')
      if (room == null || room == undefined || room.deleted_at != null) {
        return res.status(messageVI.mesagesCode.not_found.code).send({
          statusCode: res.statusCode,
          success:false,
          message: messageVI.mesagesCode.not_found.message,
          data: []
        })
      }
      const roomDeleted = await RoomModel.findByIdAndUpdate(req.params.id, {
        deleted_at: new Date().getTime()
      }, {
        new: true
      })
      return res.status(messageVI.mesagesCode.delete_room_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.delete_room_success.message,
        data: room
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

exports.myRooms = async (req, res, next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'myRooms'
    )
    if (code === 200) {
      const rooms = await RoomModel.find({$and: [{deleted_at: null }, {author: Validation.userId}]}).populate({ path: "author", populate: { path: 'roles',select: 'role_name' } })
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message: messageVI.mesagesCode.get_room_success.message,
        data: rooms
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

exports.roomsadmin = async (req, res, next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'roomsAdmin'
    )
    if (code === 200) {
      if (req.query.hasOwnProperty('type') == false) {
        req.query.type = ''
      } else {
        req.query.type = req.query.type.toLowerCase()
      }
      if (req.query.hasOwnProperty('location') == false) {
        req.query.location = ''
      } else {
        req.query.location = req.query.location.toLowerCase()
      }
      const rooms = await RoomModel.find({
        $and: [
          {deleted_at: null }
        ]
      }).populate({ path: "author", populate: { path: 'roles',select: 'role_name' } })
      return res.status(200).send({
        statusCode: res.statusCode,
        success:true,
        message: messageVI.mesagesCode.get_room_success.message,
        data: rooms
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

exports.deleteRoomAdmin = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'deleteRoomAdmin'
    )
    if (code === 200) {
      const room = await RoomModel.findById(req.params.id).populate('author')
      if (room == null || room == undefined || room.deleted_at != null) {
        return res.status(messageVI.mesagesCode.not_found.code).send({
          statusCode: res.statusCode,
          success:false,
          message: messageVI.mesagesCode.not_found.message,
          data: []
        })
      }
      const roomDeleted = await RoomModel.findByIdAndUpdate(req.params.id, {
        deleted_at: new Date().getTime()
      }, {
        new: true
      })
      return res.status(messageVI.mesagesCode.delete_room_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.delete_room_success.message,
        data: room
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

exports.roomAdmin = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'roomAdmin'
    )
    if (code === 200) {
      const room = await RoomModel.findById(req.params.id).populate('author')
      console.log(room)
      if (room == null || room == undefined || room.deleted_at != null) {
        return res.status(messageVI.mesagesCode.not_found.code).send({
          statusCode: res.statusCode,
          success:false,
          message: messageVI.mesagesCode.not_found.message,
          data: []
        })
      }
      return res.status(messageVI.mesagesCode.info_room_success.code).send({
        statusCode: res.statusCode,
        success: true,
        message: messageVI.mesagesCode.info_room_success.message,
        data: room
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


exports.updateRoomAdmin = async (req,res,next) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'updateRoomAdmin'
    )
    if (code === messageVI.mesagesCode.ok.code) {
      const roomValid = await RoomModel.findById(req.params.id)
      if (roomValid == null || roomValid == undefined || roomValid.deleted_at != null) {
        return res.status(messageVI.mesagesCode.not_found.code).send({
          statusCode: res.statusCode,
          success:false,
          message: messageVI.mesagesCode.not_found.message,
          data: []
        })
      } else {
        req.body = await Function.lowerCaseFunction(req.body)
        const room = await RoomModel.findByIdAndUpdate(roomValid._id, {
          ...req.body
        }, {
          new: true
        })
        const rommUpdated = await RoomModel.findById(room._id).populate('author')
        return res.status(messageVI.mesagesCode.addroom_success.code).send({
          statusCode: res.statusCode,
          success:true,
          message: messageVI.mesagesCode.updateroom_success.message,
          data: rommUpdated
        })
      }
    } else {
      return res.status(messageVI.mesagesCode.unauthenticate.code).send({
        statusCode: res.statusCode,
        success:false,
        message: messageVI.mesagesCode.unauthenticate.message,
        data: []
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

exports.activeRoomAdmin = async (req, res) => {
  try {
    let code = await Validation.canDoAction(
      req,
      'activeAdmin'
    )
    if (code === 200) {
      console.log(req.params.id)
      const user = await RoomModel.update({
        status: false
      }, {
        $set: {
          status: true,
        }
      }, {
          multi: true
      })
      return res.status(messageVI.mesagesCode.updateroom_success.code).send({
        statusCode: res.statusCode,
        message: messageVI.mesagesCode.updateroom_success.message,
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

