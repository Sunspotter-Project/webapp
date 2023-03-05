import L from 'leaflet';


L.MapButton = L.Control.extend({
    controlElement: null,

    options: {
        position: 'bottomleft'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        // Continue initializing the control plugin here.
    },

    onAdd: function(map) {

        this.controlElement = L.DomUtil.create('button', 'map-button');
        this.controlElement.innerHTML = 'Map Button';

        // Continue implementing the control here.
        return this.controlElement;
    },

    onRemove: function(map) {
        // Tear down the control.
    },

});

L.mapButton = function(options) {
    return new L.MapButton(options);
};


