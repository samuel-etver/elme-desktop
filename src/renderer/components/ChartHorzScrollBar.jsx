import React from 'react';
import './ChartHorzScrollBar.css';
import MainEventManager from '../../common/MainEventManager';

var mainEventManager = MainEventManager.getInstance();

class ChartHorzScrollButton extends React.Component {
    constructor(props) {
        super(props);
        this.timerId = undefined;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }


    onMouseDown() {
        this.timerId = setTimeout(() => this.repeatClick(), 500);
    }


    onMouseUp() {
        clearTimeout(this.timerId);
    }


    repeatClick() {
        if ( this.props.callback ) {
            this.props.callback();
        }
        this.timerId = setTimeout(() => this.repeatClick(), 50);
    }


    componentWillUnmount() {
        clearTimeout(this.timerId);
    }


    render() {
        return  <button
                  class="chart-horz-scroll-button"
                  onMouseUp={this.onMouseUp}
                  onMouseDown={this.onMouseDown}>
                  <img src={"assets/" + this.props.image +  ".png"} />
                </button>
    }
}


class ChartHorzScroller extends React.Component {
    constructor(props) {
        super(props);
        this.isMouseDown = false;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }


    onMouseDown() {
        this.isMouseDown = true;
        mainEventManager.publish("log", "mouse-down");
    }


    onMouseUp() {
        this.isMouseDown = false;
        mainEventManager.publish("log", "mouse-up");
    }


    onMouseMove() {
        if ( this.isMouseDown ) {
            mainEventManager.publish("log", "mouse-move");
        }
    }


    render() {
        return  <div class="chart-horz-scroller-wrapper">
                    <div class="chart-horz-scroller">
                    </div>
                    <div class="chart-horz-scroller-thumb"
                      onMouseDown={this.onMouseDown}>
                    </div>
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
                    <ChartHorzScrollButton image="scroll-double-left"/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton image="scroll-left"/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton image="scroll-right"/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton image="scroll-double-right"/>
                </div>
    }
}

export default ChartHorzScrollBar;
