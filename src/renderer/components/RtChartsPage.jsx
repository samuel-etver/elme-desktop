import React from 'react';
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
                    <MeasureParametersComboBox />
                </div>
    }
}

export default RtChartsPage;
