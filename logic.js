var num_rows = null;
    num_cols = null;
    block_size = null;
    concentration = null;
    canv = null;
    ctx = null;

function start(){
  canv = document.getElementById('canv');
  ctx = canv.getContext("2d");


  num_rows = $("#rows").val();
  num_cols = $("#cols").val();
  concentration = $("#dist").val();
  $("#config").hide();
  $("#sim").show();
  setup();
}

function setup(){
  block_size = Math.min(canv.height / num_rows, canv.width / num_cols)
  draw();
}

function draw(){
  drawBoard();
}
function drawBoard(){
  var rowCounter;

	for (rowCounter = 0; rowCounter < num_rows; rowCounter++) {
    var blockCounter;
    for (blockCounter = 0; blockCounter < num_cols; blockCounter++) {
      ctx.beginPath();
      ctx.rect(rowCounter * block_size, blockCounter * block_size, block_size, block_size);
      ctx.strokeStyle = "grey";
	    ctx.stroke();
	  }
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debug(){
  console.log("num_rows: " + num_rows);
  console.log("num_cols: " + num_cols);
  console.log("block_size: " + block_size);
  console.log("concentration: " + concentration);
}
