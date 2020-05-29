import React from 'react';
import './MeasureParametersComboBox.css';
import MeasureParameters from './../MeasureParameters';

class MeasureParametersComboBox extends React.Component {
    constructor(props) {
        super(props);
        this.isOpen = false;
        this.onToggle = this.onToggle.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
    }


    getId(id) {
        return  this.props.prefix
                  ? this.props.prefix + id
                  : id;
    }


    onToggle() {
        let el = document.getElementById(this.getId('selectContainer'));
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
           el.style.visibility = 'visible';
           el.focus();
        } else {
           el.blur();
           el.style.visibility = 'hidden';
        }
    }


    onClickItem(event) {
      let val = 'Opt2';
      document.getElementById(this.getId('valueText')).innerHTML = val;
      this.onToggle();
    }

    render() {
        let getId = (id) => this.getId(id);
        let measureParameters = new MeasureParameters();
        let captions = [];
        for (let i = 0; i < measureParameters.size(); i++) {
            let parameter = measureParameters.byIndex(i);
            captions.push(
                <li class="select-option" onClick={this.onClickItem} value={parameter.id}>{(i + 1).toString() + '. ' + parameter.caption}</li>
            );
        }

        return  <div>
                    <div class="display-value" id={getId("displayValue")} onClick={this.onToggle}>
                       <span class="value-text" id={getId("valueText")}>Select</span>
                       <span class="arrow arrow-down" id={getId("arrowControl")}></span>
                    </div>
                    <ul tabindex="0" class="select-container" id={getId("selectContainer")} onBlur={this.onToggle}>
                        {captions}
                    </ul><br />
                </div>
    }
}

export default MeasureParametersComboBox;
