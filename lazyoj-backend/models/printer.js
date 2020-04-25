/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('printer', {
    printer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.CHAR(48),
      allowNull: false
    },
    in_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2018-03-13 19:38:00'
    },
    status: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    worktime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    printer: {
      type: DataTypes.CHAR(16),
      allowNull: false,
      defaultValue: 'LOCAL'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'printer'
  });
};
