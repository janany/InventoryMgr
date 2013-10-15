MM.Router.map(function() {
    this.resource('mortar');
    this.resource('game');
    this.resource('options');
    this.resource('about');
    this.resource('quit');
});

MM.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('mortar');
    }
});