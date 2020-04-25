/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    submit: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    accepted: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    defunct: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    },
    ip: {
      type: DataTypes.STRING(46),
      allowNull: false,
      defaultValue: ''
    },
    language: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1'
    },
    school: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    token: {
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
    tableName: 'user'
  });
};
