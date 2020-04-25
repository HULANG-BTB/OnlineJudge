/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reply', {
    rid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    author_id: {
      type: DataTypes.STRING(48),
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2016-05-13 19:24:00'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    topic_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    },
    ip: {
      type: DataTypes.STRING(46),
      allowNull: false
    }
  }, {
    tableName: 'reply'
  });
};
