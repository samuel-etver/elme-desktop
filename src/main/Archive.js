LocalArchive = require('./LocalArchive');
RemoteArchive = require('./RemoteArchive');

let instance;

class Archive {
    constructor() {
        if ( !! instance ) {
            return instance;
        }
        this.localArchive = new LocalArchive();
        this.remoteArchive = new RemoteArchive();
        instance = this;
    }


}

(function() {
    new Archive();
})();


module.exports = {
    getInstance: () => instance
}
