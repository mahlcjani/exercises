
export function reverseArray(array) {
    if (array !== undefined && array !== null) {
        for (let head = 0, tail = array.length-1; head < tail; head++, tail--) {
            let x = array[head];
            array[head] = array[tail];
            array[tail] = x;
        }
    }
    return array
}


