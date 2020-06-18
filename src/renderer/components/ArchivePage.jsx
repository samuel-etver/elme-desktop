import React from 'react';
import './ArchivePage.css';
import Constants from '../../common/Constants';
import MeasureParameters from '../MeasureParameters';
import EventManager from '../../common/EventManager';
import MainEventManager from '../../common/MainEventManager';
import MeasureParametersComboBox from './MeasureParametersComboBox';
import NumberButtonsGroup from './NumberButtonsGroup';
import HorzDivider from './HorzDivider';
import ChartBuilder from '../ChartBuilder';
import Chart from './Chart';

let mainEventManager = MainEventManager.getInstance();

class ArchivePage extends React.Component {
    constructor(props) {
        super(props);
        this.prefix = 'archive-page-';
        this.eventManager = new EventManager();
        this.measureParameters = new MeasureParameters();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        this.state = {
            selectedMeasureParameterId: measureParameter.id,
        };
    }


    componentDidMount() {

    }


    componentWillUnmount() {

    }


    render() {
        let style = 'archive-page ';
        if ( this.props.visible ) {
            style += 'front-page';
        }
        else {
            style += 'back-page hidden';
        }

        let chartCaptionOptions = {
            prefix: this.prefix,
            selectedId: this.state.selectedMeasureParameterId,
            eventManager: this.eventManager
        };
        let chartNumberButtonsGroupOptions = {
            prefix: this.prefix,
            count: this.measureParameters.size(),
            eventManager: this.eventManager
        };

        return  <div class={style}>
                    <MeasureParametersComboBox options={chartCaptionOptions}/>
                    <HorzDivider height="80px" />
                    <NumberButtonsGroup options={chartNumberButtonsGroupOptions}/>
                </div>;
    }
}

export default ArchivePage;
