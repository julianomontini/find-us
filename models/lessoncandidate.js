'use strict';
module.exports = (sequelize, DataTypes) => {
  const LessonCandidate = sequelize.define('LessonCandidate', {
    lessonId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER,
    status: {
     type: DataTypes.STRING,
     defaultValue: 'pending'
    }
  }, {timestamps: true});
  LessonCandidate.associate = function(models) {
    
  };
  return LessonCandidate;
};