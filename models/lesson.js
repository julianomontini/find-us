'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    studentId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    price: DataTypes.NUMERIC,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  }, {timestamps: true, paranoid: true});
  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Customer, {as: 'Student'});
    Lesson.belongsTo(models.Customer, {as: 'Teacher'});
    Lesson.belongsToMany(models.Customer, {as: 'Candidates', through: 'LessonCandidate', foreignKey: 'lessonId'})
  };
  return Lesson;
};