
import 'core-js/stable';
import 'core-js/actual';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import userRecipeView from './views/userRecipeView.js';
import shoppingListView from './views/shopingListView.js';
import nutritionView from './views/nutritionView.js';
import { MESSAGE_DISPLAY_LENGTH_MILISECONDS } from './config.js';
import shopingListView from './views/shopingListView.js';

if(module.hot){
  module.hot.accept
;}


// 

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipies = async function(){
  try {
      const recipeID = window.location.hash.slice(1);
      if (!recipeID) return;
      recipeView.renderSpinner();

      resultsView.update(model.getSearchResultsPage());

    // 1. -----------------------------------------------------------------------Loading Recipe
      await model.getRecipie(recipeID)
      const importedRecipe = model.state.recipe;

    //2. --------------------------------------------------------------------Rendering recipe
      recipeView.render(importedRecipe);
      bookmarksView.update(model.state.bookmarks);

  } catch (error) {
    recipeView.renderError();
    console.log(error);
  };
};

const controlSearchResults = async function(){
  try{
    
    resultsView.renderSpinner();
    const searchQuery = searchView.getQuery();
    if (!searchQuery) return;
    await model.loadSearchResults(`${searchQuery}`);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  }catch(error){
    throw error
  }
};

const controlPagination = function(page){
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
  paginationView.addHandlerClick(controlPagination);
}

const controlNumberOfServings = function(newServings) {
  model.updateServings(newServings);
  const importedRecipe = model.state.recipe;
  recipeView.update(importedRecipe);
  
}

const init = function(){
  recipeView.addHandlerRenderer(controlRecipies);
  recipeView.addHandlerChangeServings(controlNumberOfServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerIngredientList(controlAddIngredientList);
  recipeView.addHandlerAllIngredients(controlAddIngredientList);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  shoppingListView.addHandlerRender(controlAddIngredientToList);
  
  userRecipeView.addHandlerSubmit(controlAddRecipe);
  userRecipeView.addHandlerAddIngredient(controlAddIngredient);
  userRecipeView.addHandlerRemoveIngredient(controlRemoveIngredient);
  
  shopingListView.addHandlerRemoveIngredient(controlRemoveIngredientFromList);
  shopingListView.addHandlerClearList(controlClearShoppingList);

  recipeView.addHandlerGetNutrition(controlGetNutrition);
  model.loadBookmarks();
  model.loadList();
};

const controlAddIngredientList = function(quantity, unit, description){
  model.addIngredient(quantity, unit, description);
  controlAddIngredientToList();
}

const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if(model.state.recipe.bookmarked) model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(userRecipe){
  try {
    userRecipeView.renderSpinner();
    await model.uploadUserRecipe(userRecipe);
    recipeView.render(model.state.recipe);
    userRecipeView.renderMessage('Recipe uploaded succesfully!');
    userRecipeView.displayCloseButton('hide')
    setTimeout(()=>{
      userRecipeView.addHiddenClass();
      userRecipeView.render(model.state.recipe);
      userRecipeView.setParentElementIngredients();
      userRecipeView.displayCloseButton('show')
    }, MESSAGE_DISPLAY_LENGTH_MILISECONDS);
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);


    
  }catch(error){
    userRecipeView.renderError(error);
    userRecipeView.displayCloseButton('hide')
    setTimeout(()=>{
      userRecipeView.addHiddenClass();
      userRecipeView.render(model.state.recipe);
      userRecipeView.setParentElementIngredients();
      userRecipeView.displayCloseButton('show')
    }, MESSAGE_DISPLAY_LENGTH_MILISECONDS);

  }

}

const controlAddIngredient = function(){
  userRecipeView.renderIngredient();
}

const controlRemoveIngredient = function(){
  userRecipeView.removeIngredient();
}

const controlAddIngredientToList = function() {
  shopingListView.render(model.state.ingredientList);
}

const controlRemoveIngredientFromList = function(index) {
  model.removeIngredientfromList(index);
  shopingListView.checkListLength();
}

const controlGetNutrition = async function(quantity, unit, description) {
  try {
    nutritionView.renderSpinner();
    await model.getNutrition(quantity, unit, description);
    const nutrition = model.state.ingredientData
    nutritionView.render(nutrition);
  }catch(error){
    nutritionView.renderError();
    console.log(error);
  }

}

const controlClearShoppingList = function(){
  model.clearShoppingList();
  
}

init();



