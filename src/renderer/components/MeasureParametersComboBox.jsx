import React from 'react';
import './MeasureParametersComboBox.css';
import MeasureParameters from './../MeasureParameters';

class MeasureParametersComboBox extends React.Component {
    render() {
        let measureParameters = new MeasureParameters();
        let captions = [];
        for (let i = 0; i < measureParameters.size(); i++) {
            let parameter = measureParameters.byIndex(i);
            captions.push(
                <option value={parameter.id}>{(i + 1).toString() + '. ' + parameter.caption}</option>
            );
        }

        return  <select class="measure-parameters-combobox">
                    {captions}
                </select>;
    }
}

export default MeasureParametersComboBox;
