'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    studentId: DataTypes.BIGINT,
    teacherId: DataTypes.BIGINT,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    location: DataTypes.JSONB,
    price: DataTypes.NUMERIC
  }, {timestamps: true});
  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Customer, {as: 'Student'});
    Lesson.belongsTo(models.Customer, {as: 'Teacher'});
    Lesson.belongsToMany(models.Customer, {as: 'Candidates', through: 'LessonCandidate', foreignKey: 'lessonId'})
  };
  return Lesson;
};