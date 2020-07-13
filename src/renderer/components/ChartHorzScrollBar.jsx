import React from 'react';
import './ChartHorzScrollBar.css';

class ChartHorzScrollButton extends React.Component {
    constructor(props) {
        super(props);
        this.timerId = undefined;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
    }


    onMouseDown() {
        this.clicked = false;
        this.timerId = setTimeout(() => this.repeatClick(), 500);
    }


    onMouseUp() {
        this.stopTimer();
    }


    onClick() {
        if ( !this.clicked ) {
            this.stopTimer();
            this.notify();
        }
    }


    repeatClick() {
        this.clicked = true;
        this.notify();
        this.timerId = setTimeout(() => this.repeatClick(), 50);
    }


    notify() {
        if ( this.props.callback ) {
            this.props.callback();
        }
    }


    stopTimer() {
        clearTimeout(this.timerId);
    }


    componentWillUnmount() {
        this.stopTimer();
    }


    render() {
        return  <button
                  class="chart-horz-scroll-button"
                  onMouseUp={this.onMouseUp}
                  onMouseDown={this.onMouseDown}
                  onClick={this.onClick}>
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

        let value;
        if ( maxX - minX > 0) {
            value = 100.0*(newX - minX)/(maxX - minX);
        }

        if ( this.props.callback ) {
            this.props.callback(value??50);
        }
    }


    render() {
       let value = 'calc(' + this.props.value + '% - 40px)';

        return  <div class="chart-horz-scroller-wrapper">
                    <div class="chart-horz-scroller" ref={this.scrollerRef}>
                    </div>
                    <div class="chart-horz-scroller-inner">
                      <div class="chart-horz-scroller-thumb"
                        ref={this.thumbRef}
                        style={{left: value}}
                        onMouseDown={this.onThumbMouseDown}>
                      </div>
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
    onButtonClick(event) {
        if ( this.props.callback ) {
            this.props.callback(event);
        }
    }


    onChange(value) {
        if ( this.props.callback ) {
            this.props.callback('value', value);
        }
    }


    render() {
        return  <div class="chart-horz-scroll-bar">
                    <ChartHorzScroller
                      value={this.props.value}
                      callback={value => this.onChange(value)}/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton
                      image="scroll-double-left"
                      callback={() => this.onButtonClick('double-left')}/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton
                      image="scroll-left"
                      callback={() => this.onButtonClick('left')}/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton
                      image="scroll-right"
                      callback={() => this.onButtonClick('right')}/>
                    <ChartHorzScrollDivider />
                    <ChartHorzScrollButton
                      image="scroll-double-right"
                      callback={() => this.onButtonClick('double-right')}/>
                </div>
    }
}

export default ChartHorzScrollBar;
