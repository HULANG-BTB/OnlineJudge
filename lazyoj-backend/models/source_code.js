/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('source_code', {
    sid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'solution',
        key: 'sid'
      }
    },
    source: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'source_code'
  });
};
