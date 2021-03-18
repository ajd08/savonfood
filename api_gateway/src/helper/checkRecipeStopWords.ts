import {logger} from "../logger/config";
const recipeStopWords = ["week", "weekly"];


//checks if there is a stop word in the title
//if there is, it will return false
//if there is not, it will return true
const checkRecipeStopWords = (title : string) => {

    title=title.toLowerCase();
    for(let i=0;i<recipeStopWords.length;i++) {
        logger.info("Current stop word: " + recipeStopWords[i]);
        logger.info("title: " + title);
        if(title.includes(recipeStopWords[i]))  {
            return false
        }
    }
    return true;
}

export { checkRecipeStopWords };
