import React from 'react';
import './ValuePane.css';

function ValuePane(props) {
  return  <div class="ValuePane">
            <div class="Caption ValuePaneItem">
              <div>
                {props.caption&&props.caption.text}
              </div>
            </div>
            <div class="Value ValuePaneItem">
              <div>
                {props.value&&props.value.text}
              </div>
            </div>
            <div class="Units ValuePaneItem">
              <div>
                {props.units&&props.units.text}
              </div>
            </div>
          </div>;
}

export default ValuePane;
