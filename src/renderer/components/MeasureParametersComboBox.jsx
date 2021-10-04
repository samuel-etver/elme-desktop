import React from 'react';
import './MeasureParametersComboBox.css';
import MeasureParameters from './../MeasureParameters';
import ComboBoxMixin from './ComboBoxMixin';

let measureParameters = new MeasureParameters();


class MeasureParametersComboBox extends React.Component {
    constructor (props) {
        super(props);
        this.initComboBoxMixin();
    }


    render () {
        let captions = [];
        let selectedId = this.props.selectedId;
        for (let i = 0; i < measureParameters.size(); i++) {
            let parameter = measureParameters.byIndex(i);
            let caption = (i + 1).toString() + '. ' + parameter.caption;
            if (parameter.id == selectedId) {
                var selectedCaption = caption;
            }
            captions.push(
                <li class="measure-parameters-combobox-select-option"
                  onClick={() => this.onClickItem(parameter.id)}
                  value={parameter.id}>{caption}</li>
            );
        }

        return  <div class="measure-parameters-combobox">
                    <div class="measure-parameters-combobox-display-value" onClick={this.onToggle}>
                       <span class="measure-parameters-combobox-value-text">{selectedCaption}</span>
                       <span class="measure-parameters-combobox-arrow measure-parameters-combobox-arrow-down"></span>
                    </div>
                    <ul ref={this.selectContainerRef} class="measure-parameters-combobox-select-container" onBlur={this.onToggle}>
                        {captions}
                    </ul><br />
                </div>
    }
}

for (let key of Object.getOwnPropertyNames(ComboBoxMixin.prototype)) {
    MeasureParametersComboBox.prototype[key] = ComboBoxMixin.prototype[key];
}

export default MeasureParametersComboBox;
