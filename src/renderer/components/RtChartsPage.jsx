import React from 'react';
import ApexChart from 'react-apexcharts';
import './RtChartsPage.css';
import './MeasureParametersComboBox';
import MeasureParametersComboBox from './MeasureParametersComboBox';

class RtChartsPage extends React.Component {
    render() {
        let style = 'rt-charts-page ';
        if ( this.props.style ) {
            style += this.props.style;
        }
        return  <div class={style}>
                      <MeasureParametersComboBox prefix="rt-charts-page"/>
                </div>
    }
}

export default RtChartsPage;
