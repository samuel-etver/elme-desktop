import React from 'react';
import './ChartScaleButtonsGroup.css';


class ChartScaleButton extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }


    onChange() {
        if ( this.props.callback ) {
            this.props.callback(this.props.value);
        }
    }


    render() {
        return  <div>
                    <input type="radio"
                      name={this.props.group}
                      id={this.props.id}
                      value={this.props.value}
                      class="chart-scale-button"
                      checked={this.props.checked}
                      onChange={this.onChange}
                    />
                    <label for={this.props.id}>
                        {this.props.caption}
                    </label>
                </div>
    }
}


class ChartScaleButtonsGroup extends React.Component {
    static groupAutoInc = 0;
    static buttonAutoInc = 0;

    constructor(props) {
        super(props);
        this.groupName = 'chartScaleButtonsGroupName' + (ChartScaleButtonsGroup.groupAutoInc++);
        this.buttonCaptions = ["10мин", "30мин", "1ч", "3ч", "6ч", "12ч", "24ч"];
        this.onChange = this.onChange.bind(this);
    }


    onChange(buttonIndex) {
        if ( this.props.callback ) {
            this.props.callback(buttonIndex);
        }
    }


    render() {
        let buttons = [];
        for (let i = 0; i < this.buttonCaptions.length; i++) {
            buttons.push(<ChartScaleButton
                            group={this.groupName}
                            id={"button" + i}
                            value={i}
                            caption={this.buttonCaptions[i]}
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
