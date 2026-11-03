let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

const GRID = 4;

let rasterMap = document.getElementById("raster-map");
let rasterContext = rasterMap.getContext("2d");

// Snapshot of the map from the last "To Canvas" click.
let snapshot = null;

// Rounded edges of cell i when size is split into GRID parts, so cells
// meet exactly without hairline gaps between them.
function cellEdges(i, size) {
  let start = Math.round(i * size / GRID);
  let end = Math.round((i + 1) * size / GRID);
  return [start, end - start];
}

// order[slot] is the index of the piece drawn in that slot; the slots and
// pieces are numbered row by row, 0 to GRID * GRID - 1.
function drawPieces(order) {
  rasterMap.width = rasterMap.clientWidth;
  rasterMap.height = rasterMap.clientHeight;

  for (let slot = 0; slot < order.length; slot++) {
    let piece = order[slot];
    let [sx, sw] = cellEdges(piece % GRID, snapshot.width);
    let [sy, sh] = cellEdges(Math.floor(piece / GRID), snapshot.height);
    let [dx, dw] = cellEdges(slot % GRID, rasterMap.width);
    let [dy, dh] = cellEdges(Math.floor(slot / GRID), rasterMap.height);

    rasterContext.drawImage(snapshot, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}

function inOrder() {
  let order = [];
  for (let i = 0; i < GRID * GRID; i++) {
    order.push(i);
  }
  return order;
}

// Fisher-Yates shuffle.
function shuffled(order) {
  for (let i = order.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

document.getElementById("to-canvas").addEventListener("click", function() {
  leafletImage(map, function (err, canvas) {
    if (err) {
      console.error(err);
      return;
    }
    snapshot = canvas;
    drawPieces(inOrder());
  });
});

document.getElementById("shuffle").addEventListener("click", function() {
  if (!snapshot) {
    return;
  }
  drawPieces(shuffled(inOrder()));
});
