<template>
  <div class="fixed inset-0 -z-10 pointer-events-none">
    <canvas v-if="!webglFailed" ref="canvasEl" class="h-full w-full block" />
    <GalaxyBackground v-else />
  </div>
</template>

<script setup lang="ts">
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'

const { nx, ny, x: cursorX, y: cursorY, visible: cursorVisible } = useCursor()
const activeIdx = useState<number>('slide-active-idx', () => 0)

const canvasEl = ref<HTMLCanvasElement | null>(null)
const webglFailed = ref(false)

// Brand palette (sampled from RocketCursor COLORS + .galaxy gradients)
const BRAND_HEX = ['#00dc82', '#36e4da', '#38bdf8', '#818cf8', '#a78bfa']

// Per-slide vantage nudges (subtle drift, not a camera ride)
const SLIDE_OFFSETS = [
  { x: 0, y: 0, rotZ: 0 },
  { x: 0.35, y: 0.15, rotZ: 0.02 },
  { x: -0.3, y: 0.25, rotZ: -0.02 },
  { x: 0.2, y: -0.3, rotZ: 0.015 },
  { x: -0.25, y: -0.2, rotZ: -0.015 },
]

let renderer: WebGLRenderer | null = null
let galaxyScene: Scene | null = null
let trailScene: Scene | null = null
let camera: PerspectiveCamera | null = null
let orthoCamera: OrthographicCamera | null = null

let starGroup: Group | null = null
let starGeo: BufferGeometry | null = null
let starMat: ShaderMaterial | null = null
let starTexture: CanvasTexture | null = null

let nebulaMesh: Mesh | null = null
let nebulaGeo: PlaneGeometry | null = null
let nebulaMat: ShaderMaterial | null = null

let trailGeo: BufferGeometry | null = null
let trailMat: ShaderMaterial | null = null
let trailTexture: CanvasTexture | null = null
let trailPoints: Points | null = null

let rafId = 0
let running = false
let reducedMotion = false
let clockStart = 0

// smoothed camera targets
let camX = 0
let camY = 0
let camRotZ = 0

// trail ring buffer
const TRAIL_COUNT = 120
let trailHead = 0
let lastSpawnX = -1
let lastSpawnY = -1
let trailPos: Float32Array | null = null
let trailAge: Float32Array | null = null
let trailSize: Float32Array | null = null
let trailColor: Float32Array | null = null

function makeSoftSprite(): HTMLCanvasElement {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return c
}

// ── Nebula: fullscreen shader quad, slow-drifting radial gradients ──
const NEBULA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const NEBULA_FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;

  float blob(vec2 uv, vec2 c, float r) {
    float d = distance(uv, c);
    return smoothstep(r, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.03;

    vec2 p0 = vec2(0.25 * uAspect + sin(t) * 0.12, 0.20 + cos(t * 0.8) * 0.08);
    vec2 p1 = vec2(0.80 * uAspect + cos(t * 0.7) * 0.10, 0.35 + sin(t * 0.9) * 0.10);
    vec2 p2 = vec2(0.45 * uAspect + sin(t * 1.1) * 0.10, 0.82 + cos(t) * 0.06);
    vec2 p3 = vec2(0.65 * uAspect + cos(t * 0.5) * 0.14, 0.68 + sin(t * 0.6) * 0.09);

    vec3 col = vec3(0.0);
    col += uC0 * blob(uv, p0, 0.55) * 0.16;
    col += uC1 * blob(uv, p1, 0.50) * 0.14;
    col += uC2 * blob(uv, p2, 0.45) * 0.10;
    col += uC3 * blob(uv, p3, 0.60) * 0.12;

    // keep it deep space: base tint + subtle nebula, low overall brightness
    vec3 base = vec3(0.027, 0.039, 0.078); // #070a14
    col = base + col;
    gl_FragColor = vec4(col, 1.0);
  }
`

// ── Starfield: GPU twinkle via per-star phase attribute ──
const STAR_VERT = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTwinkle;
  uniform float uTime;
  void main() {
    vColor = aColor;
    float tw = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
    vTwinkle = tw;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * tw * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const STAR_FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;
  uniform sampler2D uTex;
  void main() {
    vec4 tex = texture2D(uTex, gl_PointCoord);
    gl_FragColor = vec4(vColor, tex.a * vTwinkle);
  }
`

// ── Trail: soft additive comet particles, fade with age ──
const TRAIL_VERT = /* glsl */ `
  attribute float aAge;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    float life = clamp(1.0 - aAge, 0.0, 1.0);
    vAlpha = life * life;
    gl_PointSize = aSize * (0.35 + life * 0.65);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const TRAIL_FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  uniform sampler2D uTex;
  void main() {
    if (vAlpha <= 0.001) discard;
    vec4 tex = texture2D(uTex, gl_PointCoord);
    gl_FragColor = vec4(vColor, tex.a * vAlpha);
  }
`

function buildStarfield() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const count = isMobile ? 1200 : 2500

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)

  const warm = new Color('#fff6e8')
  const brand = BRAND_HEX.map((h) => new Color(h))

  for (let i = 0; i < count; i++) {
    // spherical shell around camera
    const r = 60 + Math.random() * 120
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const c = Math.random() < 0.8 ? warm : brand[Math.floor(Math.random() * brand.length)]!
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b

    sizes[i] = 1.2 + Math.random() * 2.6
    phases[i] = Math.random() * Math.PI * 2
  }

  starGeo = new BufferGeometry()
  starGeo.setAttribute('position', new BufferAttribute(positions, 3))
  starGeo.setAttribute('aColor', new BufferAttribute(colors, 3))
  starGeo.setAttribute('aSize', new BufferAttribute(sizes, 1))
  starGeo.setAttribute('aPhase', new BufferAttribute(phases, 1))

  starTexture = new CanvasTexture(makeSoftSprite())

  starMat = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTex: { value: starTexture },
    },
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  const points = new Points(starGeo, starMat)
  starGroup = new Group()
  starGroup.add(points)
  galaxyScene!.add(starGroup)
}

function buildNebula() {
  nebulaGeo = new PlaneGeometry(2, 2)
  nebulaMat = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAspect: { value: window.innerWidth / window.innerHeight },
      uC0: { value: new Color('#00dc82') },
      uC1: { value: new Color('#38bdf8') },
      uC2: { value: new Color('#a78bfa') },
      uC3: { value: new Color('#818cf8') },
    },
    vertexShader: NEBULA_VERT,
    fragmentShader: NEBULA_FRAG,
    depthWrite: false,
    depthTest: false,
  })
  nebulaMesh = new Mesh(nebulaGeo, nebulaMat)
  nebulaMesh.frustumCulled = false
  nebulaMesh.renderOrder = -1
  galaxyScene!.add(nebulaMesh)
}

function buildTrail() {
  trailPos = new Float32Array(TRAIL_COUNT * 3)
  trailAge = new Float32Array(TRAIL_COUNT)
  trailSize = new Float32Array(TRAIL_COUNT)
  trailColor = new Float32Array(TRAIL_COUNT * 3)

  // start fully aged (invisible)
  for (let i = 0; i < TRAIL_COUNT; i++) {
    trailAge[i] = 1
    trailPos[i * 3] = -1000
    trailPos[i * 3 + 1] = -1000
  }

  trailGeo = new BufferGeometry()
  trailGeo.setAttribute('position', new BufferAttribute(trailPos, 3))
  trailGeo.setAttribute('aAge', new BufferAttribute(trailAge, 1))
  trailGeo.setAttribute('aSize', new BufferAttribute(trailSize, 1))
  trailGeo.setAttribute('aColor', new BufferAttribute(trailColor, 3))

  trailTexture = new CanvasTexture(makeSoftSprite())

  trailMat = new ShaderMaterial({
    uniforms: { uTex: { value: trailTexture } },
    vertexShader: TRAIL_VERT,
    fragmentShader: TRAIL_FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  trailPoints = new Points(trailGeo, trailMat)
  trailPoints.frustumCulled = false
  trailScene!.add(trailPoints)
}

function spawnTrail(px: number, py: number) {
  if (!trailPos || !trailAge || !trailSize || !trailColor) return
  const n = 2 + Math.floor(Math.random() * 2) // 2-3 particles
  for (let k = 0; k < n; k++) {
    const i = trailHead
    trailPos[i * 3] = px + (Math.random() - 0.5) * 6
    trailPos[i * 3 + 1] = py + (Math.random() - 0.5) * 6
    trailPos[i * 3 + 2] = 0
    trailAge[i] = 0
    trailSize[i] = 10 + Math.random() * 14
    const c = new Color(BRAND_HEX[Math.floor(Math.random() * BRAND_HEX.length)]!)
    trailColor[i * 3] = c.r
    trailColor[i * 3 + 1] = c.g
    trailColor[i * 3 + 2] = c.b
    trailHead = (trailHead + 1) % TRAIL_COUNT
  }
}

function updateTrail() {
  if (!trailGeo || !trailPos || !trailAge) return

  // spawn on movement
  if (cursorVisible.value) {
    const px = cursorX.value
    const py = cursorY.value
    if (lastSpawnX < 0) {
      lastSpawnX = px
      lastSpawnY = py
    }
    const dx = px - lastSpawnX
    const dy = py - lastSpawnY
    if (dx * dx + dy * dy > 36) {
      spawnTrail(px, py)
      lastSpawnX = px
      lastSpawnY = py
    }
  }

  // advance ages (CPU — small buffer)
  for (let i = 0; i < TRAIL_COUNT; i++) {
    if (trailAge[i]! < 1) trailAge[i] = Math.min(1, trailAge[i]! + 0.02)
  }

  ;(trailGeo.getAttribute('position') as BufferAttribute).needsUpdate = true
  ;(trailGeo.getAttribute('aAge') as BufferAttribute).needsUpdate = true
  ;(trailGeo.getAttribute('aSize') as BufferAttribute).needsUpdate = true
  ;(trailGeo.getAttribute('aColor') as BufferAttribute).needsUpdate = true
}

function resize() {
  if (!renderer || !camera || !orthoCamera) return
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  // ortho maps DOM px (top-left origin) → world; flip Y so y grows downward
  orthoCamera.left = 0
  orthoCamera.right = w
  orthoCamera.top = 0
  orthoCamera.bottom = h
  orthoCamera.updateProjectionMatrix()
  if (nebulaMat) nebulaMat.uniforms.uAspect!.value = w / h
}

function renderFrame(time: number) {
  const t = (time - clockStart) / 1000

  if (!reducedMotion) {
    if (starMat) starMat.uniforms.uTime!.value = t
    if (nebulaMat) nebulaMat.uniforms.uTime!.value = t
    if (starGroup) starGroup.rotation.z = t * 0.012

    // camera parallax + per-slide vantage offset
    const slide = SLIDE_OFFSETS[activeIdx.value % SLIDE_OFFSETS.length] || SLIDE_OFFSETS[0]!
    const targetX = nx.value * 1.2 + slide.x
    const targetY = -ny.value * 1.2 + slide.y
    camX += (targetX - camX) * 0.04
    camY += (targetY - camY) * 0.04
    camRotZ += (slide.rotZ - camRotZ) * 0.04
    if (camera) {
      camera.position.x = camX
      camera.position.y = camY
      camera.lookAt(0, 0, -1)
      camera.rotation.z = camRotZ // apply roll after lookAt (which zeroes it)
    }

    updateTrail()
  }

  if (!renderer || !galaxyScene || !camera || !trailScene || !orthoCamera) return
  renderer.autoClear = false
  renderer.clear()
  renderer.render(galaxyScene, camera)
  renderer.render(trailScene, orthoCamera)
}

function loop(time: number) {
  if (!running) return
  renderFrame(time)
  rafId = requestAnimationFrame(loop)
}

function start() {
  if (running || reducedMotion) return
  running = true
  clockStart = performance.now()
  rafId = requestAnimationFrame(loop)
}

function stop() {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function onVisibility() {
  if (document.hidden) {
    stop()
  } else if (!reducedMotion) {
    start()
  }
}

onMounted(async () => {
  // .client.vue components: template refs are not bound yet when onMounted
  // fires (Nuxt mounts the real component after hydration) — wait a tick.
  await nextTick()
  const canvas = canvasEl.value
  if (!canvas) return

  try {
    renderer = new WebGLRenderer({ canvas, alpha: false, antialias: true })
  } catch {
    webglFailed.value = true
    return
  }
  if (!renderer) {
    webglFailed.value = true
    return
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(new Color('#070a14'), 1)
  renderer.setSize(window.innerWidth, window.innerHeight, false)

  galaxyScene = new Scene()
  trailScene = new Scene()

  camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 0.01)
  camera.lookAt(0, 0, -1)

  orthoCamera = new OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, -1, 1)
  orthoCamera.position.z = 1

  buildNebula()
  buildStarfield()
  buildTrail()
  resize()

  // WebGL context loss → fall back to CSS galaxy
  canvas.addEventListener('webglcontextlost', onContextLost, false)

  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    // render exactly one static frame, no loop
    clockStart = performance.now()
    renderFrame(clockStart)
  } else {
    start()
  }
})

function onContextLost(e: Event) {
  e.preventDefault()
  stop()
  webglFailed.value = true
}

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibility)
  if (canvasEl.value) canvasEl.value.removeEventListener('webglcontextlost', onContextLost)

  starGeo?.dispose()
  starMat?.dispose()
  starTexture?.dispose()
  nebulaGeo?.dispose()
  nebulaMat?.dispose()
  trailGeo?.dispose()
  trailMat?.dispose()
  trailTexture?.dispose()
  renderer?.dispose()

  renderer = null
  galaxyScene = null
  trailScene = null
  camera = null
  orthoCamera = null
  starGroup = null
})
</script>
