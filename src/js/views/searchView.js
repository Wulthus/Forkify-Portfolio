import View from './View.js';

class SearchView extends View {
    _parentElement = document.querySelector('.search');
    getQuery(){
      const query = this._parentElement.querySelector('.search__field').value;
      this._clearField();
      return query;
    }
  
    addHandlerSearch(handler){
      this._parentElement.addEventListener('submit', function(e){
        e.preventDefault();
        handler();
      });
    }

    _clearField(){
        this._parentElement.querySelector('.search__field').value = '';
    }
  }
  
  export default new SearchView();