/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('solution', {
    sid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      references: {
        model: 'problem',
        key: 'pid'
      }
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    memory: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    result: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    language: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    ip: {
      type: DataTypes.CHAR(46),
      allowNull: false
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'contest',
        key: 'cid'
      }
    },
    valid: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    num: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '-1'
    },
    code_length: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    pass_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    lint_error: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    judger: {
      type: DataTypes.CHAR(16),
      allowNull: false,
      defaultValue: 'LOCAL'
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
    tableName: 'solution'
  });
};
