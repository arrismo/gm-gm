import * as THREE from 'three';

export class Customer {
    constructor(scene, recipes) {
        this.scene = scene;
        this.recipes = recipes;
        this.customerGroup = new THREE.Group();
        this.scene.add(this.customerGroup);
        
        // Customer position (off-screen initially)
        this.customerGroup.position.set(0, 0, -5);
        
        // Select a random recipe as the order
        this.order = this.selectRandomOrder();
        
        // Create customer visual representation
        this.createCustomerVisual();
        
        // Animation properties
        this.isEntering = false;
        this.isLeaving = false;
        this.animationProgress = 0;
    }
    
    selectRandomOrder() {
        // Select a random recipe from available recipes
        return this.recipes[Math.floor(Math.random() * this.recipes.length)];
    }
    
    createCustomerVisual() {
        // Create a simple character representation
        // In a full game, this would be replaced with proper character models
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.3, 1.5, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: this.getRandomColor(),
            roughness: 0.7,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        body.castShadow = true;
        body.receiveShadow = true;
        this.customerGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD3B6,  // Skin tone
            roughness: 0.8,
            metalness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.85;
        head.castShadow = true;
        head.receiveShadow = true;
        this.customerGroup.add(head);
        
        // Eyes
        this.createEye(-0.15, 1.95, 0.35);
        this.createEye(0.15, 1.95, 0.35);
        
        // Mouth
        const mouthGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.75, 0.38);
        this.customerGroup.add(mouth);
        
        // Hat (Dominican style cap)
        this.addDominicanHat();
        
        // Speech bubble to show order
        this.createSpeechBubble();
    }
    
    createEye(x, y, z) {
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(x, y, z);
        this.customerGroup.add(eye);
    }
    
    addDominicanHat() {
        // Create a cap with Dominican flag colors
        const capGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.15, 16);
        const capMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x002D62,  // Blue from Dominican flag
            roughness: 0.7,
            metalness: 0.1
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 2.15;
        cap.castShadow = true;
        cap.receiveShadow = true;
        this.customerGroup.add(cap);
        
        // Add red stripe
        const stripeGeometry = new THREE.BoxGeometry(0.85, 0.05, 0.2);
        const stripeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xCE1126,  // Red from Dominican flag
            roughness: 0.7,
            metalness: 0.1
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 2.15, 0.3);
        stripe.castShadow = true;
        stripe.receiveShadow = true;
        this.customerGroup.add(stripe);
        
        // Add cap bill
        const billGeometry = new THREE.BoxGeometry(0.85, 0.05, 0.5);
        const billMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x002D62,
            roughness: 0.7,
            metalness: 0.1
        });
        const bill = new THREE.Mesh(billGeometry, billMaterial);
        bill.position.set(0, 2.08, 0.5);
        bill.rotation.x = -0.2;
        bill.castShadow = true;
        bill.receiveShadow = true;
        this.customerGroup.add(bill);
    }
    
    createSpeechBubble() {
        // Create a simple speech bubble
        const bubbleGeometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
        const bubbleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        });
        this.speechBubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        this.speechBubble.position.set(0.8, 2.3, 0);
        this.speechBubble.rotation.y = -Math.PI / 4;
        this.speechBubble.visible = false;
        this.customerGroup.add(this.speechBubble);
        
        // Add a small triangle to connect the bubble to the character
        const triangleGeometry = new THREE.ConeGeometry(0.2, 0.4, 3);
        const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
        triangle.position.set(0.5, 2.1, 0);
        triangle.rotation.z = Math.PI / 2;
        triangle.rotation.y = -Math.PI / 4;
        triangle.visible = false;
        this.customerGroup.add(triangle);
        
        // Store reference to triangle
        this.speechTriangle = triangle;
    }
    
    enter() {
        // Start enter animation
        this.isEntering = true;
        this.isLeaving = false;
        this.animationProgress = 0;
        
        // Show speech bubble
        setTimeout(() => {
            this.speechBubble.visible = true;
            this.speechTriangle.visible = true;
        }, 1000);
    }
    
    leave() {
        // Start leave animation
        this.isLeaving = true;
        this.isEntering = false;
        this.animationProgress = 0;
        
        // Hide speech bubble
        this.speechBubble.visible = false;
        this.speechTriangle.visible = false;
    }
    
    update() {
        // Handle animations
        if (this.isEntering) {
            this.animationProgress += 0.02;
            if (this.animationProgress >= 1) {
                this.animationProgress = 1;
                this.isEntering = false;
            }
            
            // Move from off-screen to counter position
            const targetZ = 5;
            this.customerGroup.position.z = -5 + (targetZ + 5) * this.animationProgress;
        }
        
        if (this.isLeaving) {
            this.animationProgress += 0.02;
            if (this.animationProgress >= 1) {
                this.animationProgress = 1;
                this.isLeaving = false;
                
                // Remove customer from scene
                this.remove();
            }
            
            // Move from counter position to off-screen
            const startZ = 5;
            this.customerGroup.position.z = startZ + (5 + startZ) * this.animationProgress;
        }
    }
    
    getOrderText() {
        // Get the order text to display in UI
        return `"I want a ${this.order.name}! ${this.order.description}"`;
    }
    
    evaluatePizza(ingredients) {
        // Compare the ingredients in the pizza with the order
        const orderIngredients = this.order.ingredients;
        
        // Count matching ingredients
        let matchCount = 0;
        for (const ingredient of orderIngredients) {
            if (ingredients.includes(ingredient)) {
                matchCount++;
            }
        }
        
        // Calculate base satisfaction (0 to 1)
        let satisfaction = matchCount / orderIngredients.length;
        
        // Penalize for extra ingredients
        const extraIngredients = ingredients.filter(ing => !orderIngredients.includes(ing));
        satisfaction -= (extraIngredients.length * 0.1);
        
        // Ensure satisfaction is between 0 and 1
        satisfaction = Math.max(0, Math.min(1, satisfaction));
        
        return satisfaction;
    }
    
    getRandomColor() {
        // Generate a random color for customer clothing
        const colors = [
            0x3498db, // Blue
            0xe74c3c, // Red
            0x2ecc71, // Green
            0xf1c40f, // Yellow
            0x9b59b6, // Purple
            0x1abc9c, // Teal
            0xd35400  // Orange
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    remove() {
        // Remove customer from scene
        this.scene.remove(this.customerGroup);
        
        // Dispose of geometries and materials
        this.customerGroup.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        });
    }
    
    addToScene(scene, position) {
        // Make the customer face the center of the table (0, 0, 0)
        this.customerGroup.position.copy(position);
        this.customerGroup.lookAt(new THREE.Vector3(0, position.y, 0));
        scene.add(this.customerGroup);
    }
}
