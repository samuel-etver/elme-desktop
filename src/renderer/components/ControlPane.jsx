import React from 'react';
import './ControlPane.css';

const rtValuesName = 'rt-values';
const rtChartsName = 'rt-charts';
const archiveName  = 'archive';
const markupName = 'markup';

const rtValuesCaption = 'ВЕЛИЧИНЫ';
const rtChartsCaption =  'ГРАФИКИ';
const archiveCaption = 'АРХИВ';
const markupCaption = 'РАЗМЕТКА';


let ControlButton = React.memo(function(props) {
    let style = "control-button " + (props.selected ? "selected" : "");
    return (
        <button class={style} onClick={props.onClick}>
            {props.caption}
        </button>
    );
});


let ControlPane = React.memo(function(props) {
      function renderControlButton (name, caption) {
          return  <ControlButton
                      onClick={() => props.onClick(name)}
                      caption={caption}
                      selected={name === props.selected} />;
      }

      return  <div class="control-pane">
                {renderControlButton(rtValuesName, rtValuesCaption)}
                {renderControlButton(rtChartsName, rtChartsCaption)}
                {renderControlButton(archiveName, archiveCaption)}
                {renderControlButton(markupName, markupCaption)}
              </div>;
});

export default ControlPane;
