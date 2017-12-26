document.getElementById('showHideContainer').onclick = function() {
    divTest = document.getElementById('linkContainer2');
    if (divTest.style.display === "none") {
        divTest.style.display = 'block';
    }
    else {
        divTest.style.display = "none";
    }
}


var __boxBlack = new THREE.MeshBasicMaterial({color:"#ff0000"});

function __box(l) {
	var boxGeo = new THREE.CylinderGeometry(.1,.1, l);
	for(var i =0;i< boxGeo.vertices.length;i++) {
		boxGeo.vertices[i].y+=l/2;
		var gi = boxGeo.vertices[i];
		var tz = gi.z;
		gi.z = gi.y;
		gi.y = -tz;
	}
	var bufferGeo = new THREE.BufferGeometry().fromGeometry(boxGeo);
	return new THREE.Mesh(bufferGeo, __boxBlack);
}


var IKJoint = function(p,pLength, q,qLength,poleVector) {
	this.p = p;
	this.q = q;
	this.pr = pLength;
	this.qr = qLength;
	this.poleVector = poleVector;
	this.line = new THREE.Line3(p,q);
	this.elbow = new THREE.Vector3();
}


IKJoint.prototype.solve = function() {
	var pq = this.q.clone().sub(this.p);
	this.line.start = this.p;
	this.line.end = this.q;
	var dSquared = pq.lengthSq();
	var dist = Math.sqrt(dSquared);

	if(dist>this.pr+this.qr){
		this.outcome = IKJoint.TOO_FAR;
		return;
	}


	if(dist<Math.abs(this.pr-this.qr)) {
		this.outcome = IKJoint.TOO_CLOSE;
		return;
	}

	pq.normalize();

	this.outcome = IKJoint.SOLVED;
	//손 위치
	var a =   (this.pr*this.pr - this.qr*this.qr + dSquared) / (2 * dist);
	var h = Math.sqrt(this.pr*this.pr - a*a);
//관절 연결 
	var pivot = this.p.clone().add(pq.clone().multiplyScalar(a));
	var pqNormal = 
		this.line.closestPointToPoint(this.poleVector, false)
		.sub(this.poleVector)
		.normalize();

   this.elbow.lerp(pivot.clone().add(pqNormal.clone().multiplyScalar(-h)),1);

};

IKJoint.prototype.debugDraw = function(scene) {
	if(!this.pStick) {
		this.pStick = __box(this.pr);
		scene.add(this.pStick);
	}
	if(!this.qStick) {
		this.qStick = __box(this.qr);
		scene.add(this.qStick);
	}


	this.pStick.position.lerp(this.elbow,1);
	this.qStick.position.lerp(this.elbow,1);
	this.pStick.lookAt(this.p);
	this.qStick.lookAt(this.q);

};


/*----*/

var Drunkard = function(opts) {
	this.init(opts);
};
var proto = Drunkard.prototype;


proto.init = function(opts) {



	this.hipWidth = 0.1;
	this.hipX = 0.32;
	this.hipY = 0.1;
	this.shoulderX = 0.5;
	this.shoulderY = 0.4;


	this.body = new THREE.Object3D();
	this.hipRoot = 	dot();
	this.hipRoot.position.y = 1.9;


	this.body.add(this.hipRoot);

	this.leftLegRoot = dot();
	this.leftLegRoot.position.set(-this.hipX, -this.hipY,0);
	this.hipRoot.add(this.leftLegRoot);

	this.rightLegRoot = dot();
	this.rightLegRoot.position.set(this.hipX, -this.hipY,0);
	this.hipRoot.add(this.rightLegRoot);


	this.FORWARD = new THREE.Vector3(0,0,100);
	this.BACKWARD = new THREE.Vector3(0,0,-100);


	this.leftFoot = dot();
	this.body.add(this.leftFoot);
	this.leftFoot.position.y = 0.1;
	this.leftFoot.position.x = -this.hipX;
	this.leftFoot.position.z = -1;

	this.rightFoot = dot();
	this.body.add(this.rightFoot);
	this.rightFoot.position.y = 0.1;
	this.rightFoot.position.x = this.hipX;
	this.leftLeg = new IKJoint(new THREE.Vector3(),1, this.leftFoot.position,1,this.FORWARD);


	this.leftHip = __box(this.leftLegRoot.position.length());
	this.rightHip = __box(this.rightLegRoot.position.length());
	this.hipRoot.add(this.leftHip);
	this.leftHip.lookAt(this.leftLegRoot.position);


	this.hipRoot.add(this.rightHip);
	this.rightHip.lookAt(this.rightLegRoot.position);
	this.rightLeg = new IKJoint(new THREE.Vector3(),1, this.rightFoot.position,1,this.FORWARD);


	this.shoulderRoot = dot();
	this.body.add(this.shoulderRoot);
	this.shoulderRoot.position.y = 3.5;

	this.backJoint = new IKJoint(this.shoulderRoot.position,1.1, this.hipRoot.position,0.9, this.BACKWARD);

	this.leftArmRoot = dot();
	this.shoulderRoot.add(this.leftArmRoot);
	this.leftArmRoot.position.set(-this.shoulderX,-this.shoulderY,0);

	this.rightArmRoot = dot();
	this.shoulderRoot.add(this.rightArmRoot);
	this.rightArmRoot.position.set(this.shoulderX,-this.shoulderY,0);

	this.leftWrist = dot();
	this.body.add(this.leftWrist);
	this.leftWrist.position.set(-this.shoulderX*0.5, 4-this.shoulderY-0.3,1.5);

	this.rightWrist = dot();
	this.body.add(this.rightWrist);
	this.rightWrist.position.set(this.shoulderX*0.5, 4-this.shoulderY-0.3,1.5);

	var LOWER_LEFT = new THREE.Vector3(-100,-100,-100);
	var LOWER_RIGHT = new THREE.Vector3(100,-100,-100);

	this.rightArm = new IKJoint(this.rightArmRoot.position, .85, this.rightWrist.position,.85, LOWER_RIGHT);
	this.leftArm  = new IKJoint(this.leftArmRoot.position, .85, this.leftWrist.position,.85, LOWER_LEFT);

	this.leftShoulder = __box(this.leftArmRoot.position.length());
	this.rightShoulder = __box(this.rightArmRoot.position.length());

	this.shoulderRoot.add(this.leftShoulder);
	this.leftShoulder.lookAt(this.leftArmRoot.position);

	this.shoulderRoot.add(this.rightShoulder);
	this.rightShoulder.lookAt(this.rightArmRoot.position);

	this.shoulderRoot.rotation.x = 0.05;

	this.head = dot();
	this.head.scale.multiplyScalar(3);
	this.shoulderRoot.add(this.head);
	this.head.position.y = 0.4;

	this. ikJoints = [this.leftLeg, this.rightLeg,
					this.leftArm, this.rightArm,
					this.backJoint];

	this.endLocators = [this.leftLegRoot,this.rightLegRoot,
					   this.leftArmRoot,this.rightArmRoot];
	this.leftInFlight = false;
	this.leftVY = 0;
	this.leftLeg.foot = this.leftFoot;
	this.leftLeg.vY = 0;

	this.rightLeg.foot = this.rightFoot;
	this.rightLeg.vY = 0;

	this.rightInFlight = false;
   	this.addKnees();
   	this.footRoot = dot();
   	this.body.add(this.footRoot);


};

proto.addKnees = function() {
	this.knees = [];
	for(var i =0;i<this.ikJoints.length;i++) {
		var knee = dot();
		this.body.add(knee);
		this.knees.push(knee);
	}
};


proto.updateLeg = function(leg,other) {
	if(!leg.inFlight) {
		leg.foot.position.x+=this.outwards.x;
		leg.foot.position.z+=this.outwards.z;

		var jointLength = leg.p.distanceTo(leg.foot.position);
		// console.log("the d is ", jointLength);
		var extendedDistance = leg.pr+leg.qr;
		if(jointLength>extendedDistance*0.85) {
			//we should only launch if the foot is closer to the camera than the hip.
			var footDist= camera.position.clone().sub(this.body.localToWorld(leg.foot.position));
			var hipDist= camera.position.clone().sub(this.body.position);
			footDist.y = hipDist.y = 0;

			if(footDist.lengthSq()<hipDist.lengthSq() &&!other.inFlight ) {
				leg.inFlight = true;
				leg.vY = 0.2;
			}

		}
	} else {
		leg.vY -=0.02;
		leg.foot.position.y+=leg.vY;
		// console.log("foot @",leg.foot.position.y.toFixed(2));
		leg.foot.position.x -= 1.7*this.outwards.x;
		leg.foot.position.z -= 1.7*this.outwards.z;
		if(leg.foot.position.y<0) {
			leg.foot.position.y = 0;
			// console.log("landing!");
			leg.inFlight = false;
		}
	}

};

proto.update = function() {


	var tempo = Date.now()/200;


	this.outwards = camera.position.clone().sub(controls.target).normalize().multiplyScalar(.09);

	this.updateLeg(this.leftLeg, this.rightLeg);
	this.updateLeg(this.rightLeg,this.leftLeg);

	var betweenFeet = this.leftFoot.position.clone().lerp(this.rightFoot.position.clone(),  0.5);
	var oy = betweenFeet.y;
	betweenFeet.y = 0;
	this.footRoot.position.lerp(betweenFeet,1.);
	betweenFeet.y = this.hipRoot.position.y;

	
	 this.shoulderRoot.position.lerp(betweenFeet,0.5);
	 if(this.leftLeg.inFlight  ||this.rightLeg.inFlight) {
	 	this.hipRoot.position.y-=0.004;
	 } else {
	 	this.hipRoot.position.y+=0.02;

	 }

	this.leftFoot.position.y = .3*Math.abs(Math.cos(tempo/2));
	this.leftFoot.position.z = .7*Math.sin(tempo)+.05;
	this.leftFoot.position.x = .2*Math.sin(tempo)-.1;

	this.rightFoot.position.y = .3*Math.abs(Math.sin(tempo/2));
	this.rightFoot.position.z = .7*-Math.sin(tempo)+.05;
	this.rightFoot.position.x = .2*Math.cos(tempo)+.1;

	this.shoulderRoot.position.x = 0.1*Math.cos(tempo)
	this.shoulderRoot.position.y = 3.8+0.1*Math.cos(tempo*2)
	this.shoulderRoot.rotation.z = 0.2*Math.cos(tempo)
	this.hipRoot.rotation.z = 0.2*Math.sin(tempo);
	this.hipRoot.rotation.y = 0.2*Math.sin(tempo);
	this.hipRoot.position.y = 2+0.01*Math.sin(tempo*2);
	this.hipRoot.position.x = 0.02*Math.sin(tempo);

	this.leftWrist.position.set( -0.6,//-0.2+0.6*Math.sin(Date.now()/300),
									2.6,
								0.5-0.45*Math.sin(tempo));

	this.rightWrist.position.set(0.6,//0.2+0.6*Math.sin(Date.now()/300),
									2.6,
								0.5+0.45*Math.sin(tempo));


	for(var  i =0;i<this.ikJoints.length;i++) {
		if(this.endLocators[i]) {
			bindJointEnd(this.ikJoints[i], this.endLocators[i]);
		}
		this.ikJoints[i].solve();
		this.ikJoints[i].debugDraw(this.body);
		this.knees[i].position.lerp(this.ikJoints[i].elbow,1);
	}

}

function bindJointEnd(ikJoint, locator) {
	ikJoint.p = locator.parent.localToWorld(locator.position.clone());
}

//전체적인 점 크기
function dot() {
		return new THREE.Mesh(
			new THREE.SphereBufferGeometry(0.1, 6,5),
			new THREE.MeshBasicMaterial({color:"#FFDAB9"}));
};






var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor(0xffffff,1);

document.body.style.backgroundColor = "white";
scene.fog = new THREE.FogExp2(0xffffff,0.03);

renderer.setSize(innerWidth,innerHeight);

var camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight,0.1, 1000);
camera.position.y = 6;
camera.position.z = -15;

camera.lookAt(new THREE.Vector3(0,3,0));

//바닥 질감
	


	var sphereGeometry = new THREE.SphereGeometry(50, 32, 16);
	material.side = THREE.BackSide;
	var sphere = new THREE.Mesh( sphereGeometry, material );
	var loader = new THREE.TextureLoader();
	loader.load( 'land_ocean_ice_cloud_2048.jpg', function ( texture ) {
	var geometry = new THREE.SphereGeometry( 200, 20, 20 );
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
	var mesh = new THREE.Mesh( geometry, material );
	group.add( mesh );
				} );
	sphere.position.set(0, -50, 0);
	scene.add( sphere );

var floor = new THREE.Mesh(
					new THREE.PlaneGeometry(0,0,0,0),
					new THREE.MeshPhongMaterial({

						map:new THREE.Texture()
						
					}));

var drunkard = new Drunkard();
scene.add(drunkard.body);

document.body.appendChild(renderer.domElement);


var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.y = 1;
controls.target.z = 1;
controls.update();



//빛과 그림자
var spotLight = new THREE.SpotLight( 0xffffff,1.2);
scene.add( spotLight );

spotLight.position.set( 0, 13,-7 );


spotLight.castShadow = true;
spotLight.angle = 0.7;


spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;


spotLight.shadow.camera.updateProjectionMatrix();

spotLight.decay = 0;
spotLight.distance = 50;

scene.add(new THREE.AmbientLight(0xffffff,0.0));



var doneTraverse = false;

controls.enableDamping = true;
controls.autoRotate = true;

document.addEventListener('mousedown', onMouseMove);
function onMouseMove (argument) {
		controls.autoRotate = false;

}

floor.rotation.z = Math.PI/2;
function update (time) {

	requestAnimationFrame(update);
	drunkard.update();
	controls.update();

	spotLight.position.x =02*Math.sin(Date.now()/500);

	floor.material.map.offset.x-=0.005;
		 


	if(!doneTraverse) {

		scene.traverse(function(el){
			if(el.material) {
				el.castShadow = true;
				el.receiveShadow = true;
			}
		});
		}


	try {

	renderer.render(scene,camera);
	} catch(err) {}

}

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

update();
