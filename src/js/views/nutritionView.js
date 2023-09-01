import View from './View.js';


class NutritionView extends View {
    _parentElement = document.querySelector('.nutrition__data');
    _window = document.querySelector('.nutrition-window');
    _overlay = document.querySelector('.overlay');
    _closeButton = this._window.querySelector('.btn--close-modal');
    _errorMessage = 'No data was found for that ingridient. Try another ingredient!'

    constructor(){
        super();
        this._addHandlerCloseWindow();
    }

    _addHandlerCloseWindow(){
        this._closeButton.addEventListener('click', function(){
            this._window.classList.add('hidden');
            this._overlay.classList.add('hidden');
        }.bind(this));

        this._overlay.addEventListener('click', function(){
            this._window.classList.add('hidden');
            this._overlay.classList.add('hidden');
        }.bind(this));
    };

    _generateHTML(){
        return `      
        <h2 class="nutrition__name">${this._data.name.toUpperCase()}</h2>
        <div class="nutrition__calories">
          <h3 class="nutrition__calories--title">1.Caloric Breakdown</h3>
          <div class="nutrition__calories--container">
            <div class="nutrition__percentage--box">
              <h4 class="nutrition__percentage--title">Carbohydrates:</h4>
              <span class="nutrition__percentage--text">${this._data.nutrition.caloricBreakdown.percentCarbs}%</span>
            </div>
            <div class="nutrition__percentage--box">
              <h4 class="nutrition__percentage--title">Fat:</h4>
              <span class="nutrition__percentage--text">${this._data.nutrition.caloricBreakdown.percentFat}%</span>
            </div>
            <div class="nutrition__percentage--box">
              <h4 class="nutrition__percentage--title">Protein:</h4>
              <span class="nutrition__percentage--text">${this._data.nutrition.caloricBreakdown.percentProtein}%</span>
            </div>
          </div>
        </div>
        <div class="nutrition__nutrients">
          <h3 class="nutrition__calories--title">2.Nutrients</h3>
          <div class="nutrition__nutrients--table-box">
            <table class="nutrition__nutrients-table">
                <thead class="nutrition__nutrients--nutrient nutrition__nutrients--headers"> 
                    <th class="nutrition__nutrients--header">Name</th>
                    <th class="nutrition__nutrients--header">Amount</th>
                    <th class="nutrition__nutrients--header">Unit</th>
                    <th class="nutrition__nutrients--header">Daily Need</th>
                </thead>
                <tbody>
                ${this._data.nutrition.nutrients.map(nutrient => nutrient.amount>0 ? this.generateNutrientHTML(nutrient): '').join('')}
                </tbody>
            </table>
          </div>
        </div>`
    }

    

    generateNutrientHTML(nutrient){
        return `            
        <tr class="nutrition__nutrients--nutrient">
            <td class="nutrition__nutrients--data">${nutrient.name}</td>
            <td class="nutrition__nutrients--data">${nutrient.amount}</td>
            <td class="nutrition__nutrients--data">${nutrient.unit}</td>
            <td class="nutrition__nutrients--data">${nutrient.percentOfDailyNeeds}%</td>
        </tr>`
    }


}

export default new NutritionView;