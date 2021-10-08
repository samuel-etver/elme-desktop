import React from 'react';
import './ControlPane.css';

const rtValuesName = 'rt-values';
const rtChartsName = 'rt-charts';
const archiveName  = 'archive';
const markupName = 'markup';


function ControlButton (props) {
    let style = "control-button " + (props.selected ? "selected" : "");
    return (
        <button class={style} onClick={props.onClick}>
            {props.caption}
        </button>
    );
}


function ControlPane (props) {
      function renderControlButton (name, caption) {
          return (
              <ControlButton
                onClick={() => props.onClick(name)}
                caption={caption}
                selected={name === props.selected}
              />);
      }

      return (
          <div class="control-pane">
              {renderControlButton(rtValuesName, "ВЕЛИЧИНЫ")}
              {renderControlButton(rtChartsName, "ГРАФИКИ")}
              {renderControlButton(archiveName, "АРХИВ")}
              {renderControlButton(markupName, "РАЗМЕТКА")}
          </div>
      );
}

export default ControlPane;
