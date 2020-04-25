/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loginlog', {
    id: {
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
    password: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(46),
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
    tableName: 'loginlog'
  });
};
