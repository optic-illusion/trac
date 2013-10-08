Meteor.subscribe("Students");

Session.set('editing_students', false);
Session.set('update_student', '');
Session.set('selected_event_for_signup', '');

Template.students.className = function () {
  if (Session.equals('selected_class', '')) {
    return "No class selected!"
  } else {
    var selectedClass = classes.findOne({_id: Session.get('selected_class')});
    return selectedClass.grade + "-" + selectedClass.section;
  }
};

Template.students_profile.rendered = function () {
  $('.tooltipclass').tooltip({
    "placement": "bottom",
    "container": "body"
  });
}
Template.students_profile.studentList = function () {
  return students.find({classId: Session.get('selected_class')},{sort :{lastname: 1, firstname: 1}});
};
Template.students_profile.eventList = function () {
  return events.find({},{sort :{name: 1, date: 1}});
};
Template.students_profile.editingStudents = function () {
  return Session.equals('editing_students', true);
};
Template.students_profile.updatingStudent = function () {
  return !Session.equals('update_student','')
};
Template.students_profile.updatingThisStudent = function () {
  return Session.equals('update_student',this._id)
};
Template.students_profile.events({
  'click .btnEditStudents' : function (e, t) {
    Session.set('editing_students', true);
    Meteor.flush();
  },
  'click .btnFinishEditingStudents' : function (e, t) {
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
  }
});


Template.students_enrollment.studentList = function () {
  return students.find({classId: Session.get('selected_class')},{sort :{lastname: 1, firstname: 1}});
};
Template.students_enrollment.eventList = function () {
  return events.find({},{sort :{name: 1, date: 1}});
};
Template.students_enrollment.eventAttributesList = function () {
  return Session.get('selected_event_for_signup').attributes;
};
Template.students_enrollment.isTextAttributeType = function () {
  return this.type == "text";
};
Template.students_enrollment.isNumberAttributeType = function () {
  return this.type == "number";
};
Template.students_enrollment.findAttrValue = function (enrollment, event_name, type) {
  if (enrollment == null || 
    enrollment[Session.get('selected_event_for_signup')._id] == null || 
    enrollment[Session.get('selected_event_for_signup')._id][event_name] == null) 
    return type == "number"?0:"";
  else 
    return enrollment[Session.get('selected_event_for_signup')._id][event_name];
};
Template.students_enrollment.events({
  'click .eventHeaderDropdownItem' : function (e, t) {
    t.find("#eventHeaderTitle").innerHTML=this.name;
    Session.set('selected_event_for_signup', this);
  },
  'click .attrNumberPlusMinusButton' : function (e, t) {
    var info = e.currentTarget.id.split('_'); // 0: student._id; 1: event.name; 2: plus/minus
    //console.log("Student._id: " + info[0] + "; Event: " + info[1]);
    var student = students.findOne({"_id": info[0]});
    if (student.enrollment == null) {
      //console.log("No events found for student: " + student.firstname + ": Initializing events array.");
      student.enrollment = new Object();
    }
    if (student.enrollment[Session.get('selected_event_for_signup')._id] == null) {
      //console.log("No attributes defined for event: " + Session.get('selected_event_for_signup').name + ": Initializing attributes associative array.");
      student.enrollment[Session.get('selected_event_for_signup')._id] = new Object();
    }
    if (student.enrollment[Session.get('selected_event_for_signup')._id][info[1]] == null) {
      //console.log("Attribute name not defined in associative array: " + info[1] + ": Initializing name in associative array.");
      student.enrollment[Session.get('selected_event_for_signup')._id][info[1]] = 0;
    }
    if (info[2] == "plus") student.enrollment[Session.get('selected_event_for_signup')._id][info[1]]++;
    else if (info[2] == "minus") student.enrollment[Session.get('selected_event_for_signup')._id][info[1]] = Math.max(student.enrollment[Session.get('selected_event_for_signup')._id][info[1]]-1, 0);
    students.update({"_id": info[0]}, {$set: {
      "enrollment": student.enrollment
    }});
  },
  'blur .attrInputField' : function (e, t) {
    var info = e.currentTarget.id.split('_'); // 0: student._id; 1: event.name; 2: plus/minus
    //console.log("Student._id: " + info[0] + "; Event: " + info[1]);
    var student = students.findOne({"_id": info[0]});
    if (student.enrollment == null) {
      //console.log("No events found for student: " + student.firstname + ": Initializing events array.");
      student.enrollment = new Object();
    }
    if (student.enrollment[Session.get('selected_event_for_signup')._id] == null) {
      //console.log("No attributes defined for event: " + Session.get('selected_event_for_signup').name + ": Initializing attributes associative array.");
      student.enrollment[Session.get('selected_event_for_signup')._id] = new Object();
    }
    student.enrollment[Session.get('selected_event_for_signup')._id][info[1]] = e.currentTarget.value;
/*
    if (student.enrollment[Session.get('selected_event_for_signup').name][info[1]] == null) {
      //console.log("Attribute name not defined in associative array: " + info[1] + ": Initializing name in associative array.");
      student.enrollment[Session.get('selected_event_for_signup').name][info[1]] = "";
    }
*/
    students.update({"_id": info[0]}, {$set: {
      "enrollment": student.enrollment
    }});
  }
});
