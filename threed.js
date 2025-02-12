let scene, camera, renderer, cube;
  let geometry, material;
  let length = 5, width = 5, depth = 5, color = "#FFF452"; // Default values
  let isDragging = false; // Track if the mouse is dragging
  let previousMousePosition = { x: 0, y: 0 }; // Track previous mouse position for rotation

  function initThreeJs() {
      const canvasContainer = document.getElementById('threeCanvas');
      canvasContainer.innerHTML = ''; // Clear previous canvas

      // Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / 400, 1, 1000);
      camera.position.set(5, 8, 5); // Adjusted camera position
      camera.lookAt(0, 0, 0);

      // Renderer with Transparent Background
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(canvasContainer.clientWidth, 400);
      renderer.setClearColor(0x000000, 0); // Transparent background
      canvasContainer.appendChild(renderer.domElement);

      // Create Box
      updateBox();

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(2, 2, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
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
      canvas.addEventListener('mousedown', (e) => {
          isDragging = true;
      });

      canvas.addEventListener('mouseup', (e) => {
          isDragging = false;
      });

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
      material = new THREE.MeshStandardMaterial({ map: texture, color: color });

      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
  }

  // Event Listener for Modal Open
  document.getElementById('customizeModal').addEventListener('shown.bs.modal', initThreeJs);

  // Controls Event Listeners
  document.getElementById('length').addEventListener('input', (e) => {
      length = parseFloat(e.target.value);
      updateBox();
  });

  document.getElementById('width').addEventListener('input', (e) => {
      width = parseFloat(e.target.value);
      updateBox();
  });

  document.getElementById('depth').addEventListener('input', (e) => {
      depth = parseFloat(e.target.value);
      updateBox();
  });

  document.getElementById('color').addEventListener('input', (e) => {
      color = e.target.value;
      updateBox();
  });

  // Movement and Rotation Controls
    document.getElementById('front').addEventListener('click', () => {
      rotateCube(0, 0); // Front face
  });

  document.getElementById('back').addEventListener('click', () => {
      rotateCube(Math.PI, 0); // Back face
  });

  document.getElementById('left').addEventListener('click', () => {
      rotateCube(0, -Math.PI / 2); // Left face
  });

  document.getElementById('right').addEventListener('click', () => {
      rotateCube(0, Math.PI / 2); // Right face
  });

  document.getElementById('top').addEventListener('click', () => {
      rotateCube(-Math.PI / 2, 0); // Top face
  });

  document.getElementById('bottom').addEventListener('click', () => {
      rotateCube(Math.PI / 2, 0); // Bottom face
  });

  function rotateCube(xRotation, yRotation) {
      if (cube) {
          // Use GSAP for smooth rotation (optional, include GSAP library)
          gsap.to(cube.rotation, { x: xRotation, y: yRotation, duration: 0.8, ease: "power2.out" });

          // If GSAP is not used, directly set rotation:
          // cube.rotation.set(xRotation, yRotation, 0);
      }
  }

  document.getElementById('rotateLeft').addEventListener('click', () => {
      cube.rotation.y += 0.1;
  });

  document.getElementById('rotateRight').addEventListener('click', () => {
      cube.rotation.y -= 0.1;
  });