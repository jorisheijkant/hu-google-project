const helpers = {
    shuffle: function(array) {
        let copy = [], n = array.length, i;

        // While there remain elements to shuffle…
        while (n) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * array.length);

            // If not already shuffled, move it to the new array.
            if (i in array) {
                copy.push(array[i]);
                delete array[i];
                n--;
            }
        }

        return copy;
    },

    getIndex: function(array, index, length) {
        if(index > -1 && array && array.length > 0) {
            if(index <= (array.length - length)) {
                return index;
            } else {
                let startIndex = index;
                do {
                    startIndex = startIndex - length;
                } while (startIndex > (array.length - length));

                return startIndex;
            }
        } else {
            return null;
        }
    },

    getResultsRange: function(userGroup, index) {
        let startIndex = userGroup.reduce((acc, currentValue, i) => {
            if(i < index) {
                return acc + currentValue
            } else {
                return acc;
            }
        }, 0);

        let endIndex = startIndex + userGroup[index];

        return {
            start: startIndex,
            end: endIndex,
            length: endIndex - startIndex
        }
    },

    getRegularResultsRange: function(userGroup, index) {
        let startIndex = userGroup.reduce((acc, currentValue, i) => {
            if(i < index) {
                return acc + (10 - currentValue)
            } else {
                return acc;
            }
        }, 0);

        let endIndex = startIndex + (10 - userGroup[index]);

        return {
            start: startIndex,
            end: endIndex,
            length: endIndex - startIndex
        }
    }
}