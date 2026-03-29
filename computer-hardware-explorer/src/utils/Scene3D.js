// src/utils/Scene3D.js
import * as THREE from 'three';
import { componentColors } from '../data/ComponentData.js';

export class Scene3D {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.computerGroup = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredObject = null;
    this.originalMaterials = new Map();
    this.interactiveObjects = [];
    
    // Click and drag variables
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationSpeed = 0.005;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createComputerModel();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x4a5568);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(30, 20, 30);
    this.camera.lookAt(0, 0, 0);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.container.appendChild(this.renderer.domElement);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(20, 20, 10);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight1 = new THREE.DirectionalLight(0x4488ff, 0.8);
    fillLight1.position.set(-20, 15, 10);
    this.scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight2.position.set(0, 0, 30);
    this.scene.add(fillLight2);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 50, 0);
    this.scene.add(topLight);
  }

  createComputerModel() {
    this.computerGroup = new THREE.Group();

    this.createMotherboard();
    this.createCPU();
    this.createCPUCooler();
    this.createRAM();
    this.createGPU();
    this.createStorage();
    this.createPSU();
    this.createFans();
    this.createCase();

    this.scene.add(this.computerGroup);
  }

  createCase() {
    const caseGeometry = new THREE.BoxGeometry(18, 40, 40);
    const caseMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2d3748,
      transparent: true,
      opacity: 0.15
    });
    const caseBody = new THREE.Mesh(caseGeometry, caseMaterial);
    caseBody.position.set(0, 0, 0);
    caseBody.userData = { component: 'case' };
    
    this.computerGroup.add(caseBody);

    const frameGeometry = new THREE.EdgesGeometry(caseGeometry);
    const frameMaterial = new THREE.LineBasicMaterial({ 
      color: 0x9ca3af,
      transparent: true,
      opacity: 0.3
    });
    const frame = new THREE.LineSegments(frameGeometry, frameMaterial);
    frame.position.copy(caseBody.position);
    this.computerGroup.add(frame);
  }

  createMotherboard() {
    const mbGeometry = new THREE.BoxGeometry(28, 0.4, 35);
    const mbMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x22c55e,
      emissive: 0x002200
    });
    const motherboard = new THREE.Mesh(mbGeometry, mbMaterial);
    motherboard.position.set(-6, -15, 0);
    motherboard.userData = { component: 'motherboard' };
    
    this.interactiveObjects.push(motherboard);
    this.computerGroup.add(motherboard);

    for (let i = 0; i < 4; i++) {
      const slotGeometry = new THREE.BoxGeometry(18, 0.3, 1);
      const slotMaterial = new THREE.MeshLambertMaterial({ color: 0x374151 });
      const slot = new THREE.Mesh(slotGeometry, slotMaterial);
      slot.position.set(-6, -14.7, -12 + i * 6);
      this.computerGroup.add(slot);
    }

    this.addMotherboardComponents();
  }

  addMotherboardComponents() {
    const socketGeometry = new THREE.BoxGeometry(5, 0.5, 5);
    const socketMaterial = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const socket = new THREE.Mesh(socketGeometry, socketMaterial);
    socket.position.set(-6, -14.6, 12);
    this.computerGroup.add(socket);

    for (let i = 0; i < 4; i++) {
      const ramSlotGeometry = new THREE.BoxGeometry(0.8, 0.4, 15);
      const ramSlotMaterial = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
      const ramSlot = new THREE.Mesh(ramSlotGeometry, ramSlotMaterial);
      ramSlot.position.set(-18 + i * 1.5, -14.6, 0);
      this.computerGroup.add(ramSlot);
    }

    const ioGeometry = new THREE.BoxGeometry(0.3, 10, 18);
    const ioMaterial = new THREE.MeshLambertMaterial({ color: 0x9ca3af });
    const ioShield = new THREE.Mesh(ioGeometry, ioMaterial);
    ioShield.position.set(-19.5, -15, 8);
    this.computerGroup.add(ioShield);
  }

  createCPU() {
    const cpuGeometry = new THREE.BoxGeometry(4.5, 0.6, 4.5);
    const cpuMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4b5563,
      emissive: 0x111111
    });
    const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
    cpu.position.set(-6, -14.3, 12);
    cpu.userData = { component: 'cpu' };
    
    this.interactiveObjects.push(cpu);
    this.computerGroup.add(cpu);

    const spreaderGeometry = new THREE.BoxGeometry(4.2, 0.2, 4.2);
    const spreaderMaterial = new THREE.MeshLambertMaterial({ color: 0x9ca3af });
    const spreader = new THREE.Mesh(spreaderGeometry, spreaderMaterial);
    spreader.position.set(-6, -14.0, 12);
    this.computerGroup.add(spreader);
  }

  createCPUCooler() {
    const coolerGeometry = new THREE.BoxGeometry(6, 15, 10);
    const coolerMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x9ca3af,
      emissive: 0x111111
    });
    const cooler = new THREE.Mesh(coolerGeometry, coolerMaterial);
    cooler.position.set(-6, -6, 12);
    cooler.userData = { component: 'cpuCooler' };
    
    this.interactiveObjects.push(cooler);
    this.computerGroup.add(cooler);

    for (let i = 0; i < 6; i++) {
      const pipeGeometry = new THREE.CylinderGeometry(0.4, 0.4, 12);
      const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
      pipe.position.set(-6 + (i - 2.5) * 0.7, -6, 12);
      this.computerGroup.add(pipe);
    }

    const fanGeometry = new THREE.CylinderGeometry(4, 4, 2.5);
    const fanMaterial = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
    const fan = new THREE.Mesh(fanGeometry, fanMaterial);
    fan.position.set(-12, -6, 12);
    fan.rotation.z = Math.PI / 2;
    this.computerGroup.add(fan);
  }

  createRAM() {
    for (let i = 0; i < 4; i++) {
      const ramGeometry = new THREE.BoxGeometry(1, 4, 15);
      const ramMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x10b981,
        emissive: 0x002200
      });
      const ram = new THREE.Mesh(ramGeometry, ramMaterial);
      ram.position.set(-18 + i * 1.5, -12, 0);
      ram.userData = { component: 'ram' };
      
      this.interactiveObjects.push(ram);
      this.computerGroup.add(ram);

      const spreaderGeometry = new THREE.BoxGeometry(1.2, 5, 15);
      const spreaderMaterial = new THREE.MeshLambertMaterial({ color: 0x9ca3af });
      const spreader = new THREE.Mesh(spreaderGeometry, spreaderMaterial);
      spreader.position.set(-18 + i * 1.5, -11.5, 0);
      this.computerGroup.add(spreader);
    }
  }

  createGPU() {
    const gpuGeometry = new THREE.BoxGeometry(32, 4, 13);
    const gpuMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xef4444,
      emissive: 0x220000
    });
    const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
    gpu.position.set(-4, -12, -10);
    gpu.userData = { component: 'gpu' };
    
    this.interactiveObjects.push(gpu);
    this.computerGroup.add(gpu);

    for (let i = 0; i < 3; i++) {
      const fanGeometry = new THREE.CylinderGeometry(3, 3, 0.8);
      const fanMaterial = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
      const fan = new THREE.Mesh(fanGeometry, fanMaterial);
      fan.position.set(-4 + (i - 1) * 10, -9.5, -10);
      fan.rotation.x = Math.PI / 2;
      this.computerGroup.add(fan);
    }

    const backplateGeometry = new THREE.BoxGeometry(32, 0.3, 13);
    const backplateMaterial = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const backplate = new THREE.Mesh(backplateGeometry, backplateMaterial);
    backplate.position.set(-4, -14.5, -10);
    this.computerGroup.add(backplate);

    const outputGeometry = new THREE.BoxGeometry(0.5, 3, 10);
    const outputMaterial = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
    const outputs = new THREE.Mesh(outputGeometry, outputMaterial);
    outputs.position.set(-19.5, -12, -10);
    this.computerGroup.add(outputs);
  }

  createStorage() {
    const m2Geometry = new THREE.BoxGeometry(10, 0.3, 3);
    const m2Material = new THREE.MeshLambertMaterial({ 
      color: 0x3b82f6,
      emissive: 0x000022
    });
    const m2SSD = new THREE.Mesh(m2Geometry, m2Material);
    m2SSD.position.set(-6, -14.4, -2);
    m2SSD.userData = { component: 'storage' };
    
    this.interactiveObjects.push(m2SSD);
    this.computerGroup.add(m2SSD);

    const ssdGeometry = new THREE.BoxGeometry(12, 1, 8);
    const ssdMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4b5563,
      emissive: 0x111111
    });
    const ssd = new THREE.Mesh(ssdGeometry, ssdMaterial);
    ssd.position.set(8, -17, -15);
    ssd.userData = { component: 'storage' };
    
    this.interactiveObjects.push(ssd);
    this.computerGroup.add(ssd);

    const cableGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10);
    const cableMaterial = new THREE.MeshLambertMaterial({ color: 0xef4444 });
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    cable.position.set(0, -17, -15);
    cable.rotation.z = Math.PI / 4;
    this.computerGroup.add(cable);
  }

  createPSU() {
    const psuGeometry = new THREE.BoxGeometry(18, 10, 18);
    const psuMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4b5563,
      emissive: 0x111111
    });
    const psu = new THREE.Mesh(psuGeometry, psuMaterial);
    psu.position.set(-6, -17, -15);
    psu.userData = { component: 'psu' };
    
    this.interactiveObjects.push(psu);
    this.computerGroup.add(psu);

    const psuFanGeometry = new THREE.CylinderGeometry(4, 4, 0.8);
    const psuFanMaterial = new THREE.MeshLambertMaterial({ color: 0x6b7280 });
    const psuFan = new THREE.Mesh(psuFanGeometry, psuFanMaterial);
    psuFan.position.set(-6, -22.5, -15);
    psuFan.rotation.x = Math.PI / 2;
    this.computerGroup.add(psuFan);

    this.createPowerCables();
  }

  createPowerCables() {
    const mb24Geometry = new THREE.CylinderGeometry(0.8, 0.8, 15);
    const mb24Material = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
    const mb24Cable = new THREE.Mesh(mb24Geometry, mb24Material);
    mb24Cable.position.set(-18, -10, -5);
    mb24Cable.rotation.z = Math.PI / 4;
    this.computerGroup.add(mb24Cable);

    const gpuPowerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10);
    const gpuPowerMaterial = new THREE.MeshLambertMaterial({ color: 0x6b7280 });
    const gpuPowerCable = new THREE.Mesh(gpuPowerGeometry, gpuPowerMaterial);
    gpuPowerCable.position.set(-15, -9, -10);
    gpuPowerCable.rotation.y = Math.PI / 6;
    this.computerGroup.add(gpuPowerCable);
  }

  createFans() {
    for (let i = 0; i < 3; i++) {
      const fanGeometry = new THREE.CylinderGeometry(7, 7, 1.5);
      const fanMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x6b7280,
        emissive: 0x111111
      });
      const fan = new THREE.Mesh(fanGeometry, fanMaterial);
      fan.position.set(-18, -8 + i * 12, 0);
      fan.rotation.z = Math.PI / 2;
      fan.userData = { component: 'fans' };
      
      this.interactiveObjects.push(fan);
      this.computerGroup.add(fan);

      const bladesGeometry = new THREE.BoxGeometry(0.8, 12, 0.8);
      const bladesMaterial = new THREE.MeshLambertMaterial({ color: 0x9ca3af });
      for (let j = 0; j < 4; j++) {
        const blade = new THREE.Mesh(bladesGeometry, bladesMaterial);
        blade.position.copy(fan.position);
        blade.rotation.z = (Math.PI / 2) + (j * Math.PI / 2);
        this.computerGroup.add(blade);
      }
    }

    const rearFanGeometry = new THREE.CylinderGeometry(7, 7, 1.5);
    const rearFanMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x6b7280,
      emissive: 0x111111
    });
    const rearFan = new THREE.Mesh(rearFanGeometry, rearFanMaterial);
    rearFan.position.set(10, 8, 18);
    rearFan.rotation.x = Math.PI / 2;
    rearFan.userData = { component: 'fans' };
    
    this.interactiveObjects.push(rearFan);
    this.computerGroup.add(rearFan);
  }

  // Click and drag interaction methods
  onMouseDown(event) {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.container.style.cursor = 'grabbing';
  }

  onMouseUp(event) {
    this.isDragging = false;
    this.container.style.cursor = 'grab';
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.isDragging && this.computerGroup) {
      // Calculate mouse movement delta
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };

      // Rotate computer based on mouse movement
      this.computerGroup.rotation.y += deltaMove.x * this.rotationSpeed;
      this.computerGroup.rotation.x += deltaMove.y * this.rotationSpeed;

      // Update previous mouse position
      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    } else {
      // Handle hover detection when not dragging
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, false);

      // Reset previous hover
      if (this.hoveredObject) {
        this.resetObjectMaterial(this.hoveredObject);
        this.hoveredObject = null;
      }

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.component) {
          this.hoveredObject = object;
          this.highlightObject(object);
          return object.userData.component;
        }
      }
    }
    return null;
  }

  onMouseClick(event) {
    // Only trigger component selection if not dragging
    if (!this.isDragging && this.hoveredObject && this.hoveredObject.userData.component) {
      return this.hoveredObject.userData.component;
    }
    return null;
  }

  highlightObject(object) {
    if (!this.originalMaterials.has(object.id)) {
      this.originalMaterials.set(object.id, object.material.clone());
    }
    
    const highlightMaterial = object.material.clone();
    highlightMaterial.color.multiplyScalar(1.8);
    highlightMaterial.emissive.setHex(0x444444);
    object.material = highlightMaterial;
  }

  resetObjectMaterial(object) {
    if (this.originalMaterials.has(object.id)) {
      object.material = this.originalMaterials.get(object.id);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
}