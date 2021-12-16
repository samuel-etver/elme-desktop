import React from 'react';
import './NumberButtonsGroup.css';

let NumberButton = React.memo(function(props) {
    return  <button class="number-button" onClick={props.onClick}>
                {props.caption}
            </button>;
});


class NumberButtonsGroup extends React.PureComponent {
    onClick (index) {
        this.props.callback && this.props.callback(index);
    }


    render () {
        let buttons = [];
        for (let i = 0; i <  this.props.count; i++) {
            buttons.push( <NumberButton caption={i + 1} onClick={() => this.onClick(i)}/> );
        }

        return  <div class="number-buttons-group">
                    {buttons}
                </div>;
    }
}

export default NumberButtonsGroup;
