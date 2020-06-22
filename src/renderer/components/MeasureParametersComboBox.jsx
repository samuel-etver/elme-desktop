import React from 'react';
import './MeasureParametersComboBox.css';
import MeasureParameters from './../MeasureParameters';
import ComboBoxMixin from './ComboBoxMixin';


class MeasureParametersComboBox extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
    }


    onClickItem(id, caption) {
      document.getElementById(this.getId('valueText')).innerHTML = caption;
      this.onToggle();
      if ( this.props.options ) {
          if ( this.props.options.eventManager ) {
              let prefix = this.props.options.prefix;
              if ( !prefix ) {
                  prefix = '';
              }
              this.props.options.eventManager.publish(prefix + 'combobox-select', id);
          }
      }
    }


    render() {
        let getId = (id) => this.getId(id);
        let measureParameters = new MeasureParameters();
        let captions = [];
        let selectedCaption = '';
        let selectedId;
        if ( this.props.options && this.props.options.selectedId) {
            selectedId = this.props.options.selectedId;
        }
        let item = this;
        let getOnClick = function(id, caption) {
            return function() {
                item.onClickItem(id, caption);
            }
        }
        for (let i = 0; i < measureParameters.size(); i++) {
            let parameter = measureParameters.byIndex(i);
            let caption = (i + 1).toString() + '. ' + parameter.caption;
            if ( parameter.id == selectedId ) {
                selectedCaption = caption;
            }
            captions.push(
                <li class="measure-parameters-combobox-select-option" onClick={getOnClick(parameter.id, caption)} value={parameter.id}>{caption}</li>
            );
        }

        return  <div class="measure-parameters-combobox">
                    <div class="measure-parameters-combobox-display-value" id={getId("displayValue")} onClick={this.onToggle}>
                       <span class="measure-parameters-combobox-value-text" id={getId("valueText")}>{selectedCaption}</span>
                       <span class="measure-parameters-combobox-arrow measure-parameters-combobox-arrow-down" id={getId("arrowControl")}></span>
                    </div>
                    <ul tabindex="0" class="measure-parameters-combobox-select-container" id={getId("selectContainer")} onBlur={this.onToggle}>
                        {captions}
                    </ul><br />
                </div>
    }
}

for (let key of Object.getOwnPropertyNames(ComboBoxMixin.prototype)) {
    MeasureParametersComboBox.prototype[key] = ComboBoxMixin.prototype[key];
}

export default MeasureParametersComboBox;
