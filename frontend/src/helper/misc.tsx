const capitalizeFirstLetter = (words: string) => {
    let new_words: string = words
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    return new_words;
};

const addZeroes = (num: number) => {
    const dec = num.toString().split(".")[1];
    const len = dec && dec.length > 2 ? 2 : 0;
    if(len==2) {
        return Number(num).toFixed(len);
    }
    else {
        return num.toString();
    }
};

export { capitalizeFirstLetter, addZeroes };
