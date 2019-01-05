var num_rows = null;
    num_cols = null;
    block_size = null;
    concentration = null;
    delta = null;
    steps = null;
    canv = null;
    ctx = null;
    game_board = null;
    mtype = null;
    o_img = null;
    h1_img = null;
    h0_img = null;

function Molecule(type){
  if (type=="o"){
    this.type = type;
    this.n = 1;
    this.e = 1;
    this.s = 1;
    this.w = 1;
  }
  if (type=="h"){
    this.type = type;
    this.n = 1;
    this.e = 0;
    this.s = 1;
    this.w = 0;
  }
  this.flip();
}
Molecule.prototype.flip = function() {
  var o_n = this.n;
  var o_e = this.e;
  var o_s = this.s;
  var o_w = this.w;
  var ran = random(1,4);
  if (ran == 1){
    this.n = o_e;
    this.e = o_s;
    this.s = o_w;
    this.w = o_n;
  }
  if (ran == 2){
    this.n = o_s;
    this.e = o_w;
    this.s = o_n;
    this.w = o_e;
  }
  if (ran == 3){
    this.n = o_w;
    this.e = o_n;
    this.s = o_e;
    this.w = o_s;
  }
};
Molecule.prototype.toString = function() {
  return this.n + "" + this.e + "" + this.s + "" + this.w + " ";
  return this.type;
}

function next(){
  steps = $("#steps").val();
  for (x = 0; x < steps; x++) {
    doStep();
  }
  draw();
}

function doStep(){
  //select random Molecule
  var flag = true;
  while(flag){
    var or_x = random(0, game_board.length);
    var or_y = random(0, game_board[0].length);
    if (game_board[or_x][or_y]!=null){
      flag = false;
    }
  }

  /*console.log("----------------dostep----------------------");
  console.log("Origional: " + game_board[or_x][or_y]);
  console.log("Origional: " + or_x + ":" + or_y);*/

  var m1 = game_board[or_x][or_y];
  var m2 = new Molecule(game_board[or_x][or_y].type);
  game_board[or_x][or_y] = null;

  var potential_spots = [];
  potential_spots.push([or_x, or_y]);
  if (getSquareMol(or_x, or_y, 'n')==null){
    potential_spots.push(getSquare(or_x, or_y, 'n'));
  }
  if (getSquareMol(or_x, or_y, 'e')==null){
    potential_spots.push(getSquare(or_x, or_y, 'e'));
  }
  if (getSquareMol(or_x, or_y, 's')==null){
    potential_spots.push(getSquare(or_x, or_y, 's'));
  }
  if (getSquareMol(or_x, or_y, 'w')==null){
    potential_spots.push(getSquare(or_x, or_y, 'w'));
  }

  var r = random(0, potential_spots.length - 1);
  var spot = potential_spots[r];

  var o_energy = calcEnergy(or_x, or_y, m1);
  var n_energy = calcEnergy(spot[0], spot[1], m2);
  var change_energy = o_energy - n_energy;

  var odds = Math.pow(Math.E, -change_energy * delta);
  var roll = Math.random();
  if (roll < odds){
    //console.log("HAPPENED")
    //molecule moves


    game_board[spot[0]][spot[1]] = m2;
  }else{
    game_board[or_x][or_y] = m1;
  }



  /*console.log("Potential spots: " + potential_spots);
  console.log("Spot: " + spot);

  console.log("m2: " + m2);
  console.log("O Energy: " + o_energy);
  console.log("N Energy: " + n_energy);
  console.log("Odds: " + odds);*/



}

function start(){


  canv = document.getElementById('canv');
  ctx = canv.getContext("2d");
  num_rows = $("#rows").val();
  num_cols = $("#cols").val();
  concentration = $("#dist").val();
  delta = $("#delta").val();
  mtype = $("#mtype").val();

  o_img = new Image();
  o_img.src = 'o.png'
  h1_img = new Image();
  h1_img.src = 'h1.png'
  h0_img = new Image();
  h0_img.src = 'h0.png'
  h0_img.onload = function() {
    draw();
  };


  block_size = Math.min(canv.height / num_rows, canv.width / num_cols)
  game_board = createBoard();
  createMolecules();


  $("#config").hide();
  $("#sim").show();

}

function draw(){
  ctx.clearRect(0, 0, canv.width, canv.height);
  drawMolecules();
  drawBoard();
  //debug();
}

function drawBoard(){
  var x;

	for (x = 0; x < num_cols; x++) {
    var y;
    for (y = 0; y < num_rows; y++) {
      ctx.beginPath();
      ctx.rect(x * block_size, y * block_size, block_size, block_size);
      ctx.strokeStyle = "#000000";
	    ctx.stroke();
      //await sleep(2000);
	  }

	}
}
function drawMolecules(){
  for (x = 0; x < game_board.length; x++) {
    for (y = 0; y < game_board[x].length; y++) {
      if(game_board[x][y] != null){
        drawMolecule(x, y)
      }
    }
  }

}
function drawMolecule(x, y){
  m = game_board[x][y];
  if (m.type == 'o'){
    /*ctx.beginPath();
    ctx.fillRect(x * block_size, y * block_size, block_size, block_size);
    ctx.strokeStyle = "grey";
    ctx.stroke();*/
    ctx.drawImage(o_img, x * block_size, y * block_size, block_size - 1, block_size - 1);

  }
  /*if (m.type == 'h'){
    o_img = new Image();
    if (m.n == 1){
      o_img.src = 'h0.png'
    }else{
      o_img.src = 'h1.png'
    }
    o_img.onload = function() {
      ctx.drawImage(o_img, x * block_size, y * block_size, block_size, block_size);
    };
  }*/
  if (m.type == 'h'){
    if (m.n == 1){
      ctx.drawImage(h0_img, x * block_size, y * block_size, block_size, block_size);
    }else{
      ctx.drawImage(h1_img, x * block_size, y * block_size, block_size, block_size);
    }
  }
  return 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function debug(){
  console.log("num_rows: " + num_rows);
  console.log("num_cols: " + num_cols);
  console.log("block_size: " + block_size);
  console.log("concentration: " + concentration);
  console.log("molecule type: " + mtype);
  console.log("gameboard: ");


  for (var a = 0; a < game_board[0].length; a++) {
    var row = "";
    for (var b = 0; b < game_board.length; b++) {
      if (game_board[b][a]!= null){
        row = row + game_board[b][a].toString();
      }else{
        row = row + "---- ";
      }

    }
    console.log(row);
  }
  //console.log(game_board[1][0]);
  //console.log(getSquareMol(1, 0, 'n'));
  console.log("en " + calcEnergy(1, 1, game_board[1][1]));



  /*for (var x = 0; x < game_board.length; x++) {
    console.log(game_board[x].toString());
  }*/

}

function createBoard(){
  var array;
  game_board = [];
  for (x = 0; x < num_cols; x++) {
    array = []
    for (y = 0; y < num_rows; y++) {
      array.push(null);
    }
    game_board.push(array);
  }
  return game_board;
}
function createMolecules(){
  var total_spots = num_rows * num_cols;
  var spots_to_fill = Math.round(total_spots * concentration)

  for (var x = 0; x < spots_to_fill; x++) {
    injectMolecule(mtype);
  }
}
function injectMolecule(type){
  var m = new Molecule(mtype);
  var flag = true;
  while (flag){
    var x = random(0, game_board.length);
    var y = random(0, game_board[0].length);
    if (game_board[x][y] == null){
      game_board[x][y] = m;
      flag = false;
    }
  }
}
function calcEnergy(x, y, m){
  if (m == null){
    return 0;
  }
  var energy = 0;
  //Check n square
  if (getSquareMol(x, y, 'n') != null && m.n == 1){
    if (getSquareMol(x, y, 'n').s == 1){
      energy = energy + 1;
    }
  }
  //Check e square
  if (getSquareMol(x, y, 'e') != null && m.e == 1){
    if (getSquareMol(x, y, 'e').w == 1){
      energy = energy + 1;
    }
  }
  //Check s square
  if (getSquareMol(x, y, 's') != null && m.s == 1){
    if (getSquareMol(x, y, 's').n == 1){
      energy = energy + 1;
    }
  }
  //Check w square
  if (getSquareMol(x, y, 'w') != null && m.w == 1){
    if (getSquareMol(x, y, 'w').e == 1){
      energy = energy + 1;
    }
  }
  return energy;
}
//Return the square to the direction specified according to dynamic boundaries
function getSquare(x, y, direction){
  //North
  if (direction == "n"){
    if (y == 0){
      return [x, game_board[0].length - 1];
    }else{
      return [x, y - 1];
    }
  }
  //South
  if (direction == "s"){
    if (y == game_board[0].length - 1){
      return [x, 0];
    }else{
      return [x, y + 1];
    }
  }
  //East
  if (direction == "e"){
    if (x == game_board.length - 1){
      return [0, y];
    }else{
      return [x + 1, y];
    }
  }
  //West
  if (direction == "w"){
    if (x == 0){
      return [0, game_board.length - 1];
    }else{
      return [x - 1, y];
    }
  }
}
function getSquareMol(x, y, direction){
  var loc = getSquare(x, y, direction);
  //console.log(loc)
  return game_board[loc[0]][loc[1]];
}
