/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contest', {
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    defunct: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    private: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    langmask: {
      type: DataTypes.JSON,
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(16),
      allowNull: false,
      defaultValue: ''
    },
    judgemode: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
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
    tableName: 'contest'
  });
};
