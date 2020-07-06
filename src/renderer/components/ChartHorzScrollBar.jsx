import React from 'react';
import './ChartHorzScrollBar.css';

class ChartHorzScrollButton extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this)
    }


    onMouseDown() {

    }


    onMouseUp() {

    }


    render() {
        return  <button
                  class="chart-horz-scroll-button"
                  onMouseUp={this.onMouseUp}
                  onMouseDown={this.onMouseDown}>
                </button>
    }
}


class ChartHorzScroller extends React.Component {
    render() {
        return  <div class="chart-horz-scroller">
                </div>
    }
}


class ChartHorzScrollDivider extends React.Component {
    render() {
        return <div class="chart-horz-scroll-divider" />
    }
}


class ChartHorzScrollBar extends React.Component {
    render() {
        return  <div class="chart-horz-scroll-bar">
                    <ChartHorzScroller />
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton />
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton />
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton />
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton />
                </div>
    }
}

export default ChartHorzScrollBar;
