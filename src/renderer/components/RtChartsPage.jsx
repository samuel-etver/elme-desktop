import React from 'react';
import './RtChartsPage.css';

class RtChartsPage extends React.Component {
    render() {
        let style = 'rt-charts-page ';
        if ( this.props.style ) {
            style += this.props.style;
        }
        return <div class={style}>
               </div>
    }
}

export default RtChartsPage;
