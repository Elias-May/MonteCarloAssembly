$( document ).ready(function() {
  var delta_values = [0,0.5,1,2,3,4,5,6,8,10];    //values to step to

  var delta_slider = document.getElementById('delta_slider'),
     delta = document.getElementById('delta');

  delta_slider.oninput = function(){
      delta.innerHTML = delta_values[this.value];
  };
  delta_slider.oninput(); //set default value

  var step_values = [1,10,100,1000,10000,100000,1000000];    //values to step to

  var step_slider = document.getElementById('step_slider'),
     steps = document.getElementById('steps');

  step_slider.oninput = function(){
      steps.innerHTML = step_values[this.value];
  };
  step_slider.oninput();



  var speed_values = [200, 100, 50, 30, 10, 0];    //values to step to

  var speed_slider = document.getElementById('speed_slider'),
     speed2 = document.getElementById('speed');

  speed_slider.oninput = function(){
      speed2.innerHTML = parseInt(this.value) + 1;
      speed = speed_values[this.value];
      if (playing){
        clearInterval(interval)
        interval = setInterval(next, speed);
      }
  };
  speed_slider.oninput(); //set default value


  var row_slider = document.getElementById('row_slider'),
     rows = document.getElementById('row');

  row_slider.oninput = function(){
      row.innerHTML = this.value;
  };
  row_slider.oninput();

  var col_slider = document.getElementById('col_slider'),
     cols = document.getElementById('col');

  col_slider.oninput = function(){
      col.innerHTML = this.value;
  };
  col_slider.oninput();

  var conc_slider = document.getElementById('conc_slider'),
     conc = document.getElementById('conc');

  conc_slider.oninput = function(){
      conc.innerHTML = this.value;
  };
  conc_slider.oninput();




  var col_slider = document.getElementById('col_slider'),
     cols = document.getElementById('col');

  col_slider.oninput = function(){
      col.innerHTML = this.value;
  };
  col_slider.oninput();
});




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
    debug = null;
    speed = 0;
    interval = null
    playing = false;

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
  if (type=="r"){
    this.type = type;
    this.n = 1;
    this.e = 1;
    this.s = 0;
    this.w = 0;
  }
  if (type=="k"){
    this.type = type;
    this.n = 1;
    this.e = 0;
    this.s = 0;
    this.w = 0;
  }
  if (type=="u"){
    this.type = type;
    this.n = 1;
    this.e = 1;
    this.s = 0;
    this.w = 1;
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

function play(){
  interval = setInterval(next, speed);
  playing = true;
  $("#play_button").hide();
  $("#pause_button").show();
}
function pause(){
  clearInterval(interval)
  playing = false;
  $("#play_button").show();
  $("#pause_button").hide();
}

function next(){
  steps = $("#steps").html();
  delta = $("#delta").html();
  if ($("#debug").val() == 1){
    debug = true;
  }else{
    debug = false;
  }
  for (x = 0; x < steps; x++) {
    doStep();
  }
  draw();
}

function doStep(){
  //select random Molecule
  var flag = true;
  while(flag){
    var or_x = random(0, game_board.length - 1);
    var or_y = random(0, game_board[0].length - 1);
    if (game_board[or_x][or_y]!=null){
      flag = false;
    }
  }

  if (debug){
    console.log("----------------dostep----------------------");
    console.log("Origional: " + game_board[or_x][or_y]);
    console.log("Origional: " + or_x + ":" + or_y);
  }


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
    if (debug){
      console.log("HAPPENED")
    }

    //molecule moves


    game_board[spot[0]][spot[1]] = m2;
  }else{
    game_board[or_x][or_y] = m1;
  }


  if (debug){
    console.log("Potential spots: " + potential_spots);
    console.log("Spot: " + spot);

    console.log("m2: " + m2);
    console.log("O Energy: " + o_energy);
    console.log("N Energy: " + n_energy);
    console.log("Odds: " + odds);
  }




}

function start(){


  canv = document.getElementById('canv');
  ctx = canv.getContext("2d");
  num_rows = $("#row").html();
  num_cols = $("#col").html();
  concentration = $("#conc").html();

  if (document.getElementById('o').checked) {
    mtype = 'o'
  }
  if (document.getElementById('h').checked) {
    mtype = 'h'
  }
  if (document.getElementById('r').checked) {
    mtype = 'r'
  }
  if (document.getElementById('k').checked) {
    mtype = 'k'
  }
  if (document.getElementById('u').checked) {
    mtype = 'u'
  }


  o_img = new Image();
  o_img.src = 'o.png'
  r0_img = new Image();
  r0_img.src = 'r0.png'
  r1_img = new Image();
  r1_img.src = 'r1.png'
  r2_img = new Image();
  r2_img.src = 'r2.png'
  r3_img = new Image();
  r3_img.src = 'r3.png'
  k0_img = new Image();
  k0_img.src = 'k0.png'
  k1_img = new Image();
  k1_img.src = 'k1.png'
  k2_img = new Image();
  k2_img.src = 'k2.png'
  k3_img = new Image();
  k3_img.src = 'k3.png'
  u0_img = new Image();
  u0_img.src = 'u0.png'
  u1_img = new Image();
  u1_img.src = 'u1.png'
  u2_img = new Image();
  u2_img.src = 'u2.png'
  u3_img = new Image();
  u3_img.src = 'u3.png'


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
  ctx.beginPath();
  ctx.fillStyle = "#99d9ea";
  ctx.fillRect(0, 0, canv.width, canv.height);
  ctx.strokeStyle = "#99d9ea";
  ctx.stroke();
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
      ctx.strokeStyle = "#99d9ea";
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
  if (m.type == 'r'){
    if (m.n == 1 && m.e == 1){
      ctx.drawImage(r0_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.e == 1 && m.s == 1){
      ctx.drawImage(r1_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.s == 1 && m.w == 1){
      ctx.drawImage(r2_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.n == 1 && m.w == 1){
      ctx.drawImage(r3_img, x * block_size, y * block_size, block_size, block_size);
    }
  }

  if (m.type == 'k'){
    if (m.n == 1){
      ctx.drawImage(k0_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.e == 1){
      ctx.drawImage(k1_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.s == 1){
      ctx.drawImage(k2_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.w == 1){
      ctx.drawImage(k3_img, x * block_size, y * block_size, block_size, block_size);
    }
  }

  if (m.type == 'u'){
    if (m.s == 0){
      ctx.drawImage(u0_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.w == 0){
      ctx.drawImage(u1_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.n == 0){
      ctx.drawImage(u2_img, x * block_size, y * block_size, block_size, block_size);
    }
    if (m.e == 0){
      ctx.drawImage(u3_img, x * block_size, y * block_size, block_size, block_size);
    }
  }


  return 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function random(min, max) {
  //return Math.floor(Math.random() * (max - min) ) + min;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
    var x = random(0, game_board.length-1);
    var y = random(0, game_board[0].length-1);
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
      return [game_board.length - 1, y];
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
