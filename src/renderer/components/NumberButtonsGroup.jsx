import React from 'react';
import './NumberButtonsGroup.css';

let NumberButton = React.memo(function(props) {
    return  <button class="number-button" onClick={props.onClick}>
                {props.caption}
            </button>;
});


let NumberButtonsGroup = React.memo(function(props) {
    let buttons = [];
    for (let i = 0; i < props.count; i++) {
        buttons.push(<NumberButton caption={i + 1} onClick={() => props.callback(i)}/>);
    }

    return  <div class="number-buttons-group">
              {buttons}
            </div>;
});

export default NumberButtonsGroup;
