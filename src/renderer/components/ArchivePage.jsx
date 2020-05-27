import React from 'react';
import './ArchivePage.css';

class ArchivePage extends React.Component {
    render() {
        let style = 'archive-page ';
        if ( this.props.style ) {
            style += this.props.style;
        }
        return <div class={style}>
               </div>;
    }
}

export default ArchivePage;
