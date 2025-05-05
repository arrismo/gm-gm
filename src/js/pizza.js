import * as THREE from 'three';

export class Pizza {
    constructor(scene) {
        this.scene = scene;
        this.ingredients = [];
        this.pizzaGroup = new THREE.Group();
        this.scene.add(this.pizzaGroup);
        
        // Create the pizza base (dough)
        this.createBase();
    }
    
    createBase() {
        // Create pizza dough geometry
        const doughGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
        const doughMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE2C58D,
            roughness: 0.8,
            metalness: 0.1
        });
        this.dough = new THREE.Mesh(doughGeometry, doughMaterial);
        this.dough.rotation.x = Math.PI / 2;
        this.dough.position.y = 0.05;
        this.dough.castShadow = true;
        this.dough.receiveShadow = true;
        
        // Create pizza crust geometry
        const crustGeometry = new THREE.TorusGeometry(1.8, 0.2, 16, 100);
        const crustMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xD4A76A,
            roughness: 0.7,
            metalness: 0.1
        });
        this.crust = new THREE.Mesh(crustGeometry, crustMaterial);
        this.crust.position.y = 0.1;
        this.crust.castShadow = true;
        this.crust.receiveShadow = true;
        
        // Add to pizza group
        this.pizzaGroup.add(this.dough);
        this.pizzaGroup.add(this.crust);
    }
    
    addIngredient(ingredientId) {
        // Add ingredient to the list
        this.ingredients.push(ingredientId);
        
        // Visualize the ingredient on the pizza
        switch(ingredientId) {
            case 'tomato_sauce':
                this.addTomatoSauce();
                break;
            case 'cheese':
                this.addCheese();
                break;
            case 'salami':
                this.addSalami();
                break;
            case 'corn':
                this.addCorn();
                break;
            case 'onion':
                this.addOnion();
                break;
            case 'bell_pepper':
                this.addBellPepper();
                break;
            case 'pineapple':
                this.addPineapple();
                break;
            case 'oregano':
                this.addOregano();
                break;
            default:
                console.log(`Unknown ingredient: ${ingredientId}`);
        }
    }
    
    addTomatoSauce() {
        // Create tomato sauce geometry
        const sauceGeometry = new THREE.CylinderGeometry(1.75, 1.75, 0.05, 32);
        const sauceMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xC92D1C,
            roughness: 0.9,
            metalness: 0.0
        });
        const sauce = new THREE.Mesh(sauceGeometry, sauceMaterial);
        sauce.rotation.x = Math.PI / 2;
        sauce.position.y = 0.11;
        sauce.castShadow = true;
        sauce.receiveShadow = true;
        
        this.pizzaGroup.add(sauce);
    }
    
    addCheese() {
        // Create cheese geometry with a slightly bumpy texture
        const cheeseGeometry = new THREE.CylinderGeometry(1.75, 1.75, 0.07, 32);
        const cheeseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xF3CA60,
            roughness: 0.8,
            metalness: 0.1
        });
        const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
        cheese.rotation.x = Math.PI / 2;
        cheese.position.y = 0.16;
        cheese.castShadow = true;
        cheese.receiveShadow = true;
        
        // Add some texture to the cheese
        this.addCheeseDetails(cheese);
        
        this.pizzaGroup.add(cheese);
    }
    
    addCheeseDetails(cheese) {
        // Add small bumps to represent melted cheese texture
        for (let i = 0; i < 30; i++) {
            const r = Math.random() * 1.6;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const bumpGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 8, 8);
            const bumpMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xF7D78B,
                roughness: 0.7,
                metalness: 0.2
            });
            const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
            bump.position.set(x, 0.2, z);
            bump.castShadow = true;
            bump.receiveShadow = true;
            
            this.pizzaGroup.add(bump);
        }
    }
    
    addSalami() {
        // Add Dominican salami slices
        const salamiCount = 12 + Math.floor(Math.random() * 8);
        
        for (let i = 0; i < salamiCount; i++) {
            const r = Math.random() * 1.5;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const salamiGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16);
            const salamiMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xAA2E25,
                roughness: 0.7,
                metalness: 0.1
            });
            const salami = new THREE.Mesh(salamiGeometry, salamiMaterial);
            salami.rotation.x = Math.PI / 2;
            salami.position.set(x, 0.23, z);
            salami.castShadow = true;
            salami.receiveShadow = true;
            
            // Add fat spots to salami
            this.addSalamiFatSpots(salami);
            
            this.pizzaGroup.add(salami);
        }
    }
    
    addSalamiFatSpots(salami) {
        // Add white spots to represent fat in the salami
        const spotCount = 3 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < spotCount; i++) {
            const r = Math.random() * 0.15;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const spotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
            const spotMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xF0E0D0,
                roughness: 0.7,
                metalness: 0.1
            });
            const spot = new THREE.Mesh(spotGeometry, spotMaterial);
            spot.position.set(x, 0.23, z);
            
            salami.add(spot);
        }
    }
    
    addCorn() {
        // Add corn kernels
        const cornCount = 40 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < cornCount; i++) {
            const r = Math.random() * 1.6;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const cornGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const cornMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFD700,
                roughness: 0.6,
                metalness: 0.2
            });
            const corn = new THREE.Mesh(cornGeometry, cornMaterial);
            corn.position.set(x, 0.23, z);
            corn.castShadow = true;
            corn.receiveShadow = true;
            
            this.pizzaGroup.add(corn);
        }
    }
    
    addOnion() {
        // Add onion slices
        const onionCount = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < onionCount; i++) {
            const r = Math.random() * 1.6;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const onionGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
            const onionMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xF0F0F0,
                roughness: 0.7,
                metalness: 0.1
            });
            const onion = new THREE.Mesh(onionGeometry, onionMaterial);
            onion.rotation.x = Math.PI / 2;
            onion.position.set(x, 0.23, z);
            onion.castShadow = true;
            onion.receiveShadow = true;
            
            this.pizzaGroup.add(onion);
        }
    }
    
    addBellPepper() {
        // Add bell pepper slices
        const pepperCount = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < pepperCount; i++) {
            const r = Math.random() * 1.6;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            // Randomly choose between red and green peppers
            const pepperColor = Math.random() > 0.5 ? 0x66BB6A : 0xE53935;
            
            const pepperGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16);
            const pepperMaterial = new THREE.MeshStandardMaterial({ 
                color: pepperColor,
                roughness: 0.7,
                metalness: 0.1
            });
            const pepper = new THREE.Mesh(pepperGeometry, pepperMaterial);
            pepper.rotation.x = Math.PI / 2;
            pepper.position.set(x, 0.23, z);
            pepper.castShadow = true;
            pepper.receiveShadow = true;
            
            this.pizzaGroup.add(pepper);
        }
    }
    
    addPineapple() {
        // Add pineapple chunks
        const pineappleCount = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < pineappleCount; i++) {
            const r = Math.random() * 1.6;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const pineappleGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.15);
            const pineappleMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFEB3B,
                roughness: 0.8,
                metalness: 0.1
            });
            const pineapple = new THREE.Mesh(pineappleGeometry, pineappleMaterial);
            pineapple.position.set(x, 0.23, z);
            pineapple.rotation.y = Math.random() * Math.PI;
            pineapple.castShadow = true;
            pineapple.receiveShadow = true;
            
            this.pizzaGroup.add(pineapple);
        }
    }
    
    addOregano() {
        // Add oregano flakes
        const oreganoCount = 60 + Math.floor(Math.random() * 40);
        
        for (let i = 0; i < oreganoCount; i++) {
            const r = Math.random() * 1.7;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            const oreganoGeometry = new THREE.BoxGeometry(0.03, 0.01, 0.03);
            const oreganoMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2E7D32,
                roughness: 0.9,
                metalness: 0.0
            });
            const oregano = new THREE.Mesh(oreganoGeometry, oreganoMaterial);
            oregano.position.set(x, 0.24, z);
            oregano.rotation.y = Math.random() * Math.PI;
            
            this.pizzaGroup.add(oregano);
        }
    }
    
    remove() {
        // Remove pizza from scene
        this.scene.remove(this.pizzaGroup);
        
        // Dispose of geometries and materials
        this.pizzaGroup.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        });
    }
}
