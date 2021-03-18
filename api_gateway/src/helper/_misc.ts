const stopWords: string[] = [
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "you're",
    "you've",
    "you'll",
    "you'd",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "she's",
    "her",
    "hers",
    "herself",
    "it",
    "it's",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "that'll",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "don't",
    "should",
    "should've",
    "now",
    "d",
    "ll",
    "m",
    "o",
    "re",
    "ve",
    "y",
    "ain",
    "aren",
    "aren't",
    "couldn",
    "couldn't",
    "didn",
    "didn't",
    "doesn",
    "doesn't",
    "hadn",
    "hadn't",
    "hasn",
    "hasn't",
    "haven",
    "haven't",
    "isn",
    "isn't",
    "ma",
    "mightn",
    "mightn't",
    "mustn",
    "mustn't",
    "needn",
    "needn't",
    "shan",
    "shan't",
    "shouldn",
    "shouldn't",
    "wasn",
    "wasn't",
    "weren",
    "weren't",
    "won",
    "won't",
    "wouldn",
    "wouldn't",
];

const remove_stopwords = (str: string) => {
    let res: string[] = [];
    let words: string[] = str.split(" ");
    for (let i = 0; i < words.length; i++) {
        let word_clean: string = words[i].split(".").join("");
        if (!stopWords.includes(word_clean)) {
            res.push(word_clean);
        }
    }
    return res.join(" ");
};

interface metaRecipeInfo {
    protein: string;
    calories: string;
    fat: string;
    serving: string;
}

const getRecipeMetaData = (summary: string) => {
    let summary_words = summary.split(" ");
    let final_summary_list: string[] = [];
    for (let i = 0; i < summary_words.length; i++) {
        let word = summary_words[i].replace("<b>", "");
        word = word.replace("</b>", "");
        word = word.replace("</a>", "");
        word = word.replace("<a>", "");
        word = word.replace(".", "");
        word = word.replace(",", "");
        final_summary_list.push(word);
    }

    let protein: string =
        final_summary_list[final_summary_list.indexOf("protein") - 2];
    let calories: string =
        final_summary_list[final_summary_list.indexOf("calories") - 1];
    let fat: string = final_summary_list[final_summary_list.indexOf("fat") - 2];

    let serving_index = final_summary_list.indexOf("servings");
    let serving: string;
    if (serving_index == -1) {
        serving = "1";
    } else {
        serving = final_summary_list[serving_index - 1];
    }

    let meta: metaRecipeInfo = {
        protein: protein,
        calories: calories,
        serving: serving,
        fat: fat,
    }; 
    return meta;

};

export { remove_stopwords, getRecipeMetaData };
