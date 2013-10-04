Meteor.subscribe("Events");

Session.set('editing_events', false);
Session.set('update_event', '');
Session.set('edit_event_attr', '');

Template.events.rendered = function () {
  $('.datepicker').datepicker();
  $('.tooltipclass').tooltip({
    "placement": "bottom",
    "container": "body"
  });
};
Template.events.formatDate = function (date) {
  var eventDate = moment(date).format("MM/DD/YYYY");
  return eventDate;
}
Template.events.eventList = function () {
  return events.find({},{sort: {name:1, date:1}});
};
Template.events.editingEvents = function () {
  return Session.equals('editing_events', true);
};
Template.events.updatingEvent = function () {
  return !Session.equals('update_event','');
};
Template.events.updatingThisEvent = function () {
  return Session.equals('update_event',this._id);
};
Template.events.editingThisEventAttr = function () {
  return Session.equals('edit_event_attr',this._id);
};
Template.events.events({
  'click #btnEditEvents' : function (e, t) {
    Session.set('editing_events', true);
    Meteor.flush();
  },
  'click #btnFinishEditingEvents' : function (e, t) {
    Session.set('editing_events', false);
    Session.set('update_event', '');
    Meteor.flush();
  },
  'click .update_event' : function (e, t) {
    //console.log("Updating: " + this._id);
    Session.set('update_event', this._id);
    Meteor.flush();
  },
  'click .save_update_event' : function (e, t) {
    //console.log("Saving Update: " + this._id);
    var eventDate = t.find("#edit_date").value == ''?new moment(t.find("#edit_date").placeholder).toDate():new moment(t.find("#edit_date").value,"MM-DD-YYYY").toDate();
    //console.log("name: " + (t.find("#name").value == ''?t.find("#name").placeholder:t.find("#name").value) + "; date: " + eventDate);
    events.update({_id: this._id}, {$set: {
      name: (t.find("#edit_name").value == ''?t.find("#edit_name").placeholder:t.find("#edit_name").value),
      date: eventDate
    }});
    //reset the values such that the add boxes don't get prepopulated with these values
    t.find("#edit_name").value = t.find("#edit_date").value = '';
    Session.set('update_event', '');
    Meteor.flush();
  },
  'click .cancel_update_event' : function (e, t) {
    //console.log("Cancelling Update: " + this._id);
    Session.set('update_event', '');
    Meteor.flush();
  },
  'click .delete_event' : function (e, t) {
    if (confirm("Are you sure you want to delete this event? This action is irreversable.")) {
      //console.log("Deleting: " + this._id);
      events.remove({_id: this._id});
    }
  },
  'click #btnAddEvent' : function (e, t) {
    if (t.find("#name").value == '' || t.find("#date").value == '') {
      if (t.find("#name").value == '')
        $('#name').tooltip('show');
      if (t.find("#date").value == '')
        $('#date').tooltip('show');
    } else {
      var eventDate = new moment(t.find("#date").value,"MM/DD/YYYY").toDate();
      events.insert({name: t.find("#name").value, date: eventDate});
      //console.log("Added " + t.find("#name").value + ";" + eventDate);
      t.find("#name").value = "";
      t.find("#date").value = ""; 
    }
  },
  'click .edit_event_attr' : function (e, t) {
    //console.log("launching: " + '#editAttr_'.concat(this._id));
    if (Session.equals('edit_event_attr', this._id))
      Session.set('edit_event_attr', '');
    else
      Session.set('edit_event_attr', this._id);
  },
  'click .btnRemoveEventAttr' : function (e, t) {
    var id = e.currentTarget.id.substring(e.currentTarget.id.lastIndexOf('_')+1);
    //console.log(id);
    var attributes = events.findOne({"_id": id}).attributes;
    /*
    console.log("Removing: Name=" + this.name + "; Type=" + this.type + "; ID=" + id + "; Attr=" + attributes);
    console.log({"name": this.name, "type": this.type});
    console.log(attributes[0]);
    console.log(attributes.indexOfNVP({"name": this.name, "type": this.type}));
    */
    attributes.splice(attributes.indexOfNVP({"name": this.name, "type": this.type}),1);
    //console.log(attributes);
    events.update({"_id": id},{$set: {
      "attributes": attributes
    }});
  },
  'click .btnMoveUpEventAttr' : function (e, t) {
    var id = e.currentTarget.id.substring(e.currentTarget.id.lastIndexOf('_')+1);
    var attributes = events.findOne({"_id": id}).attributes;
    attributes.moveNVP({"name": this.name, "type": this.type}, -1);
    events.update({"_id": id},{$set: {
      "attributes": attributes
    }});
  },
  'click .btnMoveDownEventAttr' : function (e, t) {
    var id = e.currentTarget.id.substring(e.currentTarget.id.lastIndexOf('_')+1);
    var attributes = events.findOne({"_id": id}).attributes;
    attributes.moveNVP({"name": this.name, "type": this.type}, 1);
    events.update({"_id": id},{$set: {
      "attributes": attributes
    }});
  },
  'click .btnAddEventAttr' : function (e, t) {
    //console.log("Added " + t.find("#attr_name").value + ";" + t.find("#attr_type").value);
    if (t.find("#attr_name").value == '') {
      $('#attr_name').tooltip('show');
    } else {
      var newAttrList = (this.attributes==null);
      if (newAttrList) {
        this.attributes = new Array();
      }
      this.attributes.push({name: t.find("#attr_name").value, type: t.find("#attr_type").value});
      events.update({"_id": this._id},{$set: {
        "attributes": this.attributes
      }});
      Meteor.flush();
      t.find("#attr_name").value = "";
      t.find("#attr_type").value = "number";
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

Array.prototype.indexOfNVP = function(nvp) {
  for (var i=0; i<this.length; i++) {
    if (this[i].name==nvp.name && this[i].type==nvp.type) {
      return i;
    }
  }
  return -1;
}

Array.prototype.moveNVP = function(nvp, number) {
  var index = this.indexOfNVP(nvp);
  this.splice(index,1);
  this.splice(Math.min(Math.max(index+number,0),this.length),0,nvp);
}
