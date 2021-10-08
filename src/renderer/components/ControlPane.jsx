import React from 'react';
import './ControlPane.css';
import MainEventManager from '../../common/MainEventManager';


const mainEventManager = MainEventManager.getInstance();

const rtValuesName = 'rt-values';
const rtChartsName = 'rt-charts';
const archiveName  = 'archive';
const markupName = 'markup';


function ControlButton (props) {
    let style = "control-button " + (props.selected ? "selected" : "");
    return (
        <button class={style} onClick={props.onClick}>
            {props.caption}
        </button>
    );
}


class ControlPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.rtValuesName
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onPageSelected = this.onPageSelected.bind(this);
    }


    render() {
        let selected = this.state.selected;
        let valuesSelected = selected === rtValuesName;
        let chartsSelected = selected === rtChartsName;
        let archiveSelected = selected === archiveName;
        let markupSelected = selected === markupName;

        return (
            <div class="control-pane">
                <ControlButton
                  onClick = {() => this.onButtonClick(rtValuesName)}
                  caption="ВЕЛИЧИНЫ"
                  selected={valuesSelected}/>
                <ControlButton
                  onClick = {() => this.onButtonClick(rtChartsName)}
                  caption="ГРАФИКИ"
                  selected={chartsSelected}/>
                <ControlButton
                  onClick = {() => this.onButtonClick(archiveName)}
                  caption="АРХИВ"
                  selected={archiveSelected}/>
                <ControlButton
                  onClick = {() => this.onButtonClick(markupName)}
                  caption="РАЗМЕТКА"
                  selected={markupSelected}/>
            </div>
        );
    }


    componentDidMount() {
        mainEventManager.subscribe('page-selected', this.onPageSelected);
    }


    componentWillUnmount() {
        mainEventManager.unsubscribe('page-selected', this.onPageSelected);
    }


    onButtonClick (type) {
        mainEventManager.publish('control-pane-button-click', type);
    }


    onPageSelected(event, type) {
        this.setState({
            selected: type
        });
    }
}

export default ControlPane;
