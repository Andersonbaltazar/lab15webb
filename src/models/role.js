const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.ENUM('ADMIN', 'CUSTOMER'),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'roles',
  timestamps: true,
});

module.exports = Role;
