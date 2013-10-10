
MM.MortarController = Ember.ObjectController.extend({
    showAbout: false,

    about: function(){
        this.set('showAbout', true);
    }
});
