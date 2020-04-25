/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sim', {
    s_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    sim_s_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sim: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sim'
  });
};
