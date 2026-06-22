# Rocket Launch Simulation | p5.js

This project recreates the feeling of a launch sequence using countdown logic, acceleration physics, particle effects, moving scenery, and dynamic sky transitions.

The rocket itself stays visually centered while the environment moves downward to create the illusion of ascent.

---

## Features

- Launch countdown sequence
- Animated rocket takeoff
- Dynamic sky transition (day → space)
- Particle-based engine flames
- Procedural clouds and star field
- Screen shake during ignition
- Velocity-based acceleration
- Restartable simulation

---

# How It Works

## 1. State-Based Simulation

The entire animation is controlled using states:

```js
WAITING;
COUNTDOWN;
LAUNCHED;
```

Each state determines what gets rendered and updated.

### WAITING

- Rocket stays on launchpad
- Button remains visible

### COUNTDOWN

- Countdown timer begins
- Screen shake effect starts near ignition

### LAUNCHED

- Rocket launches
- Velocity and altitude update continuously
- Engine particles activate

---

## 2. Creating Rocket Motion (Without Moving the Rocket)

Instead of moving the rocket upward:

```js
translate(0, altitude);
```

is applied to:

- Ground
- Clouds
- Launch tower

This creates the illusion that:

> the rocket is flying upward while the world moves downward.

The rocket remains visually stable.

---

## 3. Simulating Acceleration

```js
velocity += acceleration;
altitude += velocity;
```

The rocket gradually speeds up instead of instantly reaching full speed.

Velocity is capped:

```js
maxVelocity;
```

to keep motion controlled.

---

## 4. Dynamic Sky Transition

```js
lerpColor();
```

interpolates between:

```text
Blue Sky → Dark Space
```

based on altitude.

As the rocket climbs:

- atmosphere fades
- stars appear

creating a transition into space.

---

## 5. Procedural Star Field

Stars are generated once:

```js
stars.push(...)
```

Each star stores:

- position
- size
- speed multiplier

During launch:

```js
line(x, y, x, y + stretch);
```

is used to stretch stars vertically.

This produces a **warp-speed effect**.

Stars wrap back after leaving the screen to create an infinite field.

---

## 6. Particle Engine Exhaust

Engine flames are created using a custom:

```js
Particle class
```

Each particle has:

- random spread
- downward velocity
- fading opacity
- shrinking size

Particles continuously spawn and disappear:

```js
alpha -= 7;
size *= 0.95;
```

creating exhaust animation.

---

## 7. Countdown & Screen Shake

Near ignition:

```js
translate(random(-2, 2));
```

adds subtle camera movement.

This creates vibration before launch and makes the countdown feel more alive.

---

## 8. Procedural Environment

### Clouds

Generated randomly:

```js
clouds.push(...)
```

Different:

- positions
- sizes

to avoid repetition.

---

### Launch Tower

Built using repeated structural blocks:

```js
for(...)
```

Cross beams are drawn using diagonal lines.

---

## 9. User Interaction

### IGNITE Button

Starts countdown.

```js
mousePressed();
```

allows mission restart after reaching space.

---

## Concepts Used

- State Machines
- Particle Systems
- Acceleration Simulation
- Transformations (`translate`)
- Procedural Generation
- Animation Loops
- Color Interpolation
- Object-Oriented Programming
- User Interaction

---

_"Space Technology in the Service of Mankind"_
