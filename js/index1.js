var startTime = Date.now();
var container;
var camera, scene, renderer, stats;
var skybox;


init();



animate();

fuction init(){

	if(! Detector.webgl) Detector.addGetWebGLMessage();

	camera = new THREE.Camera(70, window.innerWidth / window.innerHeight, 1, 100000);

	scene = new THREE.Scene();

var urlPrefix = "images/Bridge2/";
var urls = [ urlPrefix + "space.jpg", urlPrefix + "space.jpg",
    urlPrefix + "space.jpg", urlPrefix + "space.jpg",
    urlPrefix + "space.jpg", urlPrefix + "space.jpg" ];
var textureCube = THREE.ImageUtils.loadTextureCube( urls );


var shader = THREE.ShaderUtils.lib["cube"];
var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
uniforms['tCube'].texture= textureCube;   // textureCube has been init before
var material = new THREE.MeshShaderMaterial({
    fragmentShader    : shader.fragmentShader,
    vertexShader  : shader.vertexShader,
    uniforms  : uniforms
});

// build the skybox Mesh 
skyboxMesh    = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );
// add it to the scene
scene.addObject( skyboxMesh );


container = document.createElement( 'div' );
document.body.appendChild( container );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.domElement );
}


function animate() {

	renderer();

requestAnimationFrame( animate );


stats.update();}

function render() {

	var timer = - new Date().getTime() * 0.0002;
	camera.position.x = 1000 * Math.cos( timer );
	camera.position.z = 1000 * Math.sin( timer );
	renderer.render( scene, camera );
}
