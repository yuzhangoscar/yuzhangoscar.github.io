// Yu Zhang's Portfolio Website - 3D Background and Interactive Features

// Global variables for 3D scene
let scene, camera, renderer, particles = [];
let mouseX = 0, mouseY = 0;

// 3D Background Setup
function init3DBackground() {
  try {
    // Check if Three.js loaded properly
    if (typeof THREE === 'undefined') {
      console.log('Three.js not loaded, skipping 3D background');
      return;
    }

    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('three-canvas'),
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating particles
    createParticles();
    
    // Create animated background geometry
    createBackgroundGeometry();
    
    // Add simple lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle mouse movement for interactive effects
    document.addEventListener('mousemove', onMouseMove);
  } catch (error) {
    console.error('Error initializing 3D background:', error);
  }
}

function createParticles() {
  const particleCount = 50; // Reduced for better performance
  const particleGeometry = new THREE.SphereGeometry(0.1, 6, 6); // Simplified geometry
  
  for (let i = 0; i < particleCount; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
      transparent: true,
      opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, material);
    
    // Random position
    particle.position.x = (Math.random() - 0.5) * 80;
    particle.position.y = (Math.random() - 0.5) * 60;
    particle.position.z = (Math.random() - 0.5) * 80;
    
    // Random velocity
    particle.velocity = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    };
    
    particles.push(particle);
    scene.add(particle);
  }
}

function createBackgroundGeometry() {
  // Animated wave plane
  const planeGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x4a90e2,
    transparent: true,
    opacity: 0.25,
    wireframe: true
  });
  
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -25;
  scene.add(plane);
  
  // Store reference for animation
  scene.userData.plane = plane;
  
  // Create multiple layers of polygon objects
  const shapes = [];
  const totalShapes = 60; // Increased from 20
  
  // Create various polygon geometries
  function createPolygonGeometry(shapeType) {
    switch(shapeType) {
      case 0: // Tetrahedron
        return new THREE.TetrahedronGeometry(0.8);
      case 1: // Octahedron
        return new THREE.OctahedronGeometry(0.7);
      case 2: // Dodecahedron
        return new THREE.DodecahedronGeometry(0.6);
      case 3: // Icosahedron
        return new THREE.IcosahedronGeometry(0.7);
      case 4: // Triangular Prism
        return new THREE.CylinderGeometry(0, 0.8, 1.5, 3);
      case 5: // Hexagonal Prism
        return new THREE.CylinderGeometry(0.6, 0.6, 1.2, 6);
      case 6: // Pentagonal Prism
        return new THREE.CylinderGeometry(0.6, 0.6, 1.0, 5);
      case 7: // Diamond (Double Pyramid)
        return new THREE.ConeGeometry(0.6, 2, 4);
      case 8: // Rectangular Prism
        return new THREE.BoxGeometry(1.2, 0.6, 0.8);
      case 9: // Torus
        return new THREE.TorusGeometry(0.6, 0.2, 8, 16);
      case 10: // Wedge
        const wedgeGeometry = new THREE.ConeGeometry(0.8, 1.5, 3);
        wedgeGeometry.rotateZ(Math.PI / 2);
        return wedgeGeometry;
      case 11: // Truncated Cone
        return new THREE.CylinderGeometry(0.3, 0.8, 1.2, 8);
      case 12: // Star-like shape
        return new THREE.ConeGeometry(0.1, 2, 5);
      default:
        return new THREE.BoxGeometry(0.8, 0.8, 0.8);
    }
  }
  
  // Create shapes in different layers/groups
  for (let i = 0; i < totalShapes; i++) {
    const shapeType = Math.floor(Math.random() * 13);
    const geometry = createPolygonGeometry(shapeType);
    
    // Varied material properties
    const materialType = Math.random();
    let material;
    
    if (materialType < 0.3) {
      // Wireframe materials
      material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
    } else if (materialType < 0.6) {
      // Solid with transparency
      material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.7),
        transparent: true,
        opacity: 0.7
      });
    } else {
      // Glowing effect
      material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.9, 0.8),
        transparent: true,
        opacity: 0.75
      });
    }
    
    const shape = new THREE.Mesh(geometry, material);
    
    // Position in 3D space with layered distribution
    const layer = Math.floor(i / 20); // 3 layers of 20 objects each
    const radius = 40 + layer * 20;
    const angle = (i % 20) * (Math.PI * 2 / 20) + layer * 0.5;
    
    shape.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
    shape.position.y = (Math.random() - 0.5) * 60 + Math.sin(layer) * 10;
    shape.position.z = Math.sin(angle) * radius + (Math.random() - 0.5) * 20;
    
    // Varied rotation speeds
    shape.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.03,
      y: (Math.random() - 0.5) * 0.025,
      z: (Math.random() - 0.5) * 0.02
    };
    
    // Add floating motion parameters
    shape.floatSpeed = Math.random() * 0.02 + 0.01;
    shape.floatRange = Math.random() * 3 + 1;
    shape.initialY = shape.position.y;
    
    // Scale variation
    const scale = 0.5 + Math.random() * 0.8;
    shape.scale.set(scale, scale, scale);
    
    shapes.push(shape);
    scene.add(shape);
  }
  
  // Add some larger central focal polygons
  for (let i = 0; i < 5; i++) {
    const centralGeometry = createPolygonGeometry(Math.floor(Math.random() * 5));
    const centralMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.7),
      wireframe: true,
      transparent: true,
      opacity: 0.95
    });
    
    const centralShape = new THREE.Mesh(centralGeometry, centralMaterial);
    centralShape.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 30
    );
    
    centralShape.rotationSpeed = {
      x: 0.005,
      y: 0.008,
      z: 0.003
    };
    
    centralShape.scale.set(2, 2, 2);
    shapes.push(centralShape);
    scene.add(centralShape);
  }
  
  scene.userData.shapes = shapes;
}

function animate() {
  requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;
  
  // Animate particles
  particles.forEach((particle, index) => {
    particle.position.x += particle.velocity.x;
    particle.position.y += particle.velocity.y;
    particle.position.z += particle.velocity.z;
    
    // Bounce off boundaries
    if (Math.abs(particle.position.x) > 50) particle.velocity.x *= -1;
    if (Math.abs(particle.position.y) > 50) particle.velocity.y *= -1;
    if (Math.abs(particle.position.z) > 50) particle.velocity.z *= -1;
    
    // Subtle floating motion
    particle.position.y += Math.sin(time + index) * 0.01;
  });
  
  // Animate background plane
  if (scene.userData.plane) {
    const plane = scene.userData.plane;
    const positions = plane.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = Math.sin(x * 0.1 + time) * Math.cos(z * 0.1 + time) * 2;
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
  }
  
  // Animate floating shapes
  if (scene.userData.shapes) {
    scene.userData.shapes.forEach((shape, index) => {
      // Rotation animation
      shape.rotation.x += shape.rotationSpeed.x;
      shape.rotation.y += shape.rotationSpeed.y;
      shape.rotation.z += shape.rotationSpeed.z;
      
      // Floating motion
      if (shape.floatSpeed && shape.floatRange && shape.initialY !== undefined) {
        shape.position.y = shape.initialY + Math.sin(time * shape.floatSpeed + index) * shape.floatRange;
      }
      
      // Subtle orbital motion for some shapes
      if (index % 3 === 0) {
        const orbitRadius = 2;
        const orbitSpeed = 0.5;
        shape.position.x += Math.cos(time * orbitSpeed + index) * orbitRadius * 0.01;
        shape.position.z += Math.sin(time * orbitSpeed + index) * orbitRadius * 0.01;
      }
      
      // Pulsing scale effect for central shapes
      if (index >= scene.userData.shapes.length - 5) {
        const pulse = 1 + Math.sin(time * 2 + index) * 0.1;
        shape.scale.setScalar(2 * pulse);
      }
    });
  }
  
  // Mouse interaction
  camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2);
  mouseY = (event.clientY - window.innerHeight / 2);
}

// Initialize 3D background when page loads
window.addEventListener('load', () => {
  const canvas = document.getElementById('three-canvas');
  if (canvas) {
    init3DBackground();
  }
});

// Chatting Octopus Popup Functionality
const popup = document.getElementById('octopusPopup');
const trigger = document.getElementById('octopusTrigger');
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const header = document.getElementById('octopusHeader');

let isMaximized = false;
let isMinimized = false;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Show popup
trigger.addEventListener('click', () => {
  popup.style.display = 'block';
  trigger.style.display = 'none';
});

// Close popup
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  trigger.style.display = 'block';
  isMaximized = false;
  isMinimized = false;
  popup.classList.remove('minimized');
  resetPopupSize();
});

// Minimize popup
minimizeBtn.addEventListener('click', () => {
  isMinimized = !isMinimized;
  popup.classList.toggle('minimized');
});

// Maximize popup
maximizeBtn.addEventListener('click', () => {
  isMaximized = !isMaximized;
  if (isMaximized) {
    popup.style.width = '80vw';
    popup.style.height = '80vh';
    popup.style.top = '10vh';
    popup.style.left = '10vw';
    popup.style.transform = 'none';
  } else {
    resetPopupSize();
  }
});

function resetPopupSize() {
  popup.style.width = '400px';
  popup.style.height = '300px';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
}

// Drag functionality
header.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', dragMove);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
  if (isMaximized) return;
  
  initialX = e.clientX - xOffset;
  initialY = e.clientY - yOffset;

  if (e.target === header || header.contains(e.target)) {
    isDragging = true;
  }
}

function dragMove(e) {
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    popup.style.transform = `translate(${currentX}px, ${currentY}px)`;
    popup.style.top = '50%';
    popup.style.left = '50%';
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  isDragging = false;
}