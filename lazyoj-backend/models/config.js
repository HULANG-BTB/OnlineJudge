/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('config', {
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    val: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'config'
  });
};
