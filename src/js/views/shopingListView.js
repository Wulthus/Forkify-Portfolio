import icons from 'url:../../img/icons.svg';
import View from './View.js';

class shoppingListView extends View {
    _parentElement = document.querySelector('.shopping-list__list')
    _errorMessage = 'The list is empty. Find a nice recipe and add ingredients to the list :)'
    _list = this._parentElement.closest('.shopping-list');

    _generateHTML(){
        return `${this._data.map(ingredient => this._generateIngredientHTML(ingredient, ingredient.id)).join(' ')}`

    };

    _generateIngredientHTML(ingredient, id){
      return `<li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__text">
        <div class="recipe__quantity">${ingredient.quantity ? ingredient.quantity : ''}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unit ?? ''}</span>
          ${ingredient.description} 
        </div>
      </div>
      <button class="btn--tiny recipe__button--remove" data-ingredientid="${id}" title="Remove this ingredient from your shopping list">
      <svg>
        <use href="${icons}#icon-minus-circle"></use>
      </svg>
      </button>
    </li>`
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
}

addHandlerRemoveIngredient(handler) {
  this._parentElement.addEventListener('click', function(e){
    const removeIngredientBtn = e.target.closest('.recipe__button--remove');
    if (!removeIngredientBtn) return;
    const ingredientId = +removeIngredientBtn.dataset.ingredientid;
    removeIngredientBtn.closest('.recipe__ingredient').remove();
    handler(ingredientId);
  })
};

checkListLength(){
  const length = this._parentElement.childElementCount;
  if (length !== 0) return
  this.renderError();
}


addHandlerClearList(handler){
  this._list.addEventListener('click', function(e){
    const clearButton = e.target.closest('.shopping-list__clear-btn');
    if(!clearButton) return;
    this._clear(this._parentElement);
    this.checkListLength();
    handler();
   }.bind(this))

  }
};

export default new shoppingListView;