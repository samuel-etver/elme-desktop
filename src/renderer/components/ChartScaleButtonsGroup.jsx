import React from 'react';
import './ChartScaleButtonsGroup.css';
import XScaleParameters from './XScaleParameters';


let ChartScaleButton = React.memo(function (props) {
    let parameter = props.parameter;
    let id = props.group + '-button' + parameter.index;
    return  <>
                <input type="radio"
                  name={props.group}
                  id={id}
                  value={parameter.index}
                  class="chart-scale-button"
                  checked={props.checked}
                  onChange={() => props.callback(parameter.index)}
                />
                <label for={id}>
                  {parameter.caption}
                </label>
            </>;
});


let groupAutoInc = 0;
let xScaleParameters = new XScaleParameters();

class ChartScaleButtonsGroup extends React.PureComponent {
    constructor (props) {
        super(props);
        this.groupName = 'chartScaleButtonsGroupName' + groupAutoInc++;
    }


    render () {
        let buttons = [];
        for (let i = 0; i < xScaleParameters.size(); i++) {
            buttons.push(<ChartScaleButton
                            group={this.groupName}
                            parameter={xScaleParameters.get(i)}
                            checked={i===this.props.buttonIndex}
                            callback={this.props.callback}
                         />);
        }

        return  <div class="chart-scale-buttons-group">
                    {buttons}
                </div>;
    }
}


export default ChartScaleButtonsGroup;
