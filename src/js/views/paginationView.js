import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    _generateHTML(){
        const numberOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currentPage = this._data.page;
        if (this._data.page === 1 && numberOfPages > 1) {
            return this._generateButtonHTML('prev', 'hidden') +this._generatePageHTML() + this._generateButtonHTML('next');
        };
        if (this._data.page === numberOfPages && numberOfPages > 1) {
            return this._generateButtonHTML('prev') + this._generatePageHTML() + this._generateButtonHTML('next', 'hidden');
        }
        if (this._data.page < numberOfPages) {
            return (this._generateButtonHTML('prev') + this._generatePageHTML() + this._generateButtonHTML('next'));
        }
        return ``;
    };

    _generateButtonHTML(string, className = ''){
        return `          
        <button data-goto="${string === "next" ? (this._data.page + 1) : (this._data.page - 1)}" class="btn--inline pagination__btn--${string} ${className}">
            <span>Page ${string === "next" ? (this._data.page + 1) : (this._data.page - 1)}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${string === "next" ? "right" : "left"}"></use>
            </svg>
        </button>`
    }

    _generatePageHTML(){
        return `          
        <div class="pagination-page_display">
            <span>${this._data.page} / ${Math.ceil(this._data.results.length / this._data.resultsPerPage)}</span>
        </div>`
    }

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
          const button = e.target.closest('.btn--inline');
          if(!button) return;
          const goToPage = +button.dataset.goto;
          handler(goToPage);
        });
      }
}

export default new PaginationView()