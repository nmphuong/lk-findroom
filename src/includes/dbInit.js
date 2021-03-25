const RoleModel = require('../models/roleModel')
// 
const {ROLES} = require('./default')

const role = RoleModel.find()

var array = []

for (var i = 0; i < role.length; i++) {
  array.push(role[i].role_name)
}

ROLES.forEach(role => {
  if (array.includes(role) == false) {
    new RoleModel({
      role_name: role,
      capabilities: []
    }).save()
  }
});