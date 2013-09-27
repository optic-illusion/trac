classes = new Meteor.Collection("Classes");
students = new Meteor.Collection("Students");

Router.map(function () {
  this.route('classes', {
    path: '/'
  });
  this.route('classes', {
    path: '/classes'
  });

  this.route('students', {
    path: '/students',
    data: function() { 
      return {
        classId:this.params.classId,
        students:students.find({classId: this.params.classId})
      }
    }
  });
});
