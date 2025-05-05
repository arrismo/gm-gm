import * as THREE from 'three';

export class Ingredient {
    constructor(scene, id, name, type, price, position) {
        this.scene = scene;
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.position = position;
        
        // Create the ingredient visual
        this.ingredientGroup = new THREE.Group();
        this.scene.add(this.ingredientGroup);
        this.ingredientGroup.position.copy(position);
        
        // Create the ingredient based on its type
        this.createVisual();
    }
    
    createVisual() {
        // Create a visual representation based on ingredient type
        switch(this.id) {
            case 'dough':
                this.createDough();
                break;
            case 'tomato_sauce':
                this.createTomatoSauce();
                break;
            case 'cheese':
                this.createCheese();
                break;
            case 'salami':
                this.createSalami();
                break;
            case 'corn':
                this.createCorn();
                break;
            case 'onion':
                this.createOnion();
                break;
            case 'bell_pepper':
                this.createBellPepper();
                break;
            case 'pineapple':
                this.createPineapple();
                break;
            case 'oregano':
                this.createOregano();
                break;
            default:
                this.createDefaultIngredient();
        }
        
        // Add name label (in a real implementation, this would be a sprite or HTML overlay)
        // For now, we'll just log the name
        console.log(`Created ingredient: ${this.name}`);
    }
    
    createDough() {
        // Create dough ball
        const doughGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const doughMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE2C58D,
            roughness: 0.8,
            metalness: 0.1
        });
        const dough = new THREE.Mesh(doughGeometry, doughMaterial);
        dough.castShadow = true;
        dough.receiveShadow = true;
        
        // Add to ingredient group
        this.ingredientGroup.add(dough);
        
        // Add a small flour dust effect
        const dustGeometry = new THREE.CircleGeometry(0.6, 16);
        const dustMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const dust = new THREE.Mesh(dustGeometry, dustMaterial);
        dust.rotation.x = -Math.PI / 2;
        dust.position.y = -0.39;
        
        this.ingredientGroup.add(dust);
    }
    
    createTomatoSauce() {
        // Create sauce container
        const containerGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.5, 16);
        const containerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x777777,
            roughness: 0.5,
            metalness: 0.7
        });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.castShadow = true;
        container.receiveShadow = true;
        
        // Create sauce top
        const sauceGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16);
        const sauceMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xC92D1C,
            roughness: 0.9,
            metalness: 0.0
        });
        const sauce = new THREE.Mesh(sauceGeometry, sauceMaterial);
        sauce.position.y = 0.25;
        sauce.castShadow = true;
        sauce.receiveShadow = true;
        
        // Add to ingredient group
        this.ingredientGroup.add(container);
        this.ingredientGroup.add(sauce);
    }
    
    createCheese() {
        // Create cheese block
        const cheeseGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
        const cheeseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xF3CA60,
            roughness: 0.8,
            metalness: 0.1
        });
        const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
        cheese.castShadow = true;
        cheese.receiveShadow = true;
        
        // Create cheese shreds on top
        for (let i = 0; i < 8; i++) {
            const shredGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.2);
            const shredMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xF7D78B,
                roughness: 0.7,
                metalness: 0.1
            });
            const shred = new THREE.Mesh(shredGeometry, shredMaterial);
            
            // Random position on top of cheese block
            const x = (Math.random() - 0.5) * 0.4;
            const z = (Math.random() - 0.5) * 0.4;
            shred.position.set(x, 0.15, z);
            shred.rotation.y = Math.random() * Math.PI;
            
            cheese.add(shred);
        }
        
        // Add to ingredient group
        this.ingredientGroup.add(cheese);
    }
    
    createSalami() {
        // Create salami stick
        const salamiGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
        const salamiMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xAA2E25,
            roughness: 0.7,
            metalness: 0.1
        });
        const salami = new THREE.Mesh(salamiGeometry, salamiMaterial);
        salami.castShadow = true;
        salami.receiveShadow = true;
        
        // Create salami slices
        const sliceCount = 3;
        const sliceHeight = 0.04;
        const sliceSpacing = 0.07;
        
        for (let i = 0; i < sliceCount; i++) {
            const sliceGeometry = new THREE.CylinderGeometry(0.2, 0.2, sliceHeight, 16);
            const sliceMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xAA2E25,
                roughness: 0.7,
                metalness: 0.1
            });
            const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
            
            // Position slices next to the salami stick
            slice.position.set(0.3, 0.3 - i * sliceSpacing, 0);
            slice.rotation.z = Math.PI / 2;
            
            // Add fat spots to salami slice
            this.addSalamiFatSpots(slice);
            
            this.ingredientGroup.add(slice);
        }
        
        // Add to ingredient group
        this.ingredientGroup.add(salami);
    }
    
    addSalamiFatSpots(slice) {
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
            spot.position.set(x, 0, z);
            
            slice.add(spot);
        }
    }
    
    createCorn() {
        // Create corn container
        const containerGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.4, 16);
        const containerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xDDDDDD,
            roughness: 0.5,
            metalness: 0.7
        });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.castShadow = true;
        container.receiveShadow = true;
        
        // Create corn kernels on top
        for (let i = 0; i < 20; i++) {
            const kernelGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const kernelMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFD700,
                roughness: 0.6,
                metalness: 0.2
            });
            const kernel = new THREE.Mesh(kernelGeometry, kernelMaterial);
            
            // Random position on top of container
            const r = Math.random() * 0.15;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            kernel.position.set(x, 0.25, z);
            
            this.ingredientGroup.add(kernel);
        }
        
        // Add to ingredient group
        this.ingredientGroup.add(container);
    }
    
    createOnion() {
        // Create onion
        const onionGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const onionMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xF0E0E0,
            roughness: 0.7,
            metalness: 0.1
        });
        const onion = new THREE.Mesh(onionGeometry, onionMaterial);
        onion.castShadow = true;
        onion.receiveShadow = true;
        
        // Create onion top
        const topGeometry = new THREE.ConeGeometry(0.1, 0.2, 16);
        const topMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xA0A0A0,
            roughness: 0.7,
            metalness: 0.1
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 0.3;
        
        // Create onion slices
        const sliceGeometry = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
        const sliceMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xF0F0F0,
            roughness: 0.7,
            metalness: 0.1
        });
        const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
        slice.position.set(0.4, 0, 0);
        slice.rotation.y = Math.PI / 2;
        
        // Add to ingredient group
        this.ingredientGroup.add(onion);
        this.ingredientGroup.add(top);
        this.ingredientGroup.add(slice);
    }
    
    createBellPepper() {
        // Create bell pepper
        const pepperGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        pepperGeometry.scale(1, 0.8, 1);
        
        // Randomly choose between red and green peppers
        const pepperColor = Math.random() > 0.5 ? 0x66BB6A : 0xE53935;
        
        const pepperMaterial = new THREE.MeshStandardMaterial({ 
            color: pepperColor,
            roughness: 0.7,
            metalness: 0.1
        });
        const pepper = new THREE.Mesh(pepperGeometry, pepperMaterial);
        pepper.castShadow = true;
        pepper.receiveShadow = true;
        
        // Create pepper stem
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E7D32,
            roughness: 0.8,
            metalness: 0.1
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.3;
        
        // Create pepper slice
        const sliceGeometry = new THREE.RingGeometry(0.1, 0.2, 16);
        const sliceMaterial = new THREE.MeshStandardMaterial({ 
            color: pepperColor,
            roughness: 0.7,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
        slice.position.set(0.4, 0, 0);
        slice.rotation.y = Math.PI / 2;
        
        // Add to ingredient group
        this.ingredientGroup.add(pepper);
        this.ingredientGroup.add(stem);
        this.ingredientGroup.add(slice);
    }
    
    createPineapple() {
        // Create pineapple body
        const pineappleGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16);
        const pineappleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFB300,
            roughness: 0.8,
            metalness: 0.1
        });
        const pineapple = new THREE.Mesh(pineappleGeometry, pineappleMaterial);
        pineapple.castShadow = true;
        pineapple.receiveShadow = true;
        
        // Create pineapple top leaves
        const leavesGeometry = new THREE.ConeGeometry(0.25, 0.3, 16);
        const leavesMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E7D32,
            roughness: 0.8,
            metalness: 0.1
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 0.4;
        
        // Create pineapple chunks
        for (let i = 0; i < 3; i++) {
            const chunkGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
            const chunkMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFEB3B,
                roughness: 0.8,
                metalness: 0.1
            });
            const chunk = new THREE.Mesh(chunkGeometry, chunkMaterial);
            chunk.position.set(0.4, -0.1 + i * 0.2, 0);
            
            this.ingredientGroup.add(chunk);
        }
        
        // Add to ingredient group
        this.ingredientGroup.add(pineapple);
        this.ingredientGroup.add(leaves);
    }
    
    createOregano() {
        // Create oregano container
        const containerGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.4, 16);
        const containerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8D6E63,
            roughness: 0.7,
            metalness: 0.1
        });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.castShadow = true;
        container.receiveShadow = true;
        
        // Create oregano flakes on top
        const flakesGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.3);
        const flakesMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E7D32,
            roughness: 0.9,
            metalness: 0.0
        });
        const flakes = new THREE.Mesh(flakesGeometry, flakesMaterial);
        flakes.position.y = 0.22;
        
        // Add to ingredient group
        this.ingredientGroup.add(container);
        this.ingredientGroup.add(flakes);
    }
    
    createDefaultIngredient() {
        // Create a generic ingredient visual
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x999999,
            roughness: 0.7,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Add to ingredient group
        this.ingredientGroup.add(mesh);
    }
}
