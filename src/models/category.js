const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },

  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category
