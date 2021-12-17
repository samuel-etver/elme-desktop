import React from 'react';
import './ChartHorzScrollBar.css';

class ChartHorzScrollButton extends React.PureComponent {
    constructor (props) {
        super(props);
        this.timerId = undefined;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
    }


    onMouseDown () {
        this.clicked = false;
        this.timerId = setTimeout(() => this.repeatClick(), 500);
    }


    onMouseUp () {
        this.stopTimer();
    }


    onClick () {
        if (!this.clicked) {
            this.stopTimer();
            this.notify();
        }
    }


    repeatClick () {
        this.clicked = true;
        this.notify();
        this.timerId = setTimeout(() => this.repeatClick(), 50);
    }


    notify () {
        this.props.callback && this.props.callback();
    }


    stopTimer () {
        clearTimeout(this.timerId);
    }


    componentWillUnmount () {
        this.stopTimer();
    }


    render () {
        return  <button
                  class="chart-horz-scroll-button"
                  onMouseUp={this.onMouseUp}
                  onMouseDown={this.onMouseDown}
                  onClick={this.onClick}>
                  <img src={"assets/" + this.props.image +  ".png"} />
                </button>;
    }
}


class ChartHorzScroller extends React.PureComponent {
    constructor (props) {
        super(props);
        this.thumbRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.onThumbMouseDown = this.onThumbMouseDown.bind(this);
        this.onThumbMouseUp = this.onThumbMouseUp.bind(this);
        this.onThumbMouseMove = this.onThumbMouseMove.bind(this);
    }


    componentDidMount () {
        this.thumbW = this.thumbRef.current.offsetWidth;
    }


    componentWillUnmount () {
        document.removeEventListener('mousemove', this.onThumbMouseMove);
        document.removeEventListener('mouseup', this.onThumbMouseUp);
    }


    onThumbMouseDown (event) {
        this.thumbX = event.nativeEvent.offsetX;
        document.addEventListener('mousemove', this.onThumbMouseMove);
        document.addEventListener('mouseup', this.onThumbMouseUp);
    }


    onThumbMouseUp (event) {
        document.removeEventListener('mousemove', this.onThumbMouseMove);
        document.removeEventListener('mouseup', this.onThumbMouseUp);
        this.props.callback &&  this.props.callback('stop', this.props.value);
    }


    onThumbMouseMove (event) {
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
        if (maxX - minX > 0) {
            value = 100.0*(newX - minX)/(maxX - minX);
        }

        this.props.callback && this.props.callback('scroll', value??50);
    }


    render () {
        let value = 'calc(' + this.props.value + '% - 40px)';

        return  <div class="chart-horz-scroller-wrapper">
                    <div class="chart-horz-scroller"
                      ref={this.scrollerRef}>
                    </div>
                    <div class="chart-horz-scroller-inner">
                        <div class="chart-horz-scroller-thumb"
                          ref={this.thumbRef}
                          style={{left: value}}
                          onMouseDown={this.onThumbMouseDown}>
                        </div>
                    </div>
                </div>;
    }
}


class ChartHorzScrollBar extends React.PureComponent {
    renderButton (name) {
        return  <>
                    <div class="chart-horz-scroll-divider" />
                    <ChartHorzScrollButton
                      image={'scroll-' + name}
                      callback={() => this.props.callback(name)}/>
                </>;
    }


    render () {
        return  <div class="chart-horz-scroll-bar">
                    <ChartHorzScroller
                      value={this.props.value}
                      callback={(event, value) =>  this.props.callback(event, value)}/>
                    {this.renderButton('double-left')}
                    {this.renderButton('left')}
                    {this.renderButton('right')}
                    {this.renderButton('double-right')}
                </div>;
    }
}

export default ChartHorzScrollBar;
