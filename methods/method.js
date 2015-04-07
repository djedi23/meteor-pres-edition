Meteor.methods({
  'editMd': function(presId, step) {
    check(presId, String);
    check(step, Object);

    if (!Roles.userIsInRole(Meteor.user(), ['editor']))
      return;
    
    var pres = modules.collections.Presentations.findOne(presId);

    var step_ = modules.collections.Sessions.findOne({_id:pres.session},{fields: {currentStep: 1}});
    if (step_ && step_.currentStep){
      var actualStep = _.findWhere(pres.steps, {id: step_.currentStep} );
      step.id = step_.currentStep;

      modules.collections.Presentations.update({_id:presId, 'steps.id': step_.currentStep},
	{$set: {'steps.$': step}});
    }
  }
});
