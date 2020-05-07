import React from 'react';
import './ValuePane.css';

class ValuePane extends React.Component  {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="ValuePane">
                <div class="Caption ValuePaneItem">
                  <div>
                    {this.props.caption&&this.props.caption.text}
                  </div>
                </div>
                <div class="Value ValuePaneItem">
                  <div>
                    {this.props.value&&this.props.value.text}
                  </div>
                </div>
                <div class="Units ValuePaneItem">
                  <div>
                    {this.props.units&&this.props.units.text}
                  </div>
                </div>
              </div>
        );
    }
}

export default ValuePane;
