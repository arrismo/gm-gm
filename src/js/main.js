import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Game } from './game.js';
import { UI } from './ui.js';
import { SoundManager } from './soundManager.js';

// Main game class that initializes Three.js and manages the game loop
class Main {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.setupLoadingManager();
        
        // Initialize Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Setup camera
        this.camera.position.set(0, 5, 7);
        this.camera.lookAt(0, 0, 0);
        
        // Setup controls (for development)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Initialize game components
        this.soundManager = new SoundManager();
        this.ui = new UI();
        this.game = new Game(this.scene, this.camera, this.soundManager, this.ui);
        
        // Setup event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.getElementById('start-button').addEventListener('click', this.startGame.bind(this));
        
        // Start animation loop
        this.animate();
    }
    
    setupLoadingManager() {
        const progressBar = document.getElementById('loading-progress');
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            progressBar.style.width = progress + '%';
        };
        
        this.loadingManager.onLoad = () => {
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('start-screen').style.display = 'flex';
            }, 1000);
        };
        // Fallback: Hide loading screen after 2 seconds if nothing loads
        setTimeout(() => {
            if (document.getElementById('loading-screen').style.display !== 'none') {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('start-screen').style.display = 'flex';
            }
        }, 2000);
    }
    
    startGame() {
        document.getElementById('start-screen').style.display = 'none';
        this.game.start();
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.controls.update();
        this.game.update();
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new Main();
});
