import React from 'react';
import './MeasureParametersComboBox.css';
import MeasureParameters from './../MeasureParameters';
import MainEventManager from '../../common/MainEventManager';

let mainEventManager = MainEventManager.getInstance();


class MeasureParametersComboBox extends React.Component {
    constructor(props) {
        super(props);
        let selectedId = this.props.selectedId;
        if ( !selectedId ) {
            let measureParameters = new MeasureParameters();
            selectedId = measureParameters.get('inductorTemperature1').id;
        }
        this.state = {
            selectedId: selectedId
        };
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


    onClickItem(id, caption) {
      document.getElementById(this.getId('valueText')).innerHTML = caption;
      this.onToggle();
      if ( this.props.options && this.props.options.eventManager) {
          //this.props.options.eventManager.publish
      }
    }

    render() {
        let getId = (id) => this.getId(id);
        let measureParameters = new MeasureParameters();
        let captions = [];
        let selectedCaption = '';
        let b = this;
        let a = function(id, caption) {
            return function() {
                b.onClickItem(id, caption);
            }
        }
        for (let i = 0; i < measureParameters.size(); i++) {
            let parameter = measureParameters.byIndex(i);
            let caption = (i + 1).toString() + '. ' + parameter.caption;
            if ( parameter.id == this.state.selectedId) {
                selectedCaption = caption;
            }
            captions.push(
                <li class="select-option" onClick={a(parameter.id, caption)} value={parameter.id}>{caption}</li>
            );
        }

        return  <div>
                    <div class="display-value" id={getId("displayValue")} onClick={this.onToggle}>
                       <span class="value-text" id={getId("valueText")}>{selectedCaption}</span>
                       <span class="arrow arrow-down" id={getId("arrowControl")}></span>
                    </div>
                    <ul tabindex="0" class="select-container" id={getId("selectContainer")} onBlur={this.onToggle}>
                        {captions}
                    </ul><br />
                </div>
    }
}

export default MeasureParametersComboBox;
