import icons from 'url:../../img/icons.svg';
import View from './View.js';

class UserRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _parentElementIngredients = document.querySelector('.upload__column--ingredients-section');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _buttonOpen = document.querySelector('.nav__btn--add-recipe');
    _buttonClose = document.querySelector('.btn--close-modal');
    _plusButton = document.querySelector('.ingredient__btn--plus');
    _minusButton = document.querySelector('.ingredient__btn--minus');

    constructor(){
        super();
        this._addHandlerShowModal();
        this._addHandlerHideModal();
    }

    _addHandlerShowModal(){
        this._buttonOpen.addEventListener('click', this.removeHiddenClass.bind(this));
    }

    _addHandlerHideModal(){
        this._buttonClose.addEventListener('click', this.addHiddenClass.bind(this));
        this._overlay.addEventListener('click', this.addHiddenClass.bind(this));
    }

    _generateHTML(){
        return `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="" required name="title" placeholder="Your recipe's name" type="text" />
          <label>URL</label>
          <input value="" required name="sourceUrl" minlength="5" placeholder="URL to your recipe's source" type="text" />
          <label>Image URL</label>
          <input value="" required name="image" minlength="5" placeholder="URL to your recipe's image" type="text" />
          <label>Publisher</label>
          <input value="" required name="publisher" minlength="4" placeholder="Your recipe's publisher" type="text" />
          <label>Prep time</label>
          <input value="" required name="cookingTime" placeholder="in minutes" type="number" />
          <label>Servings</label>
          <input value="" required name="servings" placeholder="number of servings" type="number" />
        </div>

        <div class="upload__column upload__column--ingredients">
          <h3 class="upload__heading">Ingredients</h3>
          <div class="upload__column--ingredients-section">
            <div class="upload__ingredient">
              <div class="upload__label">
                <label>Ingredient 1</label>
              </div>
              <div class="upload__inputs">
                  <input
                    value=""
                    type="text"
                    required
                    name="ingredient-quantity-1"
                    placeholder="Quantity"
                  />
                  <input
                    value=""
                    type="text"
                    required
                    name="ingredient-unit-1"
                    placeholder="Unit"
                  />
                  <input
                    value=""
                    type="text"
                    required
                    name="ingredient-description-1"
                    placeholder="Description"
                  />
              </div>
            </div>
          </div>
          <div class="upload__ingredient-buttons">
            <button class="ingredient__btn ingredient__btn--plus">
              <span>+</span>
            </button>
            <button class="ingredient__btn ingredient__btn--minus">
              <span>-</span>
            </button>

          </div>
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>`
    }

    addHiddenClass(){
        this._overlay.classList.add('hidden');
        this._window.classList.add('hidden');
    }

    removeHiddenClass(){
      this._overlay.classList.remove('hidden');
      this._window.classList.remove('hidden');
  }

    displayCloseButton(command){
      if(command === 'hide') {
        this._buttonClose.classList.add('hidden');
      };
      if(command === 'show') {
        this._buttonClose.classList.remove('hidden');
      }

    }

    addHandlerSubmit(handlerFunction){
        this._parentElement.addEventListener('submit', function(e){
          e.preventDefault();
          const plusButton = document.querySelector('.ingredient__btn--plus');
          const minusButton = document.querySelector('.ingredient__btn--minus');
          const submitter = e.submitter;
          if (submitter === plusButton || submitter === minusButton) return;
          const userRecipeData = [... new FormData(this)];
          const userRecipe = Object.fromEntries(userRecipeData);
          handlerFunction(userRecipe);
        })
    };

    addHandlerAddIngredient(handlerFunction){
      this._parentElement.addEventListener('submit', function(e){
        e.preventDefault();
        const plusButton = document.querySelector('.ingredient__btn--plus');
        const submitter = e.submitter;
        if (submitter !== plusButton) return;
        handlerFunction();
      })
       
    }

    addHandlerRemoveIngredient(handlerFunction){
      this._parentElement.addEventListener('submit', function(e){
        e.preventDefault();
        const minusButton = document.querySelector('.ingredient__btn--minus');
        const submitter = e.submitter;
        if (submitter !== minusButton) return;
        handlerFunction();
      })
       
    }

    _generateIngredientHTML(){
      return `          
      <div class="upload__ingredient">
      <div class="upload__label">
        <label>Ingredient ${this._parentElementIngredients.childElementCount + 1}</label>
      </div>
      <div class="upload__inputs">
          <input
            value=""
            type="text"
            name="ingredient-quantity-${this._parentElementIngredients.childElementCount + 1}"
            placeholder="Quantity"
          />
          <input
            value=""
            type="text"
            name="ingredient-unit-${this._parentElementIngredients.childElementCount + 1}"
            placeholder="Unit"
          />
          <input
            value=""
            type="text"
            name="ingredient-description-${this._parentElementIngredients.childElementCount + 1}"
            placeholder="Description"
          />
      </div>
    </div>`
    }

    renderIngredient(){
      const HTML = this._generateIngredientHTML();
      this._parentElementIngredients.insertAdjacentHTML("beforeend", HTML);
  };

    removeIngredient(){
      if (this._parentElementIngredients.childElementCount <= 1) return;
      const lastIngredient = this._parentElementIngredients.lastElementChild;
      lastIngredient.remove();
  };

  setParentElementIngredients(){
    this._parentElementIngredients = document.querySelector('.upload__column--ingredients-section');
  }


}

export default new UserRecipeView