var camera, scene, renderer, ambientLightID, videoFrame, videoPlayer;


$(document).ready(function() {
  videoFrame = $('#videoplayer')[0];
  videoPlayer = $f(videoFrame);

  videoPlayer.addEvent('ready', function() {
    videoPlayer.addEvent('finish', stopVideo);
  });

  setPlayerSize();

  if(Modernizr.webgl) {
    initThirdDimension();
    animateThirdDimension();
  } else {
    // fallback on the static version
  }

  window.addEventListener( 'resize', onWindowResize, false );
})



function playVideo() {
  var ambientLight = scene.getObjectById(ambientLightID);
  ambientLight.color.setHex( 0x111111 );

  $('body').velocity({
    backgroundColor: "#111111"
  });

  $('#video').velocity("fadeIn");

  $('#video').on('click', function() {
    stopVideo();
  });

  videoPlayer.api('play');
}



function stopVideo() {
  var ambientLight = scene.getObjectById(ambientLightID);
  ambientLight.color.setHex( 0xdedede );

  $('body').velocity({
    backgroundColor: "#FDDE2E"
  });

  $('#video').velocity("fadeOut");

  videoPlayer.api('pause');
}



function setPlayerSize() {
  var videoHeight = ( window.innerWidth/16 ) * 9;
  if (videoHeight > window.innerHeight - 200) {
    videoHeight = window.innerHeight - 200;
  }
  $('#videoplayer').css('height',videoHeight);
}



function moreInformation() {
  $('button.info').toggleClass('active');
  if ($('button.info').hasClass('active')) {
    $('article.information').velocity("fadeIn");
  } else {
    $('article.information').velocity("fadeOut");
  }
}



function initThirdDimension() {
  // Create the Three.js renderer
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  // Create the Three.js Camera
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;

  // Create the scene
  scene = new THREE.Scene();

  // add ambient lighting
  var ambient = new THREE.AmbientLight( 0xdedede );
  ambientLightID = ambient.id;
  scene.add( ambient );

  // add directional lighting
  var directionalLight = new THREE.DirectionalLight(0x555555);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add( directionalLight );

  // Brick sizes and material
  var fourSixBrick = new THREE.BoxGeometry( 40, 60, 10 );
  var twoSixBrick = new THREE.BoxGeometry( 20, 60, 10 );

  var brickMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('images/gas.jpg')
  });

  // OSB Plane sizes and material
  var largeOSBPlane = new THREE.BoxGeometry( 244, 122, 2 );
  var squareOSBPlane = new THREE.BoxGeometry( 122, 122, 2 );
  var regularOSBPlane = new THREE.BoxGeometry( 122, 61, 2 );
  var pedestalOSBPlane = new THREE.BoxGeometry( 61, 61, 2 );

  var OSBMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('images/osb.jpg')
  });

  // Create 25 objects that can be Bricks or OSB Planes
  for (i=0; i<25; i++) {
    var mesh, name, mat, obj;
    var x = getRandom('width');
    var y = getRandom('height');
    var z = getRandom('depth');
    var rotX = getRandom('rotation');
    var rotY = getRandom('rotation');
    var rotZ = getRandom('rotation');
    switch( getRandom('object') ) {
      case 1:
        mesh = largeOSBPlane;
        mat = OSBMaterial;
        name = 'largeOSBPlane';
      case 2:
        mesh = squareOSBPlane;
        mat = OSBMaterial;
        name = 'squareOSBPlane';
      case 3:
        mesh = regularOSBPlane;
        mat = OSBMaterial;
        name = 'regularOSBPlane';
      case 4:
        mesh = pedestalOSBPlane;
        mat = OSBMaterial;
        name = 'pedestalOSBPlane';
        break;
      case 5:
      case 6:
      case 7:
        mesh = twoSixBrick;
        mat = brickMaterial;
        name = 'twoSixBrick';
      case 8:
      case 9:
      case 10:
      default:
        mesh = fourSixBrick;
        mat = brickMaterial;
        name = 'fourSixBrick';
    }
    
    obj = new THREE.Mesh( mesh, mat );
    obj.name = name;
    obj.overdraw = true;
    obj.position.set( x, y, z );
    obj.rotation.set( rotX, rotY, rotZ );
    scene.add(obj);
  }
}



function getRandom(type) {
  switch(type) {
    case 'width':
      return Math.floor( ( Math.random() * window.innerWidth * 0.8 ) - window.innerWidth * 0.4 );
    case 'height':
      return Math.floor( ( Math.random() * window.innerHeight * 0.8 ) - window.innerHeight * 0.4 );
    case 'depth':
      return Math.floor( ( Math.random() * 199 ) - 200 );
    case 'rotation':
      return Math.floor( Math.random() * 2 );
    case 'object':
      return Math.ceil( Math.random() * 10 );
    default:
      return Math.random();
  }
}



function onWindowResize() {
  setPlayerSize();
  if(Modernizr.webgl) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
}



function animateThirdDimension() {

  requestAnimationFrame( animateThirdDimension );

  for(i = 0; i < scene.children.length; i++) {
    var child = scene.children[i];
    if (child.type == 'Mesh') {
      child.rotation.x += 0.002;
      child.rotation.y += 0.001;

      child.translateX( 0.05 );
      child.translateY( 0.05 );
    
    }
  }

  renderer.render( scene, camera );
}