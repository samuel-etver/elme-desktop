import React from 'react';
import './ControlPane.css';
import MainEventManager from '../../common/MainEventManager';
import EventManager from '../../common/EventManager';


const mainEventManager = MainEventManager.getInstance();
const privateEventManager = new EventManager();


class ControlButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    render() {
        return (
            <button class="ControlButton" onClick={this.onClick}>
                {this.props.caption}
            </button>
        );
    }


    onClick() {
        privateEventManager.publish('button-click', this.props.type);
    }
}

class ControlPane extends React.Component {
    constructor(props) {
        super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
    }


    render() {
        return (
            <div class="ControlPane">
                <ControlButton type="rt-values"     caption="ВЕЛИЧИНЫ" />
                <ControlButton type="rt-charts"     caption="ГРАФИКИ"  />
                <ControlButton type="rt-archive"    caption="АРХИВ"    />
                <ControlButton type="rt-marks-edit" caption="РАЗМЕТКА" />
            </div>
        );
    }


    componentDidMount() {
        privateEventManager.subscribe('button-click', this.onButtonClick);
    }


    componentWillUnmount() {
        privateEventManager.unsubscribe('button-click', this.onButtonClick);
    }


    onButtonClick(event, type) {
        mainEventManager.publish('control-panel-button-click');
    }
}

export default ControlPane;
