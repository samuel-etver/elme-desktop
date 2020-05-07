import React from 'react';
import './ControlPane.css';

class ControlButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="ControlButton">
            {this.props.caption}
            </div>
        );
    }
}

class ControlPane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="ControlPane">
              <ControlButton caption="ВЕЛИЧИНЫ" />
              <ControlButton caption="ГРАФИКИ" />
              <ControlButton caption="АРХИВ" />
              <ControlButton caption="РАЗМЕТКА" />
            </div>
        );
    }
}

export default ControlPane;
