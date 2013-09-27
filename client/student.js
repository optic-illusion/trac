Meteor.subscribe("Students");

Session.set('editing_students', false);
Session.set('update_student', '');

Template.students.studentList = function () {
  return students.find({classId: this.classId},{sort :{lastname: 1, firstname: 1}});
};
Template.students.editingStudents = function () {
  return Session.equals('editing_students', true);
};
Template.students.className = function () {
  return classes.findOne({_id: this.classId}).grade + "-" + classes.findOne({_id: this.classId}).section;
};
Template.students.updatingStudent = function () {
  return !Session.equals('update_student','')
};
Template.students.updatingThisStudent = function () {
  return Session.equals('update_student',this._id)
};
Template.students.events({
  'click #btnEditStudents' : function (e, t) {
    Session.set('editing_students', true);
    Meteor.flush();
  },
  'click #btnFinishEditingStudents' : function (e, t) {
    Session.set('editing_students', false);
    Session.set('update_student', '');
    Meteor.flush();
  },
  'click .update_student' : function (e, t) {
    console.log("Updating: " + e.target.id);
    Session.set('update_student', e.target.id);
    Meteor.flush();
  },
  'click .save_update_student' : function (e, t) {
    console.log("Saving Update: " + e.target.id);
    console.log("lastname: " + (t.find("#lastname").value == ''?t.find("#lastname").placeholder:t.find("#lastname").value) + 
      "; firstname: " + (t.find("#firstname").value == ''?t.find("#firstname").placeholder:t.find("#firstname").value) + 
      "; age: " + (t.find("#age").value == ''?t.find("#age").placeholder:t.find("#age").value) + 
      "; allergy: " + (t.find("#allergy").value == ''?t.find("#allergy").placeholder:t.find("#allergy").value));
    students.update({_id: e.target.id}, {$set: {
      lastname: (t.find("#lastname").value == ''?t.find("#lastname").placeholder:t.find("#lastname").value),
      firstname: (t.find("#firstname").value == ''?t.find("#firstname").placeholder:t.find("#firstname").value),
      age: (t.find("#age").value == ''?t.find("#age").placeholder:t.find("#age").value),
      allergy: (t.find("#allergy").value == ''?t.find("#allergy").placeholder:t.find("#allergy").value)
    }});
    //reset the values such that the add boxes don't get prepopulated with these values
    t.find("#lastname").value = t.find("#firstname").value = t.find("#age").value = t.find("#allergy").value = '';
    Session.set('update_student', '');
    Meteor.flush();
  },
  'click .cancel_update_student' : function (e, t) {
    console.log("Cancelling Update: " + e.target.id);
    Session.set('update_student', '');
    Meteor.flush();
  },
  'click .delete_student' : function (e, t) {
    if (confirm("Are you sure you want to delete this student? This action is irreversable.")) {
      console.log("Deleting: " + e.target.id);
      students.remove({_id: e.target.id});
    }
  },
  'click #btnAddStudent' : function (e, t) {
    students.insert({lastname: t.find("#lastname").value, firstname: t.find("#firstname").value, age: t.find("#age").value, allergy: t.find("#allergy").value, classId: this.classId});
    console.log("Added " + t.find("#lastname").value + ";" + t.find("#firstname").value + ";" + t.find("#age").value + ";" + t.find("#allergy").value + ";" + this.classId);
    t.find("#lastname").value = "";
    t.find("#firstname").value = "";
    t.find("#age").value = "";
    t.find("#allergy").value = "";
  }
});


/////Generic Helper Functions/////

//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();

};//< -----This is the end tag for focusText() -----
