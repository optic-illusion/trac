Meteor.subscribe("Students");

Session.set('editing_students', false);
Session.set('update_student', '');
Session.set('selected_event_for_signup', '');

Template.students.rendered = function () {
  $('.tooltipclass').tooltip({
    "placement": "bottom",
    "container": "body"
  });
}
Template.students.studentList = function () {
  return students.find({classId: Session.get('selected_class')},{sort :{lastname: 1, firstname: 1}});
};
Template.students.eventList = function () {
  return events.find({},{sort :{name: 1, date: 1}});
};
Template.students.editingStudents = function () {
  return Session.equals('editing_students', true);
};
Template.students.eventAttributesList = function () {
  return Session.get('selected_event_for_signup').attributes;
};
Template.students.isTextAttributeType = function () {
  return this.type == "text";
};
Template.students.isNumberAttributeType = function () {
  return this.type == "number";
};
Template.students.className = function () {
  if (Session.equals('selected_class', '')) {
    return "No class selected!"
  } else {
    var selectedClass = classes.findOne({_id: Session.get('selected_class')});
    return selectedClass.grade + "-" + selectedClass.section;
  }
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
    //console.log("Updating: " + this._id);
    Session.set('update_student', this._id);
    Meteor.flush();
  },
  'click .save_update_student' : function (e, t) {
    /*
    console.log("Saving Update: " + this._id);
    console.log("lastname: " + (t.find("#lastname").value == ''?t.find("#lastname").placeholder:t.find("#lastname").value) + 
      "; firstname: " + (t.find("#firstname").value == ''?t.find("#firstname").placeholder:t.find("#firstname").value) + 
      "; age: " + (t.find("#age").value == ''?t.find("#age").placeholder:t.find("#age").value) + 
      "; allergy: " + (t.find("#allergy").value == ''?t.find("#allergy").placeholder:t.find("#allergy").value));
    */
    students.update({_id: this._id}, {$set: {
      lastname: (t.find("#edit_lastname").value == ''?t.find("#edit_lastname").placeholder:t.find("#edit_lastname").value),
      firstname: (t.find("#edit_firstname").value == ''?t.find("#edit_firstname").placeholder:t.find("#edit_firstname").value),
      age: (t.find("#edit_age").value == ''?t.find("#edit_age").placeholder:t.find("#edit_age").value),
      allergy: (t.find("#edit_allergy").value == ''?t.find("#edit_allergy").placeholder:t.find("#edit_allergy").value)
    }});
    //reset the values such that the add boxes don't get prepopulated with these values
    t.find("#edit_lastname").value = t.find("#edit_firstname").value = t.find("#edit_age").value = t.find("#edit_allergy").value = '';
    Session.set('update_student', '');
    Meteor.flush();
  },
  'click .cancel_update_student' : function (e, t) {
    //console.log("Cancelling Update: " + this._id);
    Session.set('update_student', '');
    Meteor.flush();
  },
  'click .delete_student' : function (e, t) {
    if (confirm("Are you sure you want to delete this student? This action is irreversable.")) {
      //console.log("Deleting: " + this._id);
      students.remove({_id: this._id});
    }
  },
  'click #btnAddStudent' : function (e, t) {
    if (t.find("#lastname").value == '' || t.find("#firstname").value == '' || t.find("#age").value == '') {
      if (t.find("#lastname").value == '')
        $('#lastname').tooltip('show');
      if (t.find("#firstname").value == '')
        $('#firstname').tooltip('show');
      if (t.find("#age").value == '')
        $('#age').tooltip('show');
    } else {
      students.insert({lastname: t.find("#lastname").value, firstname: t.find("#firstname").value, age: t.find("#age").value, allergy: t.find("#allergy").value, classId: Session.get('selected_class')});
      //console.log("Added " + t.find("#lastname").value + ";" + t.find("#firstname").value + ";" + t.find("#age").value + ";" + t.find("#allergy").value + ";" + this.classId);
      t.find("#lastname").value = t.find("#firstname").value = t.find("#age").value = t.find("#allergy").value = "";
    }
  },
  'click .eventHeaderDropdownItem' : function (e, t) {
    t.find("#eventHeaderTitle").innerHTML=this.name;
    Session.set('selected_event_for_signup', this);
  },
  'click .attrPlusButton' : function (e, t) {
    /*
    console.log(e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_')));
    console.log(t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value + " ; " +
(/[0-9]+/).test(t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value));
    */
    t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value = 
      ((/[0-9]+/).test(t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value))?
        parseInt(t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value)+1 : 1;
  },
  'click .attrMinusButton' : function (e, t) {
    t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value = 
      ((/[0-9]+/).test(t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value))?
        Math.max(parseInt(t.find("#"+e.currentTarget.id.substring(0,e.currentTarget.id.lastIndexOf('_'))).value)-1,0) : 0;
  }
});


/////Generic Helper Functions/////

//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();

};//< -----This is the end tag for focusText() -----
