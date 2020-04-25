/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('compile_info', {
    sid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true,
      references: {
        model: 'solution',
        key: 'sid'
      }
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'compile_info'
  });
};
