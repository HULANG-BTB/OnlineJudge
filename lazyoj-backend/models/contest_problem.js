/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contest_problem', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'problem',
        key: 'pid'
      }
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'contest',
        key: 'cid'
      }
    },
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    c_accepted: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    c_submit: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'contest_problem'
  });
};
