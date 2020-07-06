import React from 'react';
import './ChartScaleButtonsGroup.css';
import XScaleParameters from './XScaleParameters';


class ChartScaleButton extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }


    onChange() {
        if ( this.props.callback ) {
            this.props.callback(this.props.parameter.index);
        }
    }


    render() {
        let parameter = this.props.parameter;
        let id = this.props.group + '-button' + parameter.index;
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
                </div>
    }
}


class ChartScaleButtonsGroup extends React.Component {
    static groupAutoInc = 0;
    static buttonAutoInc = 0;

    constructor(props) {
        super(props);
        this.xScaleParameters = new XScaleParameters();
        this.groupName = 'chartScaleButtonsGroupName' + (ChartScaleButtonsGroup.groupAutoInc++);
        this.onChange = this.onChange.bind(this);
    }


    onChange(buttonIndex) {
        if ( this.props.callback ) {
            this.props.callback(buttonIndex);
        }
    }


    render() {
        let buttons = [];
        for (let i = 0; i < this.xScaleParameters.size(); i++) {
            buttons.push(<ChartScaleButton
                            group={this.groupName}
                            parameter={this.xScaleParameters.get(i)}
                            checked={i==this.props.buttonIndex}
                            callback={this.onChange}
                         />);
        }

        return  <div class="chart-scale-buttons-group">
                    {buttons}
                </div>
    }

}


export default ChartScaleButtonsGroup;
