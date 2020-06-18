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
        this.onPageSelected = this.onPageSelected.bind(this);
    }


    render() {
        var toStyle = function(selected) {
            return selected ? 'selected' : '';
        };
        let selected = this.state.selected;
        let valuesStyle = toStyle(selected === 'rt-values');
        let chartsStyle = toStyle(selected === 'rt-charts');
        let archiveStyle = toStyle(selected === 'archive');
        let marksEditStyle = toStyle(selected === 'marks-edit');

        return (
            <div class="control-pane">
                <ControlButton type="rt-values"  caption="ВЕЛИЧИНЫ" style={valuesStyle}/>
                <ControlButton type="rt-charts"  caption="ГРАФИКИ"  style={chartsStyle}/>
                <ControlButton type="archive"    caption="АРХИВ"    style={archiveStyle}/>
                <ControlButton type="marks-edit" caption="РАЗМЕТКА" style={marksEditStyle}/>
            </div>
        );
    }


    componentDidMount() {
        privateEventManager.subscribe('button-click', this.onButtonClick);
        mainEventManager.subscribe('page-selected', this.onPageSelected);
    }


    componentWillUnmount() {
        privateEventManager.unsubscribe('button-click', this.onButtonClick);
        mainEventManager.unsubscribe('page-selected', this.onPageSelected);
    }


    onButtonClick(event, type) {
        mainEventManager.publish('control-pane-button-click', type);
    }


    onPageSelected(event, type) {
        this.setState({
            selected: type
        });
    }
}

export default ControlPane;