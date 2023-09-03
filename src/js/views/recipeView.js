import icons from 'url:../../img/icons.svg';
import { fracty } from '../fracty.js';
import View from './View.js';

class RecipeView extends View{
    _parentElement = document.querySelector('.recipe');
    _errorMessage = 'We were unable to find the recipe. Please try another one.';
    _message = '';

    _generateHTML(){
        return `<figure class="recipe__fig">
          <img src=${this._data.image_url} alt="Picture of a descibed recipe" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
          <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cooking_time}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>
    
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--decrease-servings" data-update-to="${this._data.servings -1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-update-to="${this._data.servings +1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
    
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? "-fill" : ''}"></use>
            </svg>
          </button>
        </div>
    
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          
          ${this._data.ingredients.map(ingredient => this._generateIngredientHTML(ingredient)).join(' ')}
           
          </ul>
          <button class="recipe_button--add-all" title="Add all ingredients to your shopping list">Add to list +</button>
        </div>
    
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href=${this._data.source_url}
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`
    };
     _generateIngredientHTML(ingredient){
        return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__text">
          <div class="recipe__quantity">${ingredient.quantity ? fracty(ingredient.quantity) : ''}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit ?? ''}</span>
            <span class="recipe__description--description">${ingredient.description}</span>
          </div>
        </div>
        <div class="recipe__buttons">
          <button class="recipe__button--add recipe__button" title="Add this ingredient to your shopping list">
            +
          </button>
          <button class="recipe__button--check recipe__button" title="Check ingredient's nutritional value!">
            ?
          </button>
        </div>
      </li>`
    }

    addHandlerRenderer(eventHandler){
        ['load', 'hashchange'].forEach(event => window.addEventListener(event, eventHandler));
    }

    addHandlerChangeServings(handler){
      this._parentElement.addEventListener('click', function(e){
        const button = e.target.closest('.btn--tiny');
        if (!button) return;
        const updateTo = +button.dataset.updateTo;
        if (updateTo >= 1) handler(updateTo);
      })
    }

    addHandlerAddBookmark(handler){
      this._parentElement.addEventListener('click', function(e){
        const bookmarkBtn = e.target.closest('.btn--bookmark');
        if (!bookmarkBtn) return;
        handler();
      });
    }

    addHandlerIngredientList(handlerFunction){
      this._parentElement.addEventListener('click', function(e){
        const addIngredientBtn = e.target.closest('.recipe__button--add');
        if (!addIngredientBtn) return;
        const ingredientStrings = this._getIngredient(addIngredientBtn)
        handlerFunction(ingredientStrings[0], ingredientStrings[1], ingredientStrings[2]);
      }.bind(this));
    };

    addHandlerAllIngredients(handlerFunction) {
      this._parentElement.addEventListener('click', function(e){
        const addAllIngredientBtn = e.target.closest('.recipe_button--add-all');
        if (!addAllIngredientBtn) return;
        const ingredientList = this._parentElement.querySelectorAll('.recipe__ingredient');
        const ingredientsData = [];
        ingredientList.forEach(ingredient => {
          const extractedIngredient = this._getIngredient(addAllIngredientBtn, ingredient);
          ingredientsData.push(extractedIngredient)
        });
        ingredientsData.forEach(dataSet => handlerFunction(dataSet[0], dataSet[1], dataSet[2]));
      }.bind(this))
    };

    addHandlerGetNutrition(handlerFunction){
      this._parentElement.addEventListener('click', function(e){
        const getNutritionButton = e.target.closest('.recipe__button--check');
        if (!getNutritionButton) return;
        document.querySelector('.overlay').classList.remove('hidden');
        document.querySelector('.nutrition-window').classList.remove('hidden');
        const ingredientStrings = this._getIngredient(getNutritionButton);
        handlerFunction(ingredientStrings[0], ingredientStrings[1], ingredientStrings[2]);
    }.bind(this));


  };

  _getIngredient(button, ingredient = button.closest('.recipe__ingredient')){
    const quantity = ingredient.querySelector('.recipe__quantity').textContent;
    const unit = ingredient.querySelector('.recipe__unit').textContent;
    const description = ingredient.querySelector('.recipe__description--description').textContent;

    return [quantity, unit, description]
  }

};

export default new RecipeView();




