classes = new Meteor.Collection("Classes");
students = new Meteor.Collection("Students");
events = new Meteor.Collection("Events");

Router.map(function () {
  this.route('navbar', {
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
  this.route('events', {
    path: '/events'
  });
});
