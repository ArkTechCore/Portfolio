// Three.js 3D Background Setup
function initThreeJS() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    const container = document.getElementById('threejs-bg');
    container.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 5;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x4cc9f0, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x4361ee, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create floating geometry
    const geometries = [];
    const materials = [];
    const meshes = [];
    
    // Create different 3D shapes
    const shapeTypes = [
        { geometry: new THREE.IcosahedronGeometry(0.5), color: 0x4361ee },
        { geometry: new THREE.OctahedronGeometry(0.4), color: 0x7209b7 },
        { geometry: new THREE.TetrahedronGeometry(0.3), color: 0x4cc9f0 },
        { geometry: new THREE.DodecahedronGeometry(0.6), color: 0x3a0ca3 },
        { geometry: new THREE.TorusGeometry(0.3, 0.1, 16, 100), color: 0xf72585 },
        { geometry: new THREE.TorusKnotGeometry(0.4, 0.1, 100, 16), color: 0x4cc9f0 }
    ];
    
    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            transparent: true,
            opacity: 0.1,
            wireframe: true,
            wireframeLinewidth: 1
        });
        
        const mesh = new THREE.Mesh(type.geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        // Random rotation speed
        mesh.rotationSpeed = {
            x: Math.random() * 0.02,
            y: Math.random() * 0.02,
            z: Math.random() * 0.02
        };
        
        // Random float speed
        mesh.floatSpeed = Math.random() * 0.02 + 0.01;
        mesh.floatDirection = Math.random() > 0.5 ? 1 : -1;
        
        scene.add(mesh);
        meshes.push(mesh);
    }
    
    // Add connection lines between objects
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.05,
        linewidth: 1
    });
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate and float meshes
        meshes.forEach(mesh => {
            mesh.rotation.x += mesh.rotationSpeed.x;
            mesh.rotation.y += mesh.rotationSpeed.y;
            mesh.rotation.z += mesh.rotationSpeed.z;
            
            // Floating animation
            mesh.position.y += Math.sin(Date.now() * 0.001 * mesh.floatSpeed) * 0.001 * mesh.floatDirection;
            mesh.position.x += Math.cos(Date.now() * 0.001 * mesh.floatSpeed) * 0.001 * mesh.floatDirection;
        });
        
        // Camera follow mouse slightly
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Clean up function
    return function cleanup() {
        container.removeChild(renderer.domElement);
        renderer.dispose();
    };
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('threejs-bg')) {
        initThreeJS();
    }
});