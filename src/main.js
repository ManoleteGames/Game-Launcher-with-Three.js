
  	import * as THREE from 'three';
  	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  	import Stats from 'three/addons/libs/stats.module.js';
	import * as TWEEN from "three/addons/libs/tween.module.js";
	import '/src/style.css';

	console.clear();

	// Class game
	class Game {
	    name = '';
		mesh;
 	 	constructor(name) {
    	    this.name = name;
 		}	
	}

	class SceneObject {
	    name = '';
		id;
		mesh;
 	 	constructor(name) {
    	    this.name = name;
			this.id = 0;
 		}	
	}

	let stats;
	let camera, scene, raycaster, renderer,controls;

    const loader = new GLTFLoader();
	const pointer = new THREE.Vector2();
	const focus = new THREE.Vector3();
	let intersects;
	
	let camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ;
   	
	let pes94 = new Game("Pesadilla del '94");
	let hormona = new Game("La fiesta de las hormonas");
	let outcash = new Game("Out of cash");
	let rio = new Game("Rio Inmaculado");
	let gandara = new Game("La Gandara");
	let sk = new Game("School Kombat");
	let biricia = new Game("La Biricia");

	let computerCPU = new SceneObject("CPU");
	let computerScreen = new SceneObject("Screen");
	let keyboard = new SceneObject("Keyboard");
	let poster = new SceneObject("Poster");
	let chair = new SceneObject("Silla");
	let shoes = new SceneObject("Bambas");
	let books = new SceneObject("Libros");

	Init();
    Animate();

	// -------------- FUNCTIONS -------------------------
	
	// Initialization
	function Init() {
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xf0f0f0 );

		// Set light
		const light = new THREE.DirectionalLight( 0xffffff, 3 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

		// Load self
        loader.load( 'assets/models/self.glb', function ( gltf ) {
			gltf.scene.position.set(-1.0,1.5,0.0);
          	gltf.scene.rotation.set(0.0,1.55,0.0);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load table
        loader.load( 'assets/models/table.glb', function ( gltf ) {
			gltf.scene.position.set(0.0,-0.02,0.0);
          	gltf.scene.rotation.set(0.0,0.0,0.0);
			gltf.scene.scale.set(0.8,0.8,0.8);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer cpu
        loader.load( 'assets/models/computer.glb', function ( gltf ) {
			gltf.scene.position.set(0.0,0.83,0.3);
          	gltf.scene.rotation.set(0.0,-1.5,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
			computerCPU.mesh = gltf.scene;
			computerCPU.id = gltf.scene.children[0].id;
          	computerCPU.name = "CPU 486 DX2 66MHz";
			scene.add( computerCPU.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer monitor
        loader.load( 'assets/models/monitor.glb', function ( gltf ) {
			gltf.scene.position.set(0.025,1.13,0.4);
          	gltf.scene.rotation.set(0.0,-1.5,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
			computerScreen.mesh = gltf.scene;
			computerScreen.id = gltf.scene.children[0].children[0].id;
          	computerScreen.name = "Monitor";
			scene.add( computerScreen.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer keyboard
        loader.load( 'assets/models/keyboard.glb', function ( gltf ) {
			gltf.scene.position.set(0.025,0.85,0.7);
          	gltf.scene.rotation.set(0.0,-1.5,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
			keyboard.mesh = gltf.scene;
			keyboard.id = gltf.scene.id;
          	keyboard.name = "PC";
			scene.add( keyboard.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load chair
        loader.load( 'assets/models/chair.glb', function ( gltf ) {
			gltf.scene.position.set(0.5,-0.1,1.5);
          	gltf.scene.rotation.set(0.0,-0.9,0.0);
			gltf.scene.scale.set(0.8,0.8,0.8);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load poster
        loader.load( 'assets/models/poster.glb', function ( gltf ) {
			gltf.scene.position.set(1.7,1.2,0.0);
          	gltf.scene.rotation.set(0.0,-1.55,0.0);
			gltf.scene.scale.set(0.6,0.6,0.6);
			poster.mesh = gltf.scene;
			poster.id = gltf.scene.children[0].children[0].id;
			scene.add( poster.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load books
        loader.load( 'assets/models/books.glb', function ( gltf ) {
			gltf.scene.position.set(-0.6,0.85,0.4);
          	gltf.scene.rotation.set(0.0,-1.0,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load floppy 1
        loader.load( 'assets/models/floppy.glb', function ( gltf ) {
			gltf.scene.position.set(0.6,0.85,0.4);
          	gltf.scene.rotation.set(-1.55,0.0,0.0);
			gltf.scene.scale.set(0.1,0.1,0.1);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load floppy 2
        loader.load( 'assets/models/floppy.glb', function ( gltf ) {
			gltf.scene.position.set(0.62,0.85,0.46);
          	gltf.scene.rotation.set(-1.50,0.0,0.2);
			gltf.scene.scale.set(0.1,0.1,0.1);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load SHOES
        loader.load( 'assets/models/shoes.glb', function ( gltf ) {
			gltf.scene.position.set(-0.5,0.0,1.0);
          	gltf.scene.rotation.set(0.0,90.0,0.0);
			gltf.scene.scale.set(0.3,0.3,0.3);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

       	Load_PES94();
		Load_HORMONA();
		Load_OUTCASH();
		Load_RIO();
		Load_GANDARA();
		Load_SK();
		Load_BIRICIA();
        
        raycaster = new THREE.Raycaster();
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setAnimationLoop( Animate );
		document.body.appendChild( renderer.domElement );

		stats = new Stats();
		document.body.appendChild( stats.dom );
 
        const container = document.createElement( 'div' );
        container.style= "text-align:center; background-color:red; cursor: pointer; opacity: 0.9; z-index: 10000;";
        const p = document.createElement( 'p' );
        p.id = "messageBox";
        container.appendChild(p)
        document.body.appendChild( container );
        var panel = document.getElementById("messageBox");
        panel.innerHTML = "test";
        panel.style.display = "block";

        controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 1;
        controls.maxDistance = 8;
		controls.enablePan = true;
		controls.update();

		camPosX = -2;
		camPosY = 2;
		camPosZ = 4;

		camRotX = -2;
		camRotY = 2;
		camRotZ = 4;

		camera.position.set(camPosX,camPosY,camPosZ);
		camera.lookAt( scene.position );
		camera.updateMatrixWorld();

		// Declare events
		document.addEventListener( 'mousemove', onPointerMove );
		document.addEventListener('click', onPointerClick );
		window.addEventListener( 'resize', onWindowResize );
	}

	// Load Out of cash box
	function Load_OUTCASH(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_back.png") })
        ];

		outcash.mesh = new THREE.Mesh( geometry, material );
		outcash.mesh.scale.set(0.2,0.2,0.2);
		outcash.mesh.position.set(-1.4,1.7,0.14);
		outcash.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(outcash.mesh);
	}

	// Load pes94 box
	function Load_PES94(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_back.png") })
        ];

		pes94.mesh = new THREE.Mesh( geometry, material );
		pes94.mesh.scale.set(0.2,0.2,0.2);
		pes94.mesh.position.set(-1.25,1.7,0.14);
		pes94.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(pes94.mesh);
	}

	// Load Hormona box
	function Load_HORMONA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_back.png") })
        ];

        hormona.mesh = new THREE.Mesh( geometry, material );
		hormona.mesh.scale.set(0.2,0.2,0.2);
		hormona.mesh.position.set(-1.1,1.7,0.12);
		hormona.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(hormona.mesh);
	}

	// Load Rio box
	function Load_RIO(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_back.png") })
        ];

        rio.mesh = new THREE.Mesh( geometry, material );
		rio.mesh.scale.set(0.2,0.2,0.2);
		rio.mesh.position.set(-0.95,1.7,0.12);
		rio.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(rio.mesh);
	}

	// Load Rio box
	function Load_GANDARA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_back.png") })
        ];

        gandara.mesh = new THREE.Mesh( geometry, material );
		gandara.mesh.scale.set(0.2,0.2,0.2);
		gandara.mesh.position.set(-0.8,1.7,0.12);
		gandara.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(gandara.mesh);
	}

	// Load Rio box
	function Load_SK(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_back.png") })
        ];

        sk.mesh = new THREE.Mesh( geometry, material );
		sk.mesh.scale.set(0.2,0.2,0.2);
		sk.mesh.position.set(-0.65,1.7,0.12);
		sk.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(sk.mesh);
	}

	// Load Rio box
	function Load_BIRICIA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_back.png") })
        ];

        biricia.mesh = new THREE.Mesh( geometry, material );
		biricia.mesh.scale.set(0.2,0.2,0.2);
		biricia.mesh.position.set(-0.5,1.7,0.12);
		biricia.mesh.rotation.set(0.0,-0.8,0.0);
		scene.add(biricia.mesh);
	}

	// Window resize event
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	// Mouse pointer position update event
	function onPointerMove( event ) {
		pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	// Mouse pointer position update event
	function onPointerClick( event ) {

		// find intersections
		raycaster.setFromCamera( pointer, camera );
		intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length > 0 ) {
			switch(intersects[0].object.id){
				case outcash.mesh.id:
					camPosX = -2;
					camPosZ = 1;
					break;
				case pes94.mesh.id:
					camPosX = -1.6;
					camPosZ = 1;
					break;
				case hormona.mesh.id:
					camPosX = -1.2;
					camPosZ = 1;
					break;
				case rio.mesh.id:
					camPosX = -1.0;
					camPosZ = 1;
					break;
				case gandara.mesh.id:
					camPosX = -0.8;
					camPosZ = 1;
					break;
				case sk.mesh.id:
					camPosX = -0.6;
					camPosZ = 1;
					break;
				case biricia.mesh.id:
					camPosX = -0.4;
					camPosZ = 1;
					break;
				case computerCPU.id:
					break;
				case computerScreen.id:
					camPosX = 0;
					camPosZ = 2;
					break;
				case poster.id:
					camPosX = 2;	
					camPosZ = 2;
					break;
				default:
					camPosX = -2;
					camPosY = 2;
					camPosZ = 4;
					break;
			}
		} else {
        	camPosX = -2;
			camPosY = 2;
			camPosZ = 4;
		}	
	}

	// Animation update
	function Animate() {

		Render();
		TWEEN.update();
		stats.update();
        controls.update();
	}

	function CameraCorrection(){
		if(camera.position.x > (camPosX+0.1)){
			camera.position.x -= 0.02 ;
		}

		if(camera.position.x < (camPosX-0.1)){
			camera.position.x += 0.02 ;
		}

		if(camera.position.y > (camPosY+0.1)){
			camera.position.y -= 0.01;
		}

		if(camera.position.y < (camPosY-0.1)){
			camera.position.y += 0.01;
		}

		if(camera.position.z > (camPosZ+0.1)){
			camera.position.z -= 0.01;
		}

		if(camera.position.z < (camPosZ-0.1)){
			camera.position.z += 0.01;
		}
	}

	// Render update
	function Render() {
		
		controls.target.lerp( focus, 0.01 );
		CameraCorrection();
		camera.updateMatrixWorld();

		// find intersections
		raycaster.setFromCamera( pointer, camera );
		intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length > 0 ) {
			switch(intersects[0].object.id){
				case outcash.mesh.id:
					document.getElementById("messageBox").innerHTML = outcash.name;
					outcash.mesh.getWorldPosition( focus );
					break;
				case pes94.mesh.id:
					document.getElementById("messageBox").innerHTML = pes94.name;
					pes94.mesh.getWorldPosition( focus );
					break;
				case hormona.mesh.id:
					document.getElementById("messageBox").innerHTML = hormona.name;
					hormona.mesh.getWorldPosition( focus );
					break;
				case rio.mesh.id:
					document.getElementById("messageBox").innerHTML = rio.name;
					rio.mesh.getWorldPosition( focus );
					break;
				case gandara.mesh.id:
					document.getElementById("messageBox").innerHTML = gandara.name;
					gandara.mesh.getWorldPosition( focus );
					break;
				case sk.mesh.id:
					document.getElementById("messageBox").innerHTML = sk.name;
					sk.mesh.getWorldPosition( focus );
					break;
				case biricia.mesh.id:
					document.getElementById("messageBox").innerHTML = biricia.name;
					biricia.mesh.getWorldPosition( focus );
					break;
				case computerCPU.id:
					document.getElementById("messageBox").innerHTML = computerCPU.name;
					computerCPU.mesh.getWorldPosition( focus );
					break;
				case computerScreen.id:
					document.getElementById("messageBox").innerHTML = computerScreen.name;
					computerScreen.mesh.getWorldPosition( focus );
					break;
				case poster.id:
					document.getElementById("messageBox").innerHTML = poster.name;
					poster.mesh.getWorldPosition( focus );
					break;
				default:
					document.getElementById("messageBox").innerHTML = "";
					break;
			}
		} else {
			document.getElementById("messageBox").innerHTML = "";
        	//document.getElementById("messageBox").innerHTML = "nothing";
		}
		renderer.render( scene, camera );
	}
