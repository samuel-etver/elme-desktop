import React from 'react';
import './ChartScaleButtonsGroup.css';


class ChartScaleButtonsGroup extends React.Component {
    static groupAutoInc = 0;
    static buttonAutoInc = 0;

    constructor(props) {
        super(props);
        this.groupName = 'chartScaleButtonsGroupName' + (ChartScaleButtonsGroup.groupAutoInc++);
        this.buttonCaptions = ["10мин", "30мин", "1ч", "3ч", "6ч", "12ч", "24ч"];
    }

    render() {
        let buttons = [];
        for (let i = 0; i < this.buttonCaptions.length; i++) {
            buttons.push( <div>
                              <input type="radio" name={this.groupName} id={"button" + i} value={i} class="chart-scale-button"/>
                              <label for={"button" + i} >
                                  {this.buttonCaptions[i]}
                              </label>
                          </div>);
        }

        return  <div class="chart-scale-buttons-group">
                    {buttons}
                </div>
    }

}


export default ChartScaleButtonsGroup;
