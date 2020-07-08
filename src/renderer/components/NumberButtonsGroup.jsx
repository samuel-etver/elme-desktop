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
    onClick(index) {
        if ( this.props.callback ) {
            this.props.callback(index);
        }
    }


    render() {
        let buttons = [];
        let count = this.props.count ?? 0;

        for (let i = 0; i < count; i++) {
            buttons.push( <NumberButton caption={i + 1} onClick={() => this.onClick(i)}/> );
        }

        return  <div class="number-buttons-group">
                    {buttons}
                </div>
    }
}

export default NumberButtonsGroup;
