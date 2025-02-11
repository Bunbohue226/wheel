const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const nameListInput = document.getElementById("nameList");
const updateButton = document.getElementById("updateButton");
const spinButton = document.getElementById("spinButton");
const wheelImage = document.getElementById("wheelImage");

let names = nameListInput.value.split("\n").filter(name => name.trim());
let startAngle = 0;
const colors = ["#FF5733", "#33FF57", "#5733FF", "#F3FF33", "#33F3FF", "#FF33A6", "#A633FF"];
let spinAngle = 0;
let spinning = false;

function drawWheel() {
  const arcSize = (2 * Math.PI) / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  names.forEach((name, index) => {
    const angle = startAngle + index * arcSize;

    // Draw sector
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, angle, angle + arcSize);
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.stroke();

    // Add text
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle + arcSize / 2);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "right";
    ctx.fillText(name, 240, 10);
    ctx.restore();
  });
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  const spinDuration = 4000;
  const spinStart = Date.now();
  const randomAngle = Math.random() * 360 + 720;

  function animate() {
    const elapsed = Date.now() - spinStart;
    if (elapsed < spinDuration) {
      spinAngle = (randomAngle * (1 - elapsed / spinDuration)) / 20;
      startAngle += spinAngle;
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      selectWinner();
    }
  }

  animate();
}

function selectWinner() {
  const arcSize = (2 * Math.PI) / names.length;
  const degrees = (startAngle * 180) / Math.PI % 360;
  const index = Math.floor((360 - degrees) / (360 / names.length)) % names.length;

  const winnerName = names[index];
  drawWheel();  // Redraw the wheel
  drawWinner(winnerName, index, arcSize);
}

function drawWinner(winnerName, index, arcSize) {
  // Calculate the angle to point the arrow at the winner
  const winnerAngle = startAngle + index * arcSize + arcSize / 2;

  // Draw the mũi tên pointing to the winner
  const arrowLength = 20;
  const arrowX = 250 + Math.cos(winnerAngle) * (250 - arrowLength);
  const arrowY = 250 + Math.sin(winnerAngle) * (250 - arrowLength);

  ctx.beginPath();
  ctx.moveTo(250, 250);
  ctx.lineTo(arrowX, arrowY);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Draw winner's name in the center
  ctx.font = "20px Arial";
  ctx.fillStyle = "yellow";
  ctx.textAlign = "center";
  ctx.fillText(`Winner: ${winnerName}`, 250, 250);

  // Generate image with winner's name
  const imageUrl = canvas.toDataURL();
  wheelImage.src = imageUrl;
  wheelImage.style.display = "block";
}

function updateWheel() {
  names = nameListInput.value.split("\n").filter(name => name.trim());
  drawWheel();
  wheelImage.style.display = "none";
}

function downloadImage() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "wheel_of_names_with_winner.png";
  link.click();
}

updateButton.addEventListener("click", updateWheel);
spinButton.addEventListener("click", spinWheel);
document.getElementById("downloadButton").addEventListener("click", downloadImage);

// Initial draw
drawWheel();
