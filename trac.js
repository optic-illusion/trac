classes = new Meteor.Collection("Classes");
students = new Meteor.Collection("Students");
events = new Meteor.Collection("Events");

classes.allow({
  insert: function(userId, docs) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "class-admin");
  },
  update: function(userId, docs, fields, modifier) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "class-admin");
  },
  remove: function(userId, docs) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "class-admin");
  }
});

students.allow({
  insert: function(userId, docs) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "student-admin");
  },
  update: function(userId, docs, fields, modifier) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "student-admin");
  },
  remove: function(userId, docs) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "student-admin");
  }
});

events.allow({
  insert: function(userId, docs) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "event-admin");
  },
  update: function(userId, docs, fields, modifier) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "event-admin");
  },
  remove: function(userId, docs) {
    return Roles.userIsInRole(userId, "super-admin") || Roles.userIsInRole(userId, "event-admin");
  }
});

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
