import React from 'react';
import './NumberButtonsGroup.css';

class NumberButton extends React.Component {
    render() {
        return  <button class="number-button" onClick={this.props.onClick}>
                    {this.props.caption}
                </button>
    }
}


class NumberButtonsGroup extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(index) {
        if ( this.props.options && this.props.options.eventManager ) {
            let prefix = '';
            if ( this.props.options.prefix ) {
                prefix = this.props.options.prefix;
            }
            this.props.options.eventManager.publish(prefix + 'number-button-click', index);
        }
    }


    render() {
        let buttons = [];
        let control = this;
        let getOnClick = function(index) {
            return function() {
                control.onClick(index);
            }
        }

        let count = 0;
        if ( this.props.options && this.props.options.count ) {
            count = this.props.options.count;
        }

        for (let i = 0; i < count; i++) {
            buttons.push( <NumberButton caption={i + 1} onClick={getOnClick(i)}/> );
        }

        return  <div class="number-buttons-group">
                    {buttons}
                </div>
    }
}

export default NumberButtonsGroup;
