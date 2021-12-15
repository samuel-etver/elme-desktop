import React from 'react';
import ReactCharts from 'echarts-for-react';

function Chart (props) {
    return  <ReactCharts option={props.options} style={{height:'inherit',width:'inherit'}} />
}

export default Chart;
