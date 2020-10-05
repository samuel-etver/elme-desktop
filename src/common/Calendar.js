
function intTo02(value) {
    return value < 10 ? ('0' + value) : value.toString();
}

function timeToStr(dt) {
    if (dt) {
        return intTo02(dt.getHours())  +  ':' +
               intTo02(dt.getMinutes()) + ':' +
               intTo02(dt.getSeconds());
    }
    return '';
}

function dateToStr(dt) {
    if (dt) {
        return intTo02(dt.getDate())      + '.' +
               intTo02(dt.getMonth() + 1) + '.' +
               intTo02(dt.getFullYear()  % 100);
    }
    return '';
}

module.exports = {
    timeToStr: timeToStr,
    dateToStr: dateToStr
};
