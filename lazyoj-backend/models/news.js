/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news', {
    nid: {
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ''
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    defunct: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2016-05-13 19:24:00'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'news'
  });
};
