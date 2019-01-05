var num_rows = null;
    num_cols = null;
    block_size = null;
    concentration = null;
    canv = null;
    ctx = null;
    game_board = null;
    mtype = null;

/*let Molecule = class {

  constructor(type) {
    if (type=="o"){
      this.type = type;
      this.n = 1;
      this.e = 1;
      this.s = 1;
      this.w = 1;
    }
    this.flip();
  }
  flip(){
    //todo scramble positions
  }
}*/

function Molecule(type){
  if (type=="o"){
    this.type = type;
    this.n = 1;
    this.e = 1;
    this.s = 1;
    this.w = 1;
  }
  this.flip();
}
Molecule.prototype.flip = function() {
};
Molecule.prototype.toString = function() {
  return this.type;
}

function start(){
  canv = document.getElementById('canv');
  ctx = canv.getContext("2d");
  num_rows = $("#rows").val();
  num_cols = $("#cols").val();
  concentration = $("#dist").val();
  mtype = $("#mtype").val();

  block_size = Math.min(canv.height / num_rows, canv.width / num_cols)
  game_board = createBoard();
  createMolecules();





  $("#config").hide();
  $("#sim").show();
  draw();
}

function draw(){
  drawBoard();
  drawMolecules();
  debug();
}

function drawBoard(){
  var x;

	for (x = 0; x < num_cols; x++) {
    var y;
    for (y = 0; y < num_rows; y++) {
      ctx.beginPath();
      ctx.rect(x * block_size, y * block_size, block_size, block_size);
      ctx.strokeStyle = "grey";
	    ctx.stroke();
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
    ctx.beginPath();
    ctx.fillRect(x * block_size, y * block_size, block_size, block_size);
    ctx.strokeStyle = "grey";
    ctx.stroke();
  }
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
  for (var x = 0; x < game_board.length; x++) {
    console.log(game_board[x].toString());
  }

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
