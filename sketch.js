let state = 'WAITING';
let timer = 5;
let altitude = 0;
let velocity = 0;
let clouds = [];
let stars = []; 
let particles = []; 
let launchButton;
let launchStartTime = 0; 

// CONFIGURATION
let maxVelocity = 70;      
let acceleration = 0.08;   
let starDensity = 150;     

function setup() {
  createCanvas(600, 600);
  
  // Create Clouds
  for (let i = 0; i < 10; i++) {
    clouds.push({ x: random(width), y: random(-1000, 400), s: random(40, 80) });
  }
  
  // Create Stars
  for (let i = 0; i < starDensity; i++) {
    stars.push({
      x: random(width),
      y: random(-height, height), 
      size: random(1, 2.5),
      speedMult: random(0.3, 0.8)
    });
  }

  launchButton = createButton('IGNITE');
  launchButton.position(width/2 - 35, height - 90);
  launchButton.style('background-color', 'red');
  launchButton.style('color', 'white');
  launchButton.style('padding', '10px');
  launchButton.mousePressed(startCountdown);
}

function draw() {
  // Apply screen shake during countdown
  if (state === 'COUNTDOWN' && timer < 3) {
    translate(random(-2, 2), random(-2, 2));
  }
  
  // Sky Gradient
  let skyAmount = constrain(map(altitude, 0, 3000, 0, 1), 0, 1);
  let skyColor = lerpColor(color(135, 206, 235), color(5, 5, 20), skyAmount);
  background(skyColor);

  if (skyAmount > 0.3) {
    drawVerticalStars(skyAmount);
  }

  // Draw Ground, Clouds, and Tower (affected by altitude)
  push();
  translate(0, altitude); 
  drawGround();
  drawClouds();
  drawLauncherTower(); 
  pop();

  // Draw the Rocket and its Particles
  drawProfessionalRocket(width / 2, height / 2 + 100);

  if (state === 'COUNTDOWN') displayCountdown();
  
  if (state === 'LAUNCHED') {
    if (velocity < maxVelocity) {
      velocity += acceleration;
    }
    altitude += velocity;
    handleParticles(); 
  }
  
  if (altitude > 2500) {
    displayEndText();
  }
}

// --- INPUT LOGIC ---
function mousePressed() {
  if (state === 'LAUNCHED' && altitude > 500) {
    resetSim();
  }
}

function resetSim() {
  state = 'WAITING';
  timer = 5;
  altitude = 0;
  velocity = 0;
  particles = []; 
  launchStartTime = 0; 
  launchButton.show();
}

function startCountdown() {
  if (state === 'WAITING') {
    state = 'COUNTDOWN';
    launchButton.hide();
    let cd = setInterval(() => {
      timer--;
      if (timer < 0) {
        clearInterval(cd);
        state = 'LAUNCHED';
        launchStartTime = millis(); 
      }
    }, 1000);
  }
}

// --- DRAWING FUNCTIONS ---

function drawProfessionalRocket(x, y) {
  // Render particles relative to the rocket engine
  for (let p of particles) {
    p.show();
  }

  stroke(0);
  strokeWeight(1);
  
  // Side Boosters
  fill(220);
  rect(x - 32, y, 12, 45, 2); 
  rect(x + 20, y, 12, 45, 2); 
  
  // Booster Cones
  fill(180, 40, 0);
  triangle(x - 32, y, x - 20, y, x - 26, y - 15);
  triangle(x + 20, y, x + 32, y, x + 26, y - 15);

  // Main Body
  fill(255);
  rect(x - 20, y - 90, 40, 135, 2);
  
  // Nose Cone
  fill(220, 30, 0); 
  arc(x, y - 90, 40, 70, PI, TWO_PI); 
  
  // Window
  fill(50, 100, 150);
  stroke(200);
  circle(x, y - 70, 10);
  
  // ISRO Text
  textAlign(CENTER);
  textSize(10);
  fill(20); noStroke();
  textStyle(BOLD);
  text("I", x, y - 45);
  text("S", x, y - 35);
  text("R", x, y - 25);
  text("O", x, y - 15);
  
  // Indian Flag
  noStroke();
  fill(255, 153, 51); rect(x-10, y+5, 20, 4);  // Saffron
  fill(255);          rect(x-10, y+9, 20, 4);  // White
  fill(19, 136, 8);   rect(x-10, y+13, 20, 4); // Green
  
  // Engine Nozzles
  fill(60);
  stroke(30);
  rect(x - 15, y + 45, 10, 8);
  rect(x + 5, y + 45, 10, 8);
}

function drawGround() {
  noStroke();
  // Distant Hills
  fill(60, 100, 30);
  ellipse(150, height/2 + 180, 500, 120);
  ellipse(500, height/2 + 190, 400, 100);
  
  // Grass Plain
  fill(34, 139, 34);
  rect(0, height/2 + 180, width, 1000);
  
  // Concrete Launchpad Area
  fill(100);
  rect(0, height/2 + 155, width, 30); 
  fill(120);
  rect(width/2 - 100, height/2 + 153, 200, 15); 
  
  // Safety Stripes
  stroke(255, 215, 0);
  strokeWeight(3);
  for(let i = 0; i < width; i += 45) {
    line(i, height/2 + 155, i + 18, height/2 + 155);
  }
}

function handleParticles() {
  for (let i = 0; i < 8; i++) {
    particles.push(new Particle(width / 2, height / 2 + 145));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x + random(-15, 15);
    this.y = y;
    this.vx = random(-1.5, 1.5);
    this.vy = random(3, 7); 
    this.alpha = 255;
    this.size = random(12, 28);
    this.color = color(255, random(100, 200), 0);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 7;
    this.size *= 0.95;
  }
  show() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

function drawLauncherTower() {
  stroke(40);
  strokeWeight(2);
  fill(80);
  for(let i=0; i<10; i++) {
    let ty = height/2 - 100 + (i*24.7);
    rect(width/2 + 40, ty, 25, 30);
    line(width/2 + 40, ty, width/2 + 65, ty + 30);
    line(width/2 + 65, ty, width/2 + 40, ty + 30);
  }
  
  if (state === 'WAITING' || (state === 'COUNTDOWN' && timer > 1)) {
    fill(100);
    rect(width/2 + 20, height/2 + 20, 20, 10);
    rect(width/2 + 20, height/2 + 65, 20, 10);
  }
}

function drawVerticalStars(amt) {
  let starAlpha = map(amt, 0.3, 1, 0, 200);
  stroke(255, 255, 255, starAlpha);
  let timeSinceLaunch = (millis() - launchStartTime) / 1000;
  for (let s of stars) {
    let stretch = 0;
    if (state === 'LAUNCHED' && timeSinceLaunch > 3) {
      s.y += (velocity * 0.3) * s.speedMult;
      stretch = constrain(velocity * 0.7, 0, 30); 
    }
    strokeWeight(s.size);
    line(s.x, s.y, s.x, s.y + stretch);
    
    if (s.y > height) {
      s.y = random(-200, 0); 
      s.x = random(width);
    }
  }
}

function drawClouds() {
  fill(255, 255, 255, 180);
  noStroke();
  for (let c of clouds) {
    ellipse(c.x, c.y, c.s, c.s*0.6);
    ellipse(c.x + 15, c.y + 10, c.s*0.8, c.s*0.5);
  }
}

function displayCountdown() {
  stroke(0);
  fill(255, 255, 0);
  textStyle(NORMAL);
  strokeWeight(2);
  textSize(100);
  textAlign(CENTER);
  text(timer, width/2, height/3);
}

function displayEndText() {
  noStroke();
  textAlign(CENTER);
  fill(255, 255, 0);
  textSize(30);
  textStyle(BOLD);
  text("Space Technology in the", width/2, height/2 - 110);
  text("Service of Mankind", width/2, height/2 - 70);
  textSize(14);
  fill(255);
  textStyle(NORMAL);
  text("Click anywhere to restart mission", width/2, height/2 - 30);
}