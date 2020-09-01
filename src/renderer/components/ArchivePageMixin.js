let ArchivePageMixin = {
    packData(data) {
        if ( !data || data.length < 1000) {
            return data;
        }

        let interval;
        switch(this.state.xScale) {
            case 2:
                interval = 5;
                break;
            case 3:
                interval = 15;
                break;
            case 4:
                interval = 30;
                break;
            case 5:
                 interval = 60;
                 break;
            case 6:
                  interval = 120;
                  break;
            default:
                return data;
        }
        interval *= 1000;


        let result = [];

        let dt0 = new Date(data[0][0].getTime());
        dt0.setMilliseconds(0);
        dt0.setSeconds(0);
        dt0.setMinutes(2*(dt0.getMinutes() >> 1));
        let dt0Int = dt0.getTime();

        let dt1 = data[data.length - 1][0];
        let dt1Int = dt1.getTime();


        let index = 0;
        let singles = 0;

        while (dt0Int <= dt1Int) {
            let dtNextInt = dt0Int + interval;

            let minY;
            let maxY;
            let minIndex;
            let maxIndex
            let dotCount = 0;

            for(; index < data.length; index++) {
                let [x, y] = data[index];
                if ( x.getTime() >= dtNextInt ) {
                    break;
                }
                dotCount++;
                if ( y !== undefined ) {
                    if ( minY === undefined) {
                        minY = y;
                        maxY = y;
                    }
                    else {
                        if ( minY > y ) {
                            minY = y;
                            minIndex = index;
                        }
                        if ( maxY < y ) {
                            maxY = y;
                            maxIndex = index;
                        }
                    }
                }
            }

            if ( dotCount ) {
                if ( minIndex === undefined ) {
                    result.push(data[index - 1]);
                }
                else {
                    if ( dotCount === 1 || minIndex === maxIndex) {
                        result.push( data[minIndex] );
                        singles++;
                    }
                    else {
                        if ( minIndex < maxIndex ) {
                            result.push( data[minIndex], data[maxIndex] );
                        }
                        else {
                            result.push( data[maxIndex], data[minIndex] );
                        }
                    }
                }
            }

            dt0Int = dtNextInt;
        }

        return result;
    },
};

export default ArchivePageMixin;
