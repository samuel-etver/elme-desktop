import React from 'react';
import './ChartScaleButtonsGroup.css';
import XScaleParameters from './XScaleParameters';


class ChartScaleButton extends React.Component {
    constructor (props) {
        super(props);
        this.id = this.props.group + '-button' + this.props.parameter.index;
        this.onChange = this.onChange.bind(this);
    }


    onChange () {
        this.props.callback && this.props.callback(this.props.parameter.index);
    }


    render () {
        let parameter = this.props.parameter;
        let id = this.id;
        return  <div>
                    <input type="radio"
                      name={this.props.group}
                      id={id}
                      value={parameter.index}
                      class="chart-scale-button"
                      checked={this.props.checked}
                      onChange={this.onChange}
                    />
                    <label for={id}>
                        {parameter.caption}
                    </label>
                </div>;
    }
}


let groupAutoInc = 0;
let xScaleParameters = new XScaleParameters();

class ChartScaleButtonsGroup extends React.Component {
    constructor (props) {
        super(props);
        this.groupName = 'chartScaleButtonsGroupName' + groupAutoInc++;
        this.onChange = this.onChange.bind(this);
    }


    onChange (buttonIndex) {
        this.props.callback && this.props.callback(buttonIndex);
    }


    render () {
        let buttons = [];
        for (let i = 0; i < xScaleParameters.size(); i++) {
            buttons.push(<ChartScaleButton
                            group={this.groupName}
                            parameter={xScaleParameters.get(i)}
                            checked={i===this.props.buttonIndex}
                            callback={this.onChange}
                         />);
        }

        return  <div class="chart-scale-buttons-group">
                    {buttons}
                </div>;
    }
}


export default ChartScaleButtonsGroup;
