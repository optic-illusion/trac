Session.set('editing_users', false);

Template.userAdmin.usersList = function () {
  return Meteor.users.find({},{});
};
Template.userAdmin.rolesList = function () {
  return Roles.getAllRoles();
};
Template.userAdmin.editingUsers = function () {
  return Session.equals('editing_users', true);
};
Template.userAdmin.userIsInRole = function (user) {
  return Roles.userIsInRole(user, this.name); 
};
Template.userAdmin.events({
  'click .btnEditUsers' : function (e, t) {
    Session.set('editing_users', true);
    Meteor.flush();
  },
  'click .btnFinishEditingUsers' : function (e, t) {
    Session.set('editing_users', false);
    Meteor.flush();
  },
  'click .deleteUser' : function (e, t) {
    if (confirm("Are you sure you want to delete this user? This action is irreversable.")) {
      Meteor.users.remove({_id: this._id});
    }
  },
  'click .toggleRole' : function (e, t) {
    var userId = e.currentTarget.id.substring(0,e.currentTarget.id.indexOf('_')); 
    if (Roles.userIsInRole(userId, this.name)) {
      Roles.removeUsersFromRoles(userId, this.name);
    } else {
      Roles.addUsersToRoles(userId, this.name);
    }
  }
});
