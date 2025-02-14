let scene, camera, renderer, cube, floor;
  let geometry, material;
  let length = 5, width = 5, depth = 5; // Default values
  let isDragging = false; // Track if the mouse is dragging
  let previousMousePosition = { x: 0, y: 0 }; // Track previous mouse position for rotation
  let isRotating = false;

  function initThreeJs() {
      const canvasContainer = document.getElementById('threeCanvas');
      canvasContainer.innerHTML = ''; // Clear previous canvas

      // Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / 400, 0.1, 1000);
      camera.position.set(10, 10, 10); // Adjusted camera position
      camera.lookAt(0, 0, 0);

      // Renderer with Transparent Background
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(canvasContainer.clientWidth, 400);
      renderer.setClearColor(0xffffff, 0); // Brown background
      canvasContainer.appendChild(renderer.domElement);

      // Ambient Light
      const ambientLight = new THREE.AmbientLight(0x8B4513, 0.8);
      scene.add(ambientLight);

    // Directional Lights for 4 directions
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight1.position.set(10, 10, 10); // Top-right-front
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight2.position.set(-10, 10, 10); // Top-left-front
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight3.position.set(10, 10, -10); // Top-right-back
    scene.add(directionalLight3);

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight4.position.set(-10, 10, -10); // Top-left-back
    scene.add(directionalLight4);

    // Create Box
    updateBox();

    // Point Light (optional, for additional lighting)
    const pointLight = new THREE.PointLight(0x8B4513, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

      // Animation
      function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
      }
      animate();

      // Add Cursor Controller for 360-Degree Rotation
      const canvas = renderer.domElement;
      canvas.addEventListener('mousedown', (e) => {isDragging = true;});
      canvas.addEventListener('mouseup', (e) => {isDragging = false;});
      canvas.addEventListener('mousemove', (e) => {
          if (isDragging) {
              const deltaX = e.clientX - previousMousePosition.x;
              const deltaY = e.clientY - previousMousePosition.y;
              // Rotate the cube based on mouse movement
              cube.rotation.y += deltaX * 0.01; // Rotate horizontally
              cube.rotation.x += deltaY * 0.01; // Rotate vertically
          }
          previousMousePosition = { x: e.clientX, y: e.clientY };
      });
  }

  function updateBox() {
      if (cube) {
          scene.remove(cube);
      }

      // Load Texture for Corrugated Cardboard
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('https://everytexture.com/wp-content/uploads/2019/01/everytexture-com-stock-paper-texture-00042.jpg'); // Golden brown corrugated cardboard texture

      // Update Geometry
      geometry = new THREE.BoxGeometry(length, width, depth);
      material = new THREE.MeshStandardMaterial({ map: texture, color: 0x7A4B1F });

      cube = new THREE.Mesh(geometry, material);
      cube.position.y = width / 2; // Adjust height to sit on the floor
      cube.castShadow = false;
      scene.add(cube);
  }

  // Event Listener for Modal Open
  document.getElementById('customizeModal').addEventListener('shown.bs.modal', initThreeJs);

    // Box Control Events
    ['length', 'width', 'depth'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        if (!isNaN(parseFloat(e.target.value))) {
            if (id === 'length') length = parseFloat(e.target.value);
            if (id === 'width') width = parseFloat(e.target.value);
            if (id === 'depth') depth = parseFloat(e.target.value);
        }
        updateBox();
    });
});

// Movement and Rotation Controls with Camera Adjustment
const facePositions = {
    front: { position: [0, 2.5, 10], lookAt: [0, 2.5, 0] },
    back: { position: [0, 2.5, -10], lookAt: [0, 2.5, 0] },
    left: { position: [-10, 2.5, 0], lookAt: [0, 2.5, 0] },
    right: { position: [10, 2.5, 0], lookAt: [0, 2.5, 0] },
    top: { position: [0, 12, 0], lookAt: [0, 2.5, 0] },
    bottom: { position: [0, -5, 0], lookAt: [0, 2.5, 0] }
};

['front', 'back', 'left', 'right', 'top', 'bottom'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        const target = facePositions[id];
        gsap.to(camera.position, {
            x: target.position[0],
            y: target.position[1],
            z: target.position[2],
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                camera.lookAt(new THREE.Vector3(...target.lookAt));
            }
        });
    });
});

// Create Rotate Button Functionality
document.getElementById('rotate').addEventListener('click', () => {
    isRotating = !isRotating; // Toggle rotation
    if (isRotating) {
        rotateBox();
    }
});

function rotateBox() {
    if (!isRotating) return;
    cube.rotation.y += 0.003; // Slow rotation speed
    requestAnimationFrame(rotateBox);
}

// Zoom Controls
document.getElementById('zoomIn').addEventListener('click', () => {length *= 1.1;width *= 1.1;depth *= 1.1;
    updateBox();
});

document.getElementById('zoomOut').addEventListener('click', () => {length *= 0.9;width *= 0.9;depth *= 0.9;
    updateBox();
});

  // New Features: Upload Image & Input Text
document.getElementById('uploadImage').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
          const textureLoader = new THREE.TextureLoader();
          const uploadedTexture = textureLoader.load(event.target.result);
          cube.material.map = uploadedTexture;
          cube.material.color.set(color);
          cube.material.needsUpdate = true;
      };
      reader.readAsDataURL(file);
  }
});

document.getElementById('textInput').addEventListener('input', (e) => {
    const text = e.target.value;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = document.getElementById('textColor').value; // Get text color from input
    ctx.font = "20px Arial";
    ctx.fillText(text, 50, 100);

    const textureLoader = new THREE.TextureLoader();
    const textTexture = new THREE.CanvasTexture(canvas);
    cube.material.map = textTexture;
    cube.material.needsUpdate = true;
});

// Text Color Change
document.getElementById('textColor').addEventListener('input', (e) => {
    const text = document.getElementById('textInput').value;
    if (text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = e.target.value; // New text color
        ctx.font = "20px Arial";
        ctx.fillText(text, 50, 100);

        const textureLoader = new THREE.TextureLoader();
        const textTexture = new THREE.CanvasTexture(canvas);
        cube.material.map = textTexture;
        cube.material.needsUpdate = true;
    }
});