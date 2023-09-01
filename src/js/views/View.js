import icons from 'url:../../img/icons.svg';

export default class View {

    _data;

/**
 * Render object to the DOM based on recieved data
 * @param {Object | Object[]} recievedData Data to be rendered
 * @param {boolean} [render=true] if false, function will create the markup string WITHOUT rendering it to the DOM.
 * @returns {undefined | string} Returns HTML in string, if render=false
 * @this {Object} Points to an instance of the "View" class
 * @author Wulthus
 * @todo Nothin'
 */
    render(recievedData, render = true){

        if(!recievedData || Array.isArray(recievedData) && recievedData.length === 0) return this.renderError();

        this._data = recievedData;
        const HTML = this._generateHTML();

        if(!render) return HTML;
        this._clear(this._parentElement);

        this._parentElement.insertAdjacentHTML("afterbegin", HTML);
    };

    update(recievedData){
      this._data = recievedData;
      const newHTML = this._generateHTML();
      const newDom = document.createRange().createContextualFragment(newHTML);
      const newElements = Array.from(newDom.querySelectorAll('*'));
      const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newElement, index) => {
        const currentElement = currentElements[index];

       if(!newElement.isEqualNode(currentElement) && newElement.firstChild?.nodeValue.trim() !== ''){
        
        currentElement.textContent = newElement.textContent;
      };
        if(!newElement.isEqualNode(currentElement)){
          Array.from(newElement.attributes).forEach(attribute => currentElement.setAttribute(attribute.name, attribute.value))
        }
       
      })

    }

    _clear(element){
        element.innerHTML = '';
    };

    renderSpinner(){
        const spinnerHTML = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear(this._parentElement);
        this._parentElement.insertAdjacentHTML('afterbegin', spinnerHTML);
      }

    renderError(errorMessage = this._errorMessage){
        const errorHTML = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${errorMessage}</p>
      </div> `;

      this._clear(this._parentElement);
      this._parentElement.insertAdjacentHTML('afterbegin', errorHTML);
      }

    renderMessage(message = this._message){
        const messageHTML = `<div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> `;

      this._clear(this._parentElement);
      this._parentElement.insertAdjacentHTML('afterbegin', messageHTML);
    }


};