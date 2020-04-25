/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('privilege', {
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    right: {
      type: DataTypes.CHAR(30),
      allowNull: false,
      defaultValue: ''
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
    tableName: 'privilege'
  });
};
