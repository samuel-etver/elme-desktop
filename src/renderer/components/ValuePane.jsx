import React from 'react';
import './ValuePane.css';

class ValuePane extends React.Component  {
    render() {
        return (
            <div class="value-pane">
                <div class="caption value-pane-item">
                    <div>
                        {this.props.caption}
                    </div>
                </div>
                <div class="value value-pane-item">
                    <div>
                        {this.props.value}
                    </div>
                </div>
                <div class="units value-pane-item">
                    <div>
                        {this.props.units}
                    </div>
                </div>
              </div>
        );
    }
}

export default ValuePane;
