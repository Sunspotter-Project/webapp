import L from 'leaflet';


L.WebcamFilterControl = L.Control.extend({
    controlElement: null,
    chkBoxSunny: null,
    //selectSunny: null,
    chkBoxCloudyRainy: null,
    //selectCloudyRainy: null,
    selectConfidence: null,

    options: {
        position: 'bottomleft'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        // Continue initializing the control plugin here.
    },
    
    onAdd: function(map) {
        var label;
        var selectOption;
        var optionValue;
        var selectedOption;
        var selectOptions;
        var selectOptionUnit;

        selectOptionUnit = this.options.selectOptionsUnit;
        selectedOption = this.options.selectedOption;
        selectOptions = this.options.selectOptions.split(',');
        
        this.controlElement = L.DomUtil.create('div', 'webcam-filter-control');

        // add sunny checkbox
        this.chkBoxSunny = L.DomUtil.create('input', 'webcam-filter-chkbox');
        this.chkBoxSunny.type = 'checkbox';
        this.chkBoxSunny.checked = true;
        this.chkBoxSunny.id = 'pml-sunny';
        this.chkBoxSunny.name = 'sun';
        L.DomEvent.addListener(this.chkBoxSunny, 'change', this.options.onFilterChange);
        label = L.DomUtil.create('label', 'webcam-filter-chkbox-label');
        label.for = 'sun';
        label.innerHTML = 'Sunny&nbsp;<i class="fa fa-sun-o prediction-icon list-prediction-icon-sun"></i>';
        this.controlElement.appendChild(this.chkBoxSunny);
        this.controlElement.appendChild(label);

        /*
        // add sunny select
        this.selectSunny = L.DomUtil.create('select', 'webcam-filter-select');
        this.selectSunny.id = 'pml-sunny-confidence';
        this.selectSunny.name = 'sun-confidence';
        L.DomEvent.addListener(this.selectSunny, 'change', this.options.onFilterChange);
        // add options
        for (var i = 0; i < selectOptions.length; i++) {
            selectOption = L.DomUtil.create('option', 'webcam-filter-select-option');
            optionValue = selectOptions[i];
            selectOption.value = optionValue;
            selectOption.innerHTML = `${optionValue} ${selectOptionUnit}`;
            if (optionValue === selectedOption) {
                selectOption.selected = true;
            }
            this.selectSunny.appendChild(selectOption);
        }
        label = L.DomUtil.create('label', 'webcam-filter-select-label');
        label.for = 'sun-confidence';
        label.innerHTML = 'Confidence:';
        this.controlElement.appendChild(label);
        this.controlElement.appendChild(this.selectSunny);
        */

        // add cloudy checkbox
        this.chkBoxCloudyRainy = L.DomUtil.create('input', 'webcam-filter-chkbox');
        this.chkBoxCloudyRainy.type = 'checkbox';
        this.chkBoxCloudyRainy.checked = true;
        this.chkBoxCloudyRainy.id = 'pml-cloudy-rainy';
        this.chkBoxCloudyRainy.name = 'cloud-rainy';
        L.DomEvent.addListener(this.chkBoxCloudyRainy, 'change', this.options.onFilterChange);
        label = L.DomUtil.create('label', 'webcam-filter-chkbox-label');
        label.for = 'cloud-rainy';
        label.innerHTML = 'Cloudy&nbsp;<i class="fa fa-cloud prediction-icon list-prediction-icon-cloud"></i>';
        this.controlElement.appendChild(this.chkBoxCloudyRainy);
        this.controlElement.appendChild(label);

        /*

        // add cloud-rainy select
        this.selectCloudyRainy = L.DomUtil.create('select', 'webcam-filter-select');
        this.selectCloudyRainy.id = 'pml-cloudy-rainy-confidence';
        this.selectCloudyRainy.name = 'cloud-rainy-confidence';
        L.DomEvent.addListener(this.selectCloudyRainy, 'change', this.options.onFilterChange);
        // add options
        for (var i = 0; i < selectOptions.length; i++) {
            selectOption = L.DomUtil.create('option', 'webcam-filter-select-option');
            optionValue = selectOptions[i];
            selectOption.value = optionValue;
            selectOption.innerHTML = `${optionValue} ${selectOptionUnit}`;
            if (optionValue === selectedOption) {
                selectOption.selected = true;
            }
            this.selectCloudyRainy.appendChild(selectOption);
        }
        label = L.DomUtil.create('label', 'webcam-filter-select-label');
        label.for = 'cloud-rainy-confidence';
        label.innerHTML = 'Confidence:';

        this.controlElement.appendChild(label);
        this.controlElement.appendChild(this.selectCloudyRainy);
        
        */

        // add sunny select
        this.selectConfidence = L.DomUtil.create('select', 'webcam-filter-select');
        this.selectConfidence.id = 'confidence';
        this.selectConfidence.name = 'confidence';
        L.DomEvent.addListener(this.selectConfidence, 'change', this.options.onFilterChange);
        // add options
        for (var i = 0; i < selectOptions.length; i++) {
            selectOption = L.DomUtil.create('option', 'webcam-filter-select-option');
            optionValue = selectOptions[i];
            selectOption.value = optionValue;
            selectOption.innerHTML = `${optionValue} ${selectOptionUnit}`;
            if (optionValue === selectedOption) {
                selectOption.selected = true;
            }
            this.selectConfidence.appendChild(selectOption);
        }
        label = L.DomUtil.create('label', 'webcam-filter-select-label');
        label.for = 'confidence';
        label.innerHTML = 'Confidence: ';
        //this.controlElement.appendChild(label);
        //this.controlElement.appendChild(this.selectConfidence);

        // Continue implementing the control here.
        
        return this.controlElement;
    },

    onRemove: function(map) {
        // Tear down the control.
    },

    enable: function() {
        this.chkBoxSunny.disabled  = false;
        this.chkBoxCloudyRainy.disabled = false;
        this.selectConfidence.disabled = false;
        this.controlElement.style.color = '#000';
    },

    disable: function() {
        this.chkBoxSunny.disabled  = true;
        this.chkBoxCloudyRainy.disabled = true;
        this.selectConfidence.disabled = true;
        this.controlElement.style.color = '#ccc';
    },

    uncheck: function() {
        this.chkBoxSunny.checked = false;
        this.chkBoxCloudyRainy.checked = false;
    },

    check: function() {
        this.chkBoxSunny.checked = true;
        this.chkBoxCloudyRainy.checked = true;
    }
});

L.webcamFilterControl = function(options) {
    return new L.WebcamFilterControl(options);
}; 


