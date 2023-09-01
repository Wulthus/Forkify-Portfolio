import View from './View.js';
import PreviewView from './previewView.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = "No recipes found for your query! Please try another query ;)"

    _generateHTML() {
      return this._data.map(result => PreviewView.render(result, false)).join('')
      
    };


}

export default new ResultsView