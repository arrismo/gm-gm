export class UI {
    constructor() {
        this.uiContainer = document.getElementById('ui-container');
        this.messageTimeout = null;
        
        // Create UI elements
        this.createGameUI();
    }
    
    createGameUI() {
        // Create stats panel (money, day, etc.)
        this.statsPanel = document.createElement('div');
        this.statsPanel.className = 'ui-element';
        this.statsPanel.style.position = 'absolute';
        this.statsPanel.style.top = '10px';
        this.statsPanel.style.left = '10px';
        this.statsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.statsPanel.style.color = 'white';
        this.statsPanel.style.padding = '10px';
        this.statsPanel.style.borderRadius = '5px';
        this.statsPanel.style.display = 'none';
        this.uiContainer.appendChild(this.statsPanel);
        
        // Create day display
        this.dayDisplay = document.createElement('div');
        this.dayDisplay.textContent = 'Day: 1';
        this.statsPanel.appendChild(this.dayDisplay);
        
        // Create money display
        this.moneyDisplay = document.createElement('div');
        this.moneyDisplay.textContent = 'Money: $100';
        this.statsPanel.appendChild(this.moneyDisplay);
        
        // Create message panel
        this.messagePanel = document.createElement('div');
        this.messagePanel.className = 'ui-element';
        this.messagePanel.style.position = 'absolute';
        this.messagePanel.style.bottom = '20px';
        this.messagePanel.style.left = '50%';
        this.messagePanel.style.transform = 'translateX(-50%)';
        this.messagePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.messagePanel.style.color = 'white';
        this.messagePanel.style.padding = '15px';
        this.messagePanel.style.borderRadius = '5px';
        this.messagePanel.style.fontSize = '18px';
        this.messagePanel.style.textAlign = 'center';
        this.messagePanel.style.display = 'none';
        this.uiContainer.appendChild(this.messagePanel);
        
        // Create customer order panel
        this.orderPanel = document.createElement('div');
        this.orderPanel.className = 'ui-element';
        this.orderPanel.style.position = 'absolute';
        this.orderPanel.style.top = '10px';
        this.orderPanel.style.right = '10px';
        this.orderPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.orderPanel.style.color = 'white';
        this.orderPanel.style.padding = '15px';
        this.orderPanel.style.borderRadius = '5px';
        this.orderPanel.style.maxWidth = '300px';
        this.orderPanel.style.display = 'none';
        this.uiContainer.appendChild(this.orderPanel);
        
        // Create ingredients list panel
        this.ingredientsPanel = document.createElement('div');
        this.ingredientsPanel.className = 'ui-element';
        this.ingredientsPanel.style.position = 'absolute';
        this.ingredientsPanel.style.bottom = '80px';
        this.ingredientsPanel.style.left = '10px';
        this.ingredientsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.ingredientsPanel.style.color = 'white';
        this.ingredientsPanel.style.padding = '10px';
        this.ingredientsPanel.style.borderRadius = '5px';
        this.ingredientsPanel.style.display = 'none';
        this.ingredientsPanel.innerHTML = '<h3>Ingredients:</h3><ul id="ingredients-list"></ul>';
        this.uiContainer.appendChild(this.ingredientsPanel);
        
        // Create cook button
        this.cookButton = document.createElement('button');
        this.cookButton.className = 'ui-element';
        this.cookButton.textContent = 'Cook Pizza!';
        this.cookButton.style.position = 'absolute';
        this.cookButton.style.bottom = '20px';
        this.cookButton.style.right = '20px';
        this.cookButton.style.padding = '15px 30px';
        this.cookButton.style.backgroundColor = '#e63946';
        this.cookButton.style.color = 'white';
        this.cookButton.style.border = 'none';
        this.cookButton.style.borderRadius = '5px';
        this.cookButton.style.fontSize = '18px';
        this.cookButton.style.cursor = 'pointer';
        this.cookButton.style.display = 'none';
        this.uiContainer.appendChild(this.cookButton);
        
        // Add Dominican flag colors as accent
        const flagAccent = document.createElement('div');
        flagAccent.style.position = 'absolute';
        flagAccent.style.top = '0';
        flagAccent.style.left = '0';
        flagAccent.style.width = '100%';
        flagAccent.style.height = '5px';
        flagAccent.style.background = 'linear-gradient(to right, #002D62 33%, white 33%, white 66%, #CE1126 66%)';
        flagAccent.style.zIndex = '100';
        this.uiContainer.appendChild(flagAccent);
    }
    
    showGameUI() {
        this.statsPanel.style.display = 'block';
        this.ingredientsPanel.style.display = 'block';
        this.cookButton.style.display = 'block';
        
        // Add click event for cook button
        this.cookButton.addEventListener('click', () => {
            // This will be handled by the game's raycaster/pointer events
            // We're simulating a click on the prep area
            const clickEvent = new MouseEvent('pointerdown', {
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2
            });
            document.dispatchEvent(clickEvent);
        });
    }
    
    updateDay(day) {
        this.dayDisplay.textContent = `Day: ${day}`;
    }
    
    updateMoney(money) {
        this.moneyDisplay.textContent = `Money: $${money}`;
    }
    
    showMessage(message) {
        this.messagePanel.textContent = message;
        this.messagePanel.style.display = 'block';
        
        // Clear any existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Hide message after 3 seconds
        this.messageTimeout = setTimeout(() => {
            this.messagePanel.style.display = 'none';
        }, 3000);
    }
    
    showCustomerOrder(orderText) {
        this.orderPanel.innerHTML = `
            <h3>Customer Order:</h3>
            <p>${orderText}</p>
        `;
        this.orderPanel.style.display = 'block';
    }
    
    updateIngredientsList(selectedIngredients, availableIngredients) {
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        
        if (selectedIngredients.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No ingredients selected';
            ingredientsList.appendChild(listItem);
            return;
        }
        
        // Map ingredient IDs to names
        const ingredientMap = {};
        availableIngredients.forEach(ing => {
            ingredientMap[ing.id] = ing.name;
        });
        
        // Add each ingredient to the list
        selectedIngredients.forEach(ingId => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredientMap[ingId] || ingId;
            ingredientsList.appendChild(listItem);
        });
    }
    
    hideCustomerOrder() {
        this.orderPanel.style.display = 'none';
    }
}
