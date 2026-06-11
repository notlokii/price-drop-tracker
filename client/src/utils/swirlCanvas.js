import { createNoise3D } from 'simplex-noise'

const { cos, sin, abs, random } = Math
const TAU = 2 * Math.PI

const rand = (n) => n * random()
const randRange = (n) => n - rand(2 * n)
const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2
const fadeInOut = (t, m) => {
  const hm = 0.5 * m
  return abs((t + hm) % m - hm) / hm
}

const PARTICLE_COUNT = 700
const PARTICLE_PROP_COUNT = 9
const PARTICLE_PROPS_LENGTH = PARTICLE_COUNT * PARTICLE_PROP_COUNT
const RANGE_Y = 100
const BASE_TTL = 50
const RANGE_TTL = 150
const BASE_SPEED = 0.1
const RANGE_SPEED = 2
const BASE_RADIUS = 1
const RANGE_RADIUS = 4
const BASE_HUE = 270
const RANGE_HUE = 90
const NOISE_STEPS = 8
const X_OFF = 0.00125
const Y_OFF = 0.00125
const Z_OFF = 0.0005
const BACKGROUND_COLOR = 'hsla(260,50%,3%,1)'

export function initSwirlCanvas(container) {
  const canvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas'),
  }
  canvas.b.className = 'pointer-events-none fixed inset-0 h-full w-full'
  container.appendChild(canvas.b)

  const ctx = {
    a: canvas.a.getContext('2d'),
    b: canvas.b.getContext('2d'),
  }

  const center = [0, 0]
  let tick = 0
  let rafId = 0
  const noise3D = createNoise3D()
  const particleProps = new Float32Array(PARTICLE_PROPS_LENGTH)

  function initParticle(i) {
    const x = rand(canvas.a.width)
    const y = center[1] + randRange(RANGE_Y)
    const ttl = BASE_TTL + rand(RANGE_TTL)
    const speed = BASE_SPEED + rand(RANGE_SPEED)
    const radius = BASE_RADIUS + rand(RANGE_RADIUS)
    const hue = BASE_HUE + rand(RANGE_HUE)

    particleProps.set([x, y, 0, 0, 0, ttl, speed, radius, hue], i)
  }

  for (let i = 0; i < PARTICLE_PROPS_LENGTH; i += PARTICLE_PROP_COUNT) {
    initParticle(i)
  }

  function checkBounds(x, y) {
    return x > canvas.a.width || x < 0 || y > canvas.a.height || y < 0
  }

  function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
    ctx.a.save()
    ctx.a.lineCap = 'round'
    ctx.a.lineWidth = radius
    ctx.a.strokeStyle = `hsla(${hue},100%,65%,${fadeInOut(life, ttl) * 0.85})`
    ctx.a.beginPath()
    ctx.a.moveTo(x, y)
    ctx.a.lineTo(x2, y2)
    ctx.a.stroke()
    ctx.a.restore()
  }

  function updateParticle(i) {
    const i2 = 1 + i
    const i3 = 2 + i
    const i4 = 3 + i
    const i5 = 4 + i
    const i6 = 5 + i
    const i7 = 6 + i
    const i8 = 7 + i
    const i9 = 8 + i

    const x = particleProps[i]
    const y = particleProps[i2]
    const n =
      noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU
    const vx = lerp(particleProps[i3], cos(n), 0.5)
    const vy = lerp(particleProps[i4], sin(n), 0.5)
    const life = particleProps[i5]
    const ttl = particleProps[i6]
    const speed = particleProps[i7]
    const x2 = x + vx * speed
    const y2 = y + vy * speed
    const radius = particleProps[i8]
    const hue = particleProps[i9]

    drawParticle(x, y, x2, y2, life, ttl, radius, hue)

    particleProps[i] = x2
    particleProps[i2] = y2
    particleProps[i3] = vx
    particleProps[i4] = vy
    particleProps[i5] = life + 1

    if (checkBounds(x, y) || life + 1 > ttl) {
      initParticle(i)
    }
  }

  function renderGlow() {
    ctx.b.save()
    ctx.b.filter = 'blur(8px) brightness(200%)'
    ctx.b.globalCompositeOperation = 'lighter'
    ctx.b.drawImage(canvas.a, 0, 0)
    ctx.b.restore()

    ctx.b.save()
    ctx.b.filter = 'blur(4px) brightness(200%)'
    ctx.b.globalCompositeOperation = 'lighter'
    ctx.b.drawImage(canvas.a, 0, 0)
    ctx.b.restore()
  }

  function renderToScreen() {
    ctx.b.save()
    ctx.b.globalCompositeOperation = 'lighter'
    ctx.b.drawImage(canvas.a, 0, 0)
    ctx.b.restore()
  }

  function draw() {
    tick++

    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height)

    ctx.b.fillStyle = BACKGROUND_COLOR
    ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height)

    for (let i = 0; i < PARTICLE_PROPS_LENGTH; i += PARTICLE_PROP_COUNT) {
      updateParticle(i)
    }

    renderGlow()
    renderToScreen()

    rafId = requestAnimationFrame(draw)
  }

  function resize() {
    const { innerWidth, innerHeight } = window

    canvas.a.width = innerWidth
    canvas.a.height = innerHeight

    ctx.a.drawImage(canvas.b, 0, 0)

    canvas.b.width = innerWidth
    canvas.b.height = innerHeight

    ctx.b.drawImage(canvas.a, 0, 0)

    center[0] = 0.5 * canvas.a.width
    center[1] = 0.5 * canvas.a.height
  }

  resize()
  draw()

  window.addEventListener('resize', resize)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
    canvas.b.remove()
  }
}
