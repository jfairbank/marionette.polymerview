Marionette.PolymerView = Marionette.View.extend({
  constructor: function(options) {
    Marionette.View.prototype.constructor.apply(this, arguments);
    this._setPublishedKeys();
    this._initAttrsFromModel();
    this._initModelEvents();
    this._initPolymerEvents();
  },

  _setPublishedKeys: function() {
    this._publishedKeys = _.keys(this.el.publish);
  },

  _initAttrsFromModel: function() {
    this._setElAttrs(this.model.attributes);
  },

  _initModelEvents: function() {
    this.listenTo(this.model, 'change', this._updateElAttrsFromModel);
  },

  _initPolymerEvents: function() {
    if (!this.events) {
      this.events = {};
    }

    _.each(this._publishedKeys, function(key) {
      this.events['change:' + key] = _.bind(this._updateAttrFromEl, this, key);
    }, this);

    this.delegateEvents();
  },

  _updateAttrFromEl: function(attributeName) {
    var value = this.el[attributeName];
    this.model.set(attributeName, value);
  },

  _updateElAttrsFromModel: function() {
    this._setElAttrs(this.model.changed);
  },

  _setElAttrs: function(attributes) {
    var attributeNames = _.intersection(_.keys(attributes), this._publishedKeys);
    _.each(attributeNames, this._setElAttr, this);
  },

  _setElAttr: function(attributeName) {
    this.el[attributeName] = this.model.get(attributeName);
  }
});
