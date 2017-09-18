

module.exports = function tellTime() {

    var minutes = {
        0  : '',
        2  : 'LITE ÖVER ',
        3  : 'LITE ÖVER ',
        5  : 'FEM ÖVER ',
        10 : 'TIO ÖVER ',
        15 : 'KVART ÖVER ',
        20 : 'TJUGO ÖVER ',
        25 : 'FEM I HALV ',
        27 : 'LITE I HALV',
        28 : 'LITE I HALV',
        30 : 'HALV ',
        32 : 'LITE ÖVER HALV ',
        33 : 'LITE ÖVER HALV ',
        35 : 'FEM ÖVER HALV ',
        40 : 'TJUGO I ',
        45 : 'KVART I ',
        50 : 'TIO I ',
        55 : 'FEM I ',
        57 : 'LITE I ',
        58 : 'LITE I '
    };

    var hours = {
        0  : 'TOLV',
        1  : 'ETT',
        2  : 'TVÅ',
        3  : 'TRE',
        4  : 'FYRA',
        5  : 'FEM',
        6  : 'SEX',
        7  : 'SJU',
        8  : 'ÅTTA',
        9  : 'NIO',
        10 : 'TIO',
        11 : 'ELVA',
        12 : 'TOLV',
    };


    var now = new Date();

    var minute = now.getMinutes();
    var hour   = now.getHours() % 12;

    if (minute >= 25)
        hour += 1;

    if (minutes[minute] == undefined) {
        minute = 5 * Math.floor((minute + 2.5) / 5);
    }

    return minutes[minute] + hours[hour];


}
//console.log(tellTime());
