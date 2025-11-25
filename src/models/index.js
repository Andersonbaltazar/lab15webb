// Central model loader to define associations
const sequelize = require('../config/database')

const Category = require('./category')
const Product = require('./product')
const Role = require('./role')
const User = require('./user')

// Associations
Category.hasMany(Product, { foreignKey: 'CategoryId', onDelete: 'SET NULL' })
Product.belongsTo(Category, { foreignKey: 'CategoryId' })

Role.hasMany(User, { foreignKey: 'RoleId', onDelete: 'RESTRICT' })
User.belongsTo(Role, { foreignKey: 'RoleId' })

module.exports = {
  sequelize,
  Category,
  Product,
  Role,
  User,
}
