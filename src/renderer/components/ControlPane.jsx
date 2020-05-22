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
        let style = this.props.style;
        if ( !style ) {
            style = '';
        }
        style = "control-button " + style;
        return (
            <button class={style} onClick={this.onClick}>
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
        this.state = {
            selected: 'rt-values'
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onButtonSelect = this.onButtonSelect.bind(this);
    }


    render() {
        var toStyle = function(selected) {
            return selected ? 'selected' : '';
        };
        let selected = this.state.selected;
        let valuesStyle = toStyle(selected === 'rt-values');
        let chartsStyle = toStyle(selected === 'rt-charts');
        let archiveStyle = toStyle(selected === 'rt-archive');
        let marksEditStyle = toStyle(selected === 'rt-marks-edit');

        return (
            <div class="control-pane">
                <ControlButton type="rt-values"     caption="ВЕЛИЧИНЫ" style={valuesStyle}/>
                <ControlButton type="rt-charts"     caption="ГРАФИКИ"  style={chartsStyle}/>
                <ControlButton type="rt-archive"    caption="АРХИВ"    style={archiveStyle}/>
                <ControlButton type="rt-marks-edit" caption="РАЗМЕТКА" style={marksEditStyle}/>
            </div>
        );
    }


    componentDidMount() {
        privateEventManager.subscribe('button-click', this.onButtonClick);
        mainEventManager.subscribe('control-pane-button-select', this.onButtonSelect);
    }


    componentWillUnmount() {
        privateEventManager.unsubscribe('button-click', this.onButtonClick);
        mainEventManager.unsubscribe('control-pane-button-select', this.onButtonSelect);
    }


    onButtonClick(event, type) {
        mainEventManager.publish('control-pane-button-click', type);
    }


    onButtonSelect(event, type) {
        this.setState({
            selected: type
        });
    }
}

export default ControlPane;
