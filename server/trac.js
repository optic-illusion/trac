Meteor.publish("Classes", function() {
  return classes.find({}, {});
});
Meteor.publish("Students", function() {
  return students.find({}, {});
});
Meteor.publish("Events", function() {
  return events.find({}, {});
});
Meteor.publish(null, function() {
  return Meteor.roles.find({});
});
Meteor.publish(null, function() {
  return Meteor.users.find({});
});
Meteor.startup(function () {
    // code to run on server at startup
  try {Roles.createRole("new-user");} catch(e) {};
  try {Roles.createRole("super-admin");} catch(e) {};
  try {Roles.createRole("class-admin");} catch(e) {};
  try {Roles.createRole("student-admin");} catch(e) {};
  try {Roles.createRole("event-admin");} catch(e) {};
});

/*
Accounts.onCreateUser(function (options, user) {
  if (options.profile) {
    user.profile = options.profile;
  }
  return user;
});
*/

Meteor.users.allow({
  update: function(userId, docs, fields, modifier) {
    return isSuperUser(userId);
  }
});

function isSuperUser(userId) {
  return Roles.userIsInRole(userId, "super-admin");
}
