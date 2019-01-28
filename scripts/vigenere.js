const LETTERS = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

function encrypt(message, key) {
    // Encrypt `message` with `key`.
    const charray = new Array(message.length);
    const keyGenerator = cycle(key);

    for (let i = 0; i < message.length; i++) {
        const char = message.charAt(i);
        if (LETTERS.has(char))
            charray[i] = shiftBy(char, keyGenerator.next().value);
        else
            charray[i] = char;
    }

    return charray.join('');
}


function decrypt(message, key) {
    // Decrypt `message` with `key`.
    const charray = new Array(message.length);
    const keyGenerator = cycle(key);

    for (let i = 0; i < message.length; i++) {
        const char = message.charAt(i);
        if (LETTERS.has(char))
            charray[i] = shiftBy(char, keyGenerator.next().value, true);
        else
            charray[i] = char;
    }

    return charray.join('');
}

function shiftBy(char, shiftChar, reverse = false) {
    // Shift `char` by `shiftChar` (English alphabet).
    if (!LETTERS.has(char) || !LETTERS.has(shiftChar))
        throw "`char` and `shiftChar` have to be ASCII letters!";

    // lowercase inputs and store initial case.
    const isUp = char.isUpperCase();
    char = char.toLowerCase();
    shiftChar = shiftChar.toLowerCase();

    // convert both inputs to ints, where 'a' -> 0
    const baseChar = 'a'.charCodeAt(0);
    let charValue = char.charCodeAt(0) - baseChar;
    let shiftValue = shiftChar.charCodeAt(0) - baseChar;
    if (reverse)
        shiftValue *= -1;  // undo a previous operation

    // perform the shift
    charValue = properMod(charValue + shiftValue, 26);

    // convert back
    char = String.fromCharCode(charValue + baseChar);
    if (isUp)
        char = char.toUpperCase();

    return char
}


// adapted from https://docs.python.org/3/library/itertools.html#itertools.cycle
function* cycle(iterable) {
    // cycle('ABCD') --> A B C D A B C D A B C D ...
    const saved = [];
    for (const element of iterable) {
        yield element;
        saved.push(element);
    }
    while (saved)
        for (const element of saved)
            yield element;
}

// from https://stackoverflow.com/a/17572910/
String.prototype.isUpperCase = function () {
    return this.valueOf().toUpperCase() === this.valueOf();
};

function handleButton() {
    const textBox = document.getElementById('text-input');
    const shouldEncode = document.getElementById('radio-encode').checked;
    const key = document.getElementById('key-input').value;

    if (shouldEncode)
        textBox.value = encrypt(textBox.value, key);
    else
        textBox.value = decrypt(textBox.value, key);
}

function properMod(a, b) {
    let result = a % b;
    if (result < 0)
        result += b;
    return result
}
