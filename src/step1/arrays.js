
export function reverseArray(array) {
    if (array !== undefined) {
        for (let head = 0, tail = array.length-1; head < array.length/2; head++, tail--) {
            let x = array[head];
            array[head] = array[tail];
            array[tail] = x;
        }
    }
    return array
}

