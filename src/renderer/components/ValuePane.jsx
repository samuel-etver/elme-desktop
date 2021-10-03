import React from 'react';
import './ValuePane.css';

function ValuePane(props) {
    return (
        <div class="value-pane">
            <div class="caption value-pane-item">
                <div>
                    {props.caption}
                </div>
            </div>
            <div class="value value-pane-item">
                <div>
                    {props.value}
                </div>
            </div>
            <div class="units value-pane-item">
                <div>
                    {props.units}
                </div>
            </div>
        </div>
    );
}

export default ValuePane;
