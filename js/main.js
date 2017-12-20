// ----------------------------------
// audio code
// ----------------------------------

/* Setup an AudioContext, default to the non-prefixed version if possible. */
var context
  , audio
  , processor
  , analyser
  , data
  , delta = 0
  , dist;

/* Try instantiating a new AudioContext, throw an error if it fails. */
try {
  /* Setup an AudioContext. */
  context = new AudioContext();

  /* Create a script processor node with a `bufferSize` of 1024. */
  processor = context.createScriptProcessor(1024);

  /* Create an analyser node */
  analyser = context.createAnalyser();

  /* Wire the processor into our audio context. */
  processor.connect(context.destination);

  /* Wire the analyser into the processor */
  analyser.connect(processor);

  /* Define a Uint8Array to receive the analysers data. */
  data = new Uint8Array(analyser.frequencyBinCount);
} catch(e) {
  throw new Error('The Web Audio API is unavailable');
}

var Sound = {
  element: undefined,
  init: false,

  play: function() {
    if (this.init === false) {
      var sound = context.createMediaElementSource(this.element);

      this.element.onended = function() {
        sound.disconnect();
        sound = null;

        /* Noop the audioprocess handler when the file finishes. */
        processor.onaudioprocess = function() {};
      }

      /* Add the following line to wire into the analyser. */
      sound.connect(analyser);
      sound.connect(context.destination);

      processor.onaudioprocess = function() {
        /* Populate the data array with the frequency data. */
        analyser.getByteTimeDomainData(data);
      };

      this.init = true;
    }

    this.element.play();
  },

  pause: function() {
    this.element.pause();
  },

  paused: function() {
    return this.element.paused;
  }
};

function loadAudioElement(url) {
  return new Promise(function(resolve, reject) {
    var audio = new Audio(); // audio DOM element, same as createElement('audio')

    audio.src = url;
    audio.crossOrigin = "anonymous";

    audio.addEventListener('canplaythrough', function() {
        resolve(audio);
    });

    audio.addEventListener('error', reject);
    audio.load();
  });
}

// ----------------------------------
// visualization code
// ----------------------------------

const CUBES_NUM = 49
    , STEP = Math.floor(data.length / CUBES_NUM)
    , NO_SIGNAL = 160;

var cubes = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xEEEEEE, 0.2);
document.body.appendChild(renderer.domElement);

for (var x = -3; x <= 3; x++) {
  for (var z = -3; z <= 3; z++) {
    let geometry = new THREE.BoxGeometry(1, 1, 1);

    for (var i = geometry.faces.length - 1; i >= 0; i--) {
      if (i !== 4 && i !== 5) {
        geometry.faces[i].color.setHex(0x66ff66);
      }
    }

    if (x === -3) {
      geometry.faces[2].color.setHex(0xEEEEEE);
      geometry.faces[3].color.setHex(0xEEEEEE);
    }

    if (z === -3) {
      geometry.faces[10].color.setHex(0xEEEEEE);
      geometry.faces[11].color.setHex(0xEEEEEE);
    }

    if (x === 3) {
      geometry.faces[0].color.setHex(0xEEEEEE);
      geometry.faces[1].color.setHex(0xEEEEEE);
    }

    if (z === 3) {
      geometry.faces[8].color.setHex(0xEEEEEE);
      geometry.faces[9].color.setHex(0xEEEEEE);
    }

    let material = new THREE.MeshLambertMaterial({color: 0xEEEEEE, vertexColors: THREE.FaceColors});
    let cube = new THREE.Mesh(geometry, material);

    cube.position.x = 1.05 * x;
    cube.position.z = 1.05 * z;

    cubes.push(cube);
    scene.add(cube);
  }
}

// Base lighting
var light = new THREE.PointLight(0x9E15EC, 1, 100, 2);
light.position.set(-4, 1, -1);
scene.add(light);

var light = new THREE.PointLight(0x0B8AE2, 1, 100, 2);
light.position.set(4, 1, 1);
scene.add(light);

// Ambient light
scene.add(new THREE.AmbientLight(0xbfbfbf));

function render() {
  requestAnimationFrame(render);

  for (let i = 0, n = 0; i < cubes.length; i++, n+=STEP) {
    let val = Math.abs(data[n]) / NO_SIGNAL;

    cubes[i].scale.y -= 0.85;
    cubes[i].scale.y += Math.abs(data[n]) / NO_SIGNAL;

    if (cubes[i].scale.y <= 1) {
      cubes[i].scale.y = 1;
    }

    cubes[i].position.y = (cubes[i].scale.y / 2) - 0.5;
  }

  delta += 0.006;
  dist = 8;

  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.position.x = Math.sin(delta) * dist;
  camera.position.y = Math.cos(62) * dist;
  camera.position.z = Math.cos(delta) * dist;

  renderer.render(scene, camera);
}

render();

// Pause / play audio on page click
document.body.addEventListener('click', function(ev) {
  if (audio) {
    if (audio.paused()) {
      audio.play();
    } else {
      audio.pause();
    }
  }
});

document.body.addEventListener('touchend', function(ev) {
  context.resume();
});

loadAudioElement('https://s3.eu-west-2.amazonaws.com/nelsoncodepen/Cutside_-_08_-_Amaterasu.mp3').then(function(elem) {
  audio = Object.create(Sound);
  audio.element = elem;
  // audio.play();
}, function(elem) {
  throw 'Audio Failed to load';
});