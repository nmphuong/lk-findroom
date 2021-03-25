const express = require('express');
const router = express.Router()

// Import Schema
const roleSchema = require('../controllers/roleSchema')
const userSchema = require('../controllers/userSchema')
const utilitySchema = require('../controllers/utilitySchema');
const roomSchema = require('../controllers/roomSchema');

// Boy Parser
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

// Role setup route
router.post('/create-role', roleSchema.addRole)
router.post('/add-capabilities/:id', roleSchema.addCapabilities)
router.get('/roles', roleSchema.roles)
router.get('/role/:id', roleSchema.role)

// User setup route
router.post('/register', userSchema.register)
router.post('/login', userSchema.login)
router.post('/update-profile', userSchema.updateProfile)
router.post('/check-phone', userSchema.checkPhone)
router.get('/profile', userSchema.profile)
router.post('/update-role-user', userSchema.updateRole)
router.get('/users-admin', userSchema.usersAdmin)
router.get('/user-admin/:id', userSchema.userAdmin)
router.get('/delete-user-admin/:id', userSchema.deleteUserAdmin)
router.post('/update-user-admin/:id', userSchema.updateUserAdmin)
router.get('/update-all-user-admin', userSchema.activeAdmin)

// Utility setup route
router.post('/create-utility', utilitySchema.addUtility)
router.post('/udpate-utility/:id', utilitySchema.updateUtility)
router.get('/delete-utility/:id', utilitySchema.deleteUtility)
router.get('/utilities', utilitySchema.utilities) // Get all
router.get('/utility/:id', utilitySchema.utility) // Get by id

// Room setup route
router.post('/create-room', roomSchema.addRoom)
router.post('/update-room/:id', roomSchema.updateRoom)
router.get('/rooms', roomSchema.rooms)
router.get('/my-rooms', roomSchema.myRooms)
router.get('/room/:id', roomSchema.room)
router.get('/delete-room/:id', roomSchema.deleteRoom)
router.post('/update-room-admin/:id', roomSchema.updateRoomAdmin)
router.get('/rooms-admin', roomSchema.roomsadmin)
router.get('/room-admin/:id', roomSchema.roomAdmin)
router.get('/delete-room-admin/:id', roomSchema.deleteRoomAdmin)
router.get('/update-all-room-admin', roomSchema.activeRoomAdmin)

// Exports
module.exports = router
