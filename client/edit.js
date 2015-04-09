modules.push('presentation.before', 20, 'toolbar');


// Simply 'inherites' helpers from AccountsTemplates
Template.uaButton.helpers(AccountsTemplates.atNavButtonHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.uaButton.events(AccountsTemplates.atNavButtonEvents);

Template.toolbar.events({
  'keydown': function(evt, tpl){
    ;
  },
  'click #addSlide': function() {
    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne(presId);
    var step = {};
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      step = _.findWhere(pres.steps, {id: session.currentStep} );
    }
    //console.log('add',presId);
    var slideId = Random.id(6);
    modules.collections.Presentations.update({_id:presId},{$addToSet: {steps: {id: slideId,
      x:step?((parseInt(step.x)||0) + 2000):0,
      y: step?(step.y || 0):0,
      md: "Title"
    }
    }});
    Meteor.setTimeout(function(){
      modules.jmpress.goTo('#'+slideId);
    }, 100);
  },
  'click #removeSlide': function() {
    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne(presId);
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var step = _.findWhere(pres.steps, {id: session.currentStep} );
      //	console.log('rm',presId);
      $(".jmpress").jmpress('prev');

      modules.collections.Presentations.update({_id:presId},{$pull: {steps: step}});
    }
  },
  'click #resetSession': function() {
    session = {p: Session.get('currentPresentation')};
    modules.collections.Sessions.insert(session);

    Session.set('currentSession' , undefined);
    console.log("Presentation session reseted by user");
  }
});

var formHandler = function(tpl, selector, form, field){
  var value = tpl.$(selector).val();
  value = value?value.trim():null;
  if (!_.isEmpty(value))
    form[field] = value;
  return form;
};


var interactionTypeValue= new ReactiveVar(null);

Template.editMd.events({
  'keydown': function(evt, tpl){
    ;
  },
  'click #save': function(evt, tpl){
    var presId = Session.get('currentPresentation');
    var form = {};
    var hasError=false;
    form = formHandler(tpl, 'textarea', form, 'md');
    form = formHandler(tpl, '#x', form, 'x');
    form = formHandler(tpl, '#y', form, 'y');
    form = formHandler(tpl, '#z', form, 'z');
    form = formHandler(tpl, '#r', form, 'r');
    form = formHandler(tpl, '#phi', form, 'phi');
    form = formHandler(tpl, '#scale', form, 'scale');
    form = formHandler(tpl, '#rx', form, 'rotateX');
    form = formHandler(tpl, '#ry', form, 'rotateY');
    form = formHandler(tpl, '#rz', form, 'rotateZ');
    form = formHandler(tpl, '#prev', form, 'prev');
    form = formHandler(tpl, '#next', form, 'next');

    form = formHandler(tpl, '#style', form, 'style');
    form = formHandler(tpl, '#worldStyle', form, 'worldStyle');

    var itype = tpl.$('#interactionType').val();
    if (! _.isEmpty(itype)){
      var data = modules.call('template.presentations.interaction.edit.read.'+itype, this, [form, tpl]);
      if (data===null)
        hasError=true;
      else
        form.interaction = {type: itype, data: data};
    }
    if (hasError===false)
      Meteor.call('editMd', presId, form);
    evt.preventDefault();
  },
  'change #interactionType': function(evt, tpl){
    interactionTypeValue.set(tpl.$('#interactionType').val());
  }
});

Template.editMd.helpers({
  context: function(){
    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne(presId);
    var step_ = modules.collections.Sessions.findOne({_id:pres.session},{fields: {currentStep: 1}});
    if (step_ && step_.currentStep){
      var step = _.findWhere(pres.steps, {id: step_.currentStep} );
      if (step)
        return step;
    }
    return null;
  },
  styles: function(){
    return [{v:'', l:'default'},
      {v:'clean', l:'clean'},
      {v:'transparent', l:'transparent'},
      {v:'unsplash', l:'image'}];
  },
  selectedStyle: function(a){
    return (this.v === a.style);
  },
  worldStyles: function(){
    return [{v:'', l:'default (clear)'},
      {v:'clear', l:'clear'},
      {v:'gray', l:'gray'},
      {v:'red', l:'red'},
      {v:'green', l:'green'},
      {v:'blue', l:'blue'},
      {v:'unsplash', l:'image'}];
  },
  selectedWorldStyle: function(a){
    return (this.v === a.worldStyle);
  },
  interactionTypeSelected: function(a){
    interactionTypeValue.set(this.interaction?this.interaction.type:'');

    if (this.interaction && this.interaction.type === a)
      return true;
    else if (! this.interaction && _.isEmpty(a))
      return true;
    return false;
  },
  interactionTypeValueHook: function(a){
    return 'template.presentations.interaction.edit.'+interactionTypeValue.get();
  },
  nextList: function(a){
    var self = this;
    var flag = false;
    return [{v:'', l:'default'}].concat(
      _.compact(_.map(a.steps, function(s){
                  if (self.id === s.id)
                    flag = true;
                  return flag?{v:s.id, l:s.md.slice(0,10)}:null;
                })));
  },
  selectedPrev: function(a){
    return (this.v === a.prev);
  },
  prevList: function(a){
    var self = this;
    var flag = true;
    return [{v:'', l:'default'}].concat(
      _.compact(_.map(a.steps, function(s){
                  if (self.id === s.id)
                    flag = false;
                  return flag?{v:s.id, l:s.md.slice(0,10)}:null;
                })));
  },
  selectedNext: function(a){
    return (this.v === a.next);
  }
});