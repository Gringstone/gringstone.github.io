const GRID = 4;
document.documentElement.style.setProperty("--grid", GRID);

let latitude = 53.430127;
let longitude = 14.564802;

let map = L.map('map').setView([latitude, longitude], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

let locationMarker = null;

document.getElementById("get-location").addEventListener("click", getLocation);

let rasterMap = document.getElementById("raster-map");

let target = document.getElementById("target");

function getLocation() {
  if (! navigator.geolocation) {
    alert("Sorry, no geolocation available for you!");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    map.setView([latitude, longitude], 18);

    if (!locationMarker) {
      locationMarker = L.marker([latitude, longitude]).addTo(map);
    }

    locationMarker
      .setLatLng([latitude, longitude])
      .bindPopup(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      .openPopup();
  }, (positionError) => {
    console.error(positionError);
  }, {
    enableHighAccuracy: false
  });
}

for (let i = 0; i < GRID * GRID; i++) {
  let slot = document.createElement("div");
  slot.className = "slot";
  slot.id = "slot-" + i;
  target.appendChild(slot);
}


document.addEventListener("dragstart", function (event) {
  let piece = event.target.closest(".piece");
  if (piece) {
    event.dataTransfer.setData("text/plain", piece.id);
  }
});

target.addEventListener("dragenter", function (event) {
  let slot = event.target.closest(".slot");
  if (slot) {
    slot.classList.add("slot-over");
  }
});

target.addEventListener("dragleave", function (event) {
  let slot = event.target.closest(".slot");
  if (slot && !slot.contains(event.relatedTarget)) {
    slot.classList.remove("slot-over");
  }
});

target.addEventListener("dragover", function (event) {
  if (event.target.closest(".slot")) {
    event.preventDefault();
  }
});

target.addEventListener("drop", function (event) {
  let slot = event.target.closest(".slot");
  if (!slot) {
    return;
  }
  event.preventDefault();
  slot.classList.remove("slot-over");

  let piece = document.getElementById(event.dataTransfer.getData("text/plain"));
  if (!piece || piece.parentElement === slot) {
    return;
  }

  let occupant = slot.querySelector(".piece");
  if (occupant) {
    piece.parentElement.appendChild(occupant);
  }
  slot.appendChild(piece);

  if (isSolved()) {
    console.debug("success");
    if (Notification.permission === "granted") {
      const notification = new Notification("Success");
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification("Success");
        }
      });
    }
  }
});

function isSolved() {
  for (let i = 0; i < GRID * GRID; i++) {
    let piece = document.getElementById("slot-" + i).querySelector(".piece");
    if (!piece || piece.id !== "piece-" + i) {
      return false;
    }
  }
  return true;
}

let snapshotUrl = null;

function drawPieces(order) {
  rasterMap.replaceChildren();
  target.querySelectorAll(".piece").forEach(piece => piece.remove());

  for (let slot = 0; slot < order.length; slot++) {
    let piece = order[slot];
    let col = piece % GRID;
    let row = Math.floor(piece / GRID);

    let cell = document.createElement("div");
    cell.className = "piece";
    cell.id = "piece-" + piece;
    cell.draggable = true;
    cell.style.backgroundImage = `url(${snapshotUrl})`;
    cell.style.backgroundPosition = `${col * 100 / (GRID - 1)}% ${row * 100 / (GRID - 1)}%`;
    rasterMap.appendChild(cell);
  }
}

function inOrder() {
  let order = [];
  for (let i = 0; i < GRID * GRID; i++) {
    order.push(i);
  }
  return order;
}

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
    snapshotUrl = canvas.toDataURL();
    drawPieces(inOrder());
  });
});

document.getElementById("shuffle").addEventListener("click", function() {
  if (!snapshotUrl) {
    return;
  }
  drawPieces(shuffled(inOrder()));
});


