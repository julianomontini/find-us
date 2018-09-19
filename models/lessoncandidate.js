'use strict';
module.exports = (sequelize, DataTypes) => {
  const LessonCandidate = sequelize.define('LessonCandidate', {
    lessonId: DataTypes.BIGINT,
    teacherId: DataTypes.BIGINT,
    status: {
     type: DataTypes.ENUM,
     values: ['pending', 'accepted', 'declined'],
     defaultValue: 'pending'
    }
  }, {timestamps: true});
  LessonCandidate.associate = function(models) {
    
  };
  return LessonCandidate;
};