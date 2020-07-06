
var XScaleParameters = new (function() {
    var instance = this;
    var parameters = [];

    var create = function(caption, value) {
        parameters.push({
            caption: caption,
            value: value,
            index: parameters.length
        });
    };

    create('10мин', 10);
    create('30мин', 30);
    create('1ч', 60);
    create('3ч', 3*60);
    create('6ч', 6*60);
    create('12ч', 12*60);
    create('24ч', 24*60);

    this.size = () => parameters.length;

    this.get = i => parameters[i];

    return function() {
        return instance;
    };
})();


export default XScaleParameters;
