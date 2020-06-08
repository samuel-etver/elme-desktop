import React from 'react';
import ReactCharts from 'echarts-for-react';

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return  <ReactCharts option={this.props.options} style={{height:'inherit',width:'inherit'}} />
    }
}

export default Chart;
