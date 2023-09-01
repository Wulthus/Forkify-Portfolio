import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { RESULTS_PER_PAGE } from './config';
import { MY_KEY, SPOONAKULAR_KEY } from './config';
import { getJSON, sendJSON, AJAX, externalAPICall } from './helpers';
import { indexOf } from 'core-js/es/array';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,

    },
    bookmarks: [],
    ingredientList: [],
    ingredientData: {},
};

export const getRecipie = async function(recipeID){
    try {

        const recievedData = await AJAX(`${API_URL}${recipeID}?key=${MY_KEY}`);
        const recipeData = recievedData.data.recipe;
        state.recipe = formatRecipeObject(recipeData, recipeData.ingredients);

        if(state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    }catch(error){
        throw error;
    }
    
};

export const loadSearchResults = async function(query){
    try {
        const searchResultsData = await AJAX(`${API_URL}?search=${query}&key=${MY_KEY}`);
        state.search.query = query;
        state.search.results = searchResultsData.data.recipes.map(recipe => {            
            return {
                id: recipe.id,
                image_url: recipe.image_url,
                publisher: recipe.publisher,
                title: recipe.title,
                ...(recipe.key && {key: recipe.key}),
            }});
    }catch(error){
        throw error;  
    }
};

export const sortSearchResults = function (parameter, direction) {
    if (!state.search.results) return
};

export const getSearchResultsPage = function(page = state.search.page){
    const firstResult = (page - 1) * state.search.resultsPerPage;
    const lastResult = ((page - 1) * state.search.resultsPerPage) + state.search.resultsPerPage;
    state.search.page = page;
    return state.search.results.slice(firstResult, lastResult);
};

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = ingredient.quantity * (newServings / state.recipe.servings);
    });
    state.recipe.servings = newServings;
};

export const addBookmark = function(recipe){
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) {state.recipe.bookmarked = true;};
    saveBookmarks();
}

export const removeBookmark = function(id){
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) {state.recipe.bookmarked = false;}
    saveBookmarks();

}

export const saveBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadBookmarks = function(){
    if(!localStorage.getItem('bookmarks')) return;
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    state.bookmarks = storedBookmarks;
}

export const uploadUserRecipe = async function(userRecipeData){
    
    try{
        const userQuantities = Object.entries(userRecipeData)
        .filter(entry => entry[0].includes('quantity') && entry[1] !== '')
        .map(entry => entry[1]);
        
        const userUnits = Object.entries(userRecipeData)
        .filter(entry => entry[0].includes('unit') && entry[1] !== '')
        .map(entry => entry[1]);
        
        const userDescriptions = Object.entries(userRecipeData)
        .filter(entry => entry[0].includes('description') && entry[1] !== '')
        .map(entry => entry[1]);

        const userIngredients = userQuantities
        .map(quantity => {
            const index = userQuantities.indexOf(quantity);
            const ingredient = [quantity, userUnits[index], userDescriptions[index]];
            return ingredient;
        })
        .map(ingredientArray => {
            return {quantity: ingredientArray[0], unit: ingredientArray[1], description: ingredientArray[2]}
        })

        const userRecipe = formatRecipeObject(userRecipeData, userIngredients);
        const sentRecipe = await AJAX(`${API_URL}?key=${MY_KEY}`, userRecipe);
        state.recipe = formatRecipeObject(sentRecipe.data.recipe, sentRecipe.data.recipe.ingredients);
        addBookmark(state.recipe);

    }catch(error){
        throw(error);
    }
    };

const formatRecipeObject = function(data, ingridientArray) {
    const formatedObject = {
        cooking_time: +data.cookingTime || +data.cooking_time,
        id: data.id,
        image_url: data.image || data.image_url,
        ingredients: ingridientArray,
        publisher: data.publisher,
        servings: +data.servings,
        source_url: data.sourceUrl || data.source_url,
        title: data.title,
        ...(data.key && {key: data.key}),
    }
    return formatedObject;
};

export const addIngredient = function (quantity, unit, description) {
    const id = new Date().getTime();
    const ingredientObject = {
        id: id,
        quantity: quantity,
        unit: unit,
        description: description,
    }
    state.ingredientList.push(ingredientObject);
    saveList();
}

export const saveList = function(){
    localStorage.setItem('shopingList', JSON.stringify(state.ingredientList));
};

export const loadList = function(){
    if(!localStorage.getItem('shopingList')) return;
    const storedIngredients = JSON.parse(localStorage.getItem('shopingList'));
    state.ingredientList = storedIngredients;
}

export const removeIngredientfromList = function(id){
    state.ingredientList = state.ingredientList.filter(ingredient => ingredient.id !== id);
    saveList();
}

export const getNutrition = async function(quantity, unit, description) {
    try {
        const ingredientString =`${quantity} ${unit} ${description}`;
        const ingredientData = await externalAPICall(ingredientString, SPOONAKULAR_KEY);
        state.ingredientData.name = ingredientData[0].name;
        state.ingredientData.nutrition = ingredientData[0].nutrition;
    }catch(error){
        throw error
    }
}

export const clearShoppingList = function(){
    state.ingredientList = [];
    saveList();
}
