import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Customer } from './customer.js';
import { Ingredient } from './ingredient.js';
import { Pizza } from './pizza.js';

export class Game {
    constructor(scene, camera, soundManager, ui) {
        this.scene = scene;
        this.camera = camera;
        this.soundManager = soundManager;
        this.ui = ui;
        
        this.isGameActive = false;
        this.score = 0;
        this.day = 1;
        this.money = 100;
        this.customers = [];
        this.currentCustomer = null;
        this.customerQueue = [];
        this.maxCustomersPerDay = 5;
        this.servedCustomers = 0;
        
        // Ingredients
        this.availableIngredients = [
            { id: 'dough', name: 'Dough', type: 'base', price: 1, model: 'dough.glb' },
            { id: 'tomato_sauce', name: 'Tomato Sauce', type: 'sauce', price: 0.5, model: 'tomato_sauce.glb' },
            { id: 'cheese', name: 'Cheese', type: 'topping', price: 1, model: 'cheese.glb' },
            { id: 'salami', name: 'Dominican Salami', type: 'topping', price: 2, model: 'salami.glb' },
            { id: 'corn', name: 'Corn', type: 'topping', price: 0.75, model: 'corn.glb' },
            { id: 'onion', name: 'Onion', type: 'topping', price: 0.5, model: 'onion.glb' },
            { id: 'bell_pepper', name: 'Bell Pepper', type: 'topping', price: 0.5, model: 'bell_pepper.glb' },
            { id: 'pineapple', name: 'Pineapple', type: 'topping', price: 1, model: 'pineapple.glb' },
            { id: 'oregano', name: 'Oregano', type: 'topping', price: 0.25, model: 'oregano.glb' }
        ];
        
        // Pizza recipes
        this.recipes = [
            {
                name: 'Classic Dominican Pizza',
                ingredients: ['dough', 'tomato_sauce', 'cheese', 'salami', 'oregano'],
                description: 'Local favorite with Dominican salami',
                price: 10
            },
            {
                name: 'Tropical Pizza',
                ingredients: ['dough', 'tomato_sauce', 'cheese', 'pineapple', 'salami'],
                description: 'Sweet and savory, a Caribbean flavor',
                price: 12
            },
            {
                name: 'Vegetarian Pizza',
                ingredients: ['dough', 'tomato_sauce', 'cheese', 'corn', 'bell_pepper', 'onion'],
                description: 'Loaded with fresh veggies',
                price: 11
            }
        ];
        
        this.currentPizza = null;
        this.selectedIngredients = [];
        
        // Kitchen setup
        this.setupKitchen();
    }
    
    setupKitchen() {
        // Create kitchen counter
        const counterGeometry = new THREE.BoxGeometry(10, 1, 5);
        const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        this.counter = new THREE.Mesh(counterGeometry, counterMaterial);
        this.counter.position.y = -0.5;
        this.counter.receiveShadow = true;
        this.scene.add(this.counter);
        
        // Create pizza preparation area
        const prepAreaGeometry = new THREE.CircleGeometry(2, 32);
        const prepAreaMaterial = new THREE.MeshStandardMaterial({ color: 0xEEEEEE });
        this.prepArea = new THREE.Mesh(prepAreaGeometry, prepAreaMaterial);
        this.prepArea.rotation.x = -Math.PI / 2;
        this.prepArea.position.set(0, 0.01, 0);
        this.prepArea.receiveShadow = true;
        this.scene.add(this.prepArea);
        
        // Setup ingredient stations
        this.setupIngredientStations();
        
        // Add background elements to create a Dominican pizzeria atmosphere
        this.setupEnvironment();
    }
    
    setupIngredientStations() {
        const stationRadius = 2.8; // Place closer to the center of the table
        const totalIngredients = this.availableIngredients.length;
        const yPos = 0.6; // Height above the table
        this.ingredientObjects = [];

        for (let i = 0; i < totalIngredients; i++) {
            const angle = (i / totalIngredients) * Math.PI * 2;
            const x = Math.cos(angle) * stationRadius;
            const z = Math.sin(angle) * stationRadius;

            const ingredient = this.availableIngredients[i];

            // Use Ingredient class for visuals
            const IngredientClass = require('./ingredient.js');
            const ingredientObj = new IngredientClass.Ingredient(
                this.scene,
                ingredient.id,
                ingredient.name,
                ingredient.type,
                ingredient.price,
                new THREE.Vector3(x, yPos, z)
            );

            // Add the mesh (first child) for raycasting
            if (ingredientObj.ingredientGroup.children.length > 0) {
                this.ingredientObjects.push(ingredientObj.ingredientGroup.children[0]);
            }
        }

        // Setup raycaster for ingredient selection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Add event listener for ingredient selection
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));
    }
    
    setupEnvironment() {
        // Add a floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x999999,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Add Dominican flag colors to the walls
        this.addWall(0, 2, -10, 20, 6, 0.2, 0x002D62); // Blue
        this.addWall(-10, 2, 0, 0.2, 6, 20, 0xCE1126); // Red
        this.addWall(10, 2, 0, 0.2, 6, 20, 0xCE1126); // Red
        this.addWall(0, 2, 10, 20, 6, 0.2, 0x002D62); // Blue
        
        // Add a simple skybox
        const skyGeometry = new THREE.BoxGeometry(100, 100, 100);
        const skyMaterials = [
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // right
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // left
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // top
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // bottom
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // front
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide })  // back
        ];
        const skybox = new THREE.Mesh(skyGeometry, skyMaterials);
        this.scene.add(skybox);
    }
    
    addWall(x, y, z, width, height, depth, color) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x, y, z);
        wall.receiveShadow = true;
        wall.castShadow = true;
        this.scene.add(wall);
    }
    
    getRandomColor() {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    onPointerDown(event) {
        console.log('Pointer down event:', event.clientX, event.clientY);
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.ingredientObjects, false);
        console.log('Intersected ingredient objects:', intersects);
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            console.log('Clicked object:', obj.userData);
            if (obj.userData && obj.userData.type === 'ingredient') {
                this.addIngredientToPizza(obj.userData.id);
            }
        }
        // Check if we clicked on the pizza to cook it
        if (this.prepArea) {
            const prepIntersects = this.raycaster.intersectObject(this.prepArea);
            console.log('Intersected prep area:', prepIntersects);
            if (prepIntersects.length > 0 && this.currentPizza) {
                this.cookPizza();
            }
        }
    }
    
    addIngredientToPizza(ingredientId) {
        if (!this.currentPizza) {
            // If no pizza dough exists yet, check if the selected ingredient is dough
            if (ingredientId === 'dough') {
                this.currentPizza = new Pizza(this.scene);
                this.selectedIngredients.push(ingredientId);
                this.ui.updateIngredientsList(this.selectedIngredients, this.availableIngredients);
                this.soundManager.playSound('dough');
            } else {
                this.ui.showMessage('You need to add dough first!');
            }
        } else {
            // Add ingredient to existing pizza
            if (ingredientId !== 'dough') {
                this.selectedIngredients.push(ingredientId);
                this.currentPizza.addIngredient(ingredientId);
                this.ui.updateIngredientsList(this.selectedIngredients, this.availableIngredients);
                this.soundManager.playSound('ingredient');
            } else {
                this.ui.showMessage('You already have dough!');
            }
        }
    }
    
    cookPizza() {
        if (!this.currentPizza) {
            this.ui.showMessage('No pizza to cook!');
            return;
        }
        
        if (this.selectedIngredients.length < 3) {
            this.ui.showMessage('You need more ingredients!');
            return;
        }
        
        this.soundManager.playSound('oven');
        this.ui.showMessage('Cooking pizza!');
        
        // Simulate cooking time
        setTimeout(() => {
            this.servePizza();
        }, 2000);
    }
    
    servePizza() {
        if (!this.currentCustomer) {
            this.ui.showMessage('No customer waiting!');
            return;
        }
        
        // Check if the pizza matches what the customer wanted
        const customerSatisfaction = this.currentCustomer.evaluatePizza(this.selectedIngredients);
        const tipAmount = Math.floor(customerSatisfaction * 5);
        const basePrice = 8; // Base price for any pizza
        
        // Calculate earnings based on ingredients and satisfaction
        const earnings = basePrice + tipAmount;
        this.money += earnings;
        
        // Update UI with earnings
        this.ui.showMessage(`Customer satisfied! You earned $${earnings}`);
        this.ui.updateMoney(this.money);
        
        // Reset pizza
        if (this.currentPizza) {
            this.currentPizza.remove();
            this.currentPizza = null;
        }
        this.selectedIngredients = [];
        this.ui.updateIngredientsList(this.selectedIngredients, this.availableIngredients);
        
        // Customer leaves
        this.currentCustomer.leave();
        this.servedCustomers++;
        
        // Check if day is complete
        if (this.servedCustomers >= this.maxCustomersPerDay) {
            this.endDay();
        } else {
            // Get next customer
            setTimeout(() => {
                this.getNextCustomer();
            }, 2000);
        }
    }
    
    getNextCustomer() {
        if (this.customerQueue.length === 0) {
            this.generateCustomers();
        }
        
        this.currentCustomer = this.customerQueue.shift();
        this.currentCustomer.enter();
        
        // Show customer order
        const orderText = this.currentCustomer.getOrderText();
        this.ui.showCustomerOrder(orderText);
    }
    
    generateCustomers() {
        // Generate new customers for the day
        const numCustomers = Math.min(5, this.maxCustomersPerDay - this.servedCustomers);
        
        for (let i = 0; i < numCustomers; i++) {
            const customer = new Customer(this.scene, this.recipes);
            this.customerQueue.push(customer);
        }
    }
    
    endDay() {
        this.day++;
        this.servedCustomers = 0;
        this.ui.showMessage(`End of day ${this.day - 1}! Total money: $${this.money}`);
        
        // Increase difficulty
        this.maxCustomersPerDay = Math.min(10, this.maxCustomersPerDay + 1);
        
        // Start new day after a delay
        setTimeout(() => {
            this.ui.showMessage(`Day ${this.day}! Get ready for customers`);
            this.getNextCustomer();
        }, 3000);
    }
    
    start() {
        this.isGameActive = true;
        this.ui.showGameUI();
        this.ui.updateDay(this.day);
        this.ui.updateMoney(this.money);
        
        // Start with first customer
        this.getNextCustomer();
    }
    
    update() {
        // Update any animations or time-based game logic here
        if (this.currentCustomer) {
            this.currentCustomer.update();
        }
    }
}
