/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('share_code', {
    share_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(48),
      allowNull: true
    },
    share_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    share_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'share_code'
  });
};
