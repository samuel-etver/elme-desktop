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
        this.thumbRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.onThumbMouseDown = this.onThumbMouseDown.bind(this);
        this.onThumbMouseUp = this.onThumbMouseUp.bind(this);
        this.onThumbMouseMove = this.onThumbMouseMove.bind(this);
        this.state = {
            x: 0
        }
    }


    componentDidMount() {
        this.thumbW = this.thumbRef.current.offsetWidth;
    }


    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onThumbMouseMove);
        document.removeEventListener('mouseup', this.onThumbMouseUp);
    }


    onThumbMouseDown(event) {
        this.thumbX = event.nativeEvent.offsetX;
        document.addEventListener('mousemove', this.onThumbMouseMove);
        document.addEventListener('mouseup', this.onThumbMouseUp);
    }


    onThumbMouseUp(event) {
        document.removeEventListener('mousemove', this.onThumbMouseMove);
        document.removeEventListener('mouseup', this.onThumbMouseUp);
    }


    onThumbMouseMove(event) {
        let rect = this.scrollerRef.current.getBoundingClientRect();
        let minX = 0;
        let maxX =  rect.right - rect.left - this.thumbW;        
        let newX = event.clientX - this.thumbX - rect.left;
        if ( maxX < newX ) {
            newX = maxX;
        }
        if ( newX < minX ) {
            newX = minX;
        }
        this.setState({
            x: newX
        });
    }


    render() {
        return  <div class="chart-horz-scroller-wrapper">
                    <div class="chart-horz-scroller" ref={this.scrollerRef}>
                    </div>
                    <div class="chart-horz-scroller-thumb"
                      ref={this.thumbRef}
                      style={{left: this.state.x + 'px'}}
                      onMouseDown={this.onThumbMouseDown}>
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
                    <ChartHorzScroller/>
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
