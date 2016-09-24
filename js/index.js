(function() {
  function chain(obj, calls) {
    for (let call of calls) {
      let method = call.shift();
      obj[method].apply(obj, call);
    }
    return obj;
  }

  function createScene(canvas, engine) {

    let scene = new BABYLON.Scene(engine);

    let camera = chain(new BABYLON.UniversalCamera('camera1',
      new BABYLON.Vector3(-15, 0, 0),
      scene), [
      ['attachControl', canvas, false]
    ]);

    camera.lockedTarget=BABYLON.Vector3.Zero();


    let light = new BABYLON.HemisphericLight('light1', 
                                             new BABYLON.Vector3(0, 1, 0), 
                                             scene);

    let grid = new BABYLON.GridMaterial('grid', scene);
    grid.lineColor = new BABYLON.Color3(1,0,0);
    grid.opacity = 0.05;
    grid.gridRatio = 0.1;
    grid.majorUnitFrequency = 1;

    let red = new BABYLON.StandardMaterial('red', scene);
    red.diffuseColor = new BABYLON.Color3(1,0,0);
    red.alpha = 0.8;

    let white = new BABYLON.StandardMaterial('white', scene);
    white.diffuseColor = new BABYLON.Color3(1,1,1);
    white.alpha = 0.8;

    let clear = new BABYLON.StandardMaterial('clear', scene);
    clear.diffuseColor = new BABYLON.Color3(1,1,1);
    clear.alpha = 0.25;

    let drawSquare= function(x, y, z) {
      for (let i=0; i<2; ++i) {
        for (let j=0; j<2; ++j) {
          let box = BABYLON.Mesh.CreateBox("level"+x+y+z, 1, scene);
          box.scaling.x = 1;
          box.scaling.z = 1;
          box.scaling.y = 0.1;
          if ((Math.abs(x)+j+i+Math.abs(z))%2 == 1) {
            box.material = clear;
          } else {
            box.material = [red, white][(x+j+y+i+z)%2]
          }
          box.position.x = x + j;
          box.position.y = y;
          box.position.z = z + i;
        }
      }
    };

    let box = BABYLON.Mesh.CreateBox("volume", 1, scene);
    box.scaling.x = 6;
    box.scaling.y = 7;
    box.scaling.z = 10;
    box.position.x= 0.5;
    box.position.y= 0.5;
    box.position.z= 0.5;
    box.material = grid;

    // black attack boards
    drawSquare(-2,3,4);
    drawSquare( 2,3,4);

    // black level
    drawSquare(-1,2,3);
    drawSquare( 1,2,3);
    drawSquare(-1,2,1);
    drawSquare( 1,2,1);

    // main level
    drawSquare(-1,0,1);
    drawSquare( 1,0,1);
    drawSquare(-1,0,-1);
    drawSquare( 1,0,-1);

    // white level
    drawSquare(-1,-2,-1);
    drawSquare( 1,-2,-1);
    drawSquare(-1,-2,-3);
    drawSquare( 1,-2,-3);

    // white attack boards
    drawSquare(-2,-3,-4);
    drawSquare( 2,-3,-4);

    //drawSquare(-2,2,2);
    //var ball = BABYLON.Mesh.CreateSphere('sphere1', scene);
    //ball.x = ball.y = ball.z = 0;



    //let ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

    return scene;
  }

  window.addEventListener('DOMContentLoaded', function() {
    let canvas = document.getElementById('3d_canvas');
    let engine = new BABYLON.Engine(canvas, true);
    let scene = createScene(canvas, engine);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
  });
})();
