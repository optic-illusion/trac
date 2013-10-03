Meteor.subscribe("Classes");

Session.set('editing_classes', false);
Session.set('selected_class', '');

Template.classes.rendered = function () {
  $('.tooltipclass').tooltip({
    "placement": "bottom",
    "container": "body"
  });
}
Template.classes.classList = function () {
  return classes.find({},{sort: {grade: 1, section: 1}});
};
Template.classes.editingClasses = function () {
  return Session.equals('editing_classes', true);
};
Template.classes.events({
  'click #btnEditClasses' : function (e, t) {
    Session.set('editing_classes', true);
    Meteor.flush();
  },
  'click #btnFinishEditingClasses' : function (e, t) {
    Session.set('editing_classes', false);
    Meteor.flush();
  },
  'click .delete_class' : function (e, t) {
    if (confirm("Are you sure you want to delete this class? This action is irreversable.")) {
      //console.log("Deleting: " + this._id);
      classes.remove({_id: this._id});
    }
  },
  'click .select_class' : function (e, t) {
    //console.log("Selected class: " + this._id);
    Session.set('selected_class', this._id);
    $('#myTab li:eq(1) a').tab('show');
  },
  'click #btnAddClass' : function (e, t) {
    if (t.find("#grade").value == '' || t.find("#section").value == '' || t.find("#room").value == '') {
      if (t.find("#grade").value == '')
        $('#grade').tooltip('show');
      if (t.find("#section").value == '')
        $('#section').tooltip('show');
      if (t.find("#room").value == '')
        $('#room').tooltip('show');
    } else {
      classes.insert({grade: t.find("#grade").value, section: t.find("#section").value, room: t.find("#room").value});
      t.find("#grade").value = t.find("#section").value = t.find("#room").value = '';
      //console.log("Added " + t.find("#grade").value + ";" + t.find("#section").value + ";" + t.find("#room").value);
    }
  }
});


/////Generic Helper Functions/////

//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();

};//< -----This is the end tag for focusText() -----
