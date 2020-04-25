/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('problem', {
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    output: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sample_input: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sample_output: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    spj: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '0'
    },
    hint: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    time_limit: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.000'
    },
    memory_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    defunct: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    },
    accepted: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    submit: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'problem'
  });
};
