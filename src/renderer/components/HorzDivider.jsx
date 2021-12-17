import React from 'react';


function HorzDivider (props) {
    return  <div class="horz-divider" style={{height:props.height}} />;
}

export default React.memo(HorzDivider);
