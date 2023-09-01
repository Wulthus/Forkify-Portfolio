import View from './View.js';
import PreviewView from './previewView.js';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
    _message = '';

    _generateHTML() {
      return this._data.map(bookmark => PreviewView.render(bookmark, false)).join('')

    };

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }


}

export default new BookmarksView;