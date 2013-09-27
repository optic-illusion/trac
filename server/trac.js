Meteor.publish("Classes", function() {
  return classes.find({}, {});
});
Meteor.startup(function () {
    // code to run on server at startup
});
