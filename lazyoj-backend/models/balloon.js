/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('balloon', {
    balloon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.CHAR(48),
      allowNull: false
    },
    sid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'balloon'
  });
};
