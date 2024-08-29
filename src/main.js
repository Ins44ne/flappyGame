import { appWindow } from '@tauri-apps/api/window'
import kaplay from 'kaplay'
import { makeBackgr, startGame } from './utilites'
import { SCALE_FACTOR } from './consts'
import { makeChar } from './char'
import { saveSystem } from './save'
import { scoreBox } from './scoreBox'

const kontext = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false,
  scale: 2,
})

kontext.loadSprite('flappy', './flappy.png')
kontext.loadSprite('obstacles', './obstacles.png')
kontext.loadSprite('background', './background.png')
kontext.loadSprite('clouds', './clouds.png')

kontext.loadSound('jump', './jump.wav')
kontext.loadSound('hurt', './hurt.wav')
kontext.loadSound('confirm', './confirm.wav')

addEventListener('keydown', async (key) => {
  if (key.code === 'F11') {
    if (await appWindow.isFullscreen()) {
      await appWindow.setFullscreen(false)
      return
    }
    appWindow.setFullscreen(true)
  }
})

kontext.scene('start', async () => {
  makeBackgr(kontext)

  const map = kontext.add([
    kontext.sprite('background'),
    kontext.pos(0, 0),
    kontext.scale(SCALE_FACTOR),
  ])

  const clouds = map.add([
    kontext.sprite('clouds'),
    kontext.pos(),
    {
      speed: 5,
    },
  ])

  clouds.onUpdate(() => {
    clouds.move(clouds.speed, 0)
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500
    }
  })

  map.add([kontext.sprite('obstacles'), kontext.pos()])

  const player = kontext.add(makeChar(kontext))
  player.pos = kontext.vec2(kontext.center().x - 350, kontext.center().y + 56)

  const buttonPlay = kontext.add([
    kontext.rect(200, 50, { radius: 3 }),
    kontext.color(kontext.Color.fromHex('#14638e')),
    kontext.area(),
    kontext.anchor('center'),
    kontext.pos(kontext.center().x + 30, kontext.center().y + 60),
  ])

  buttonPlay.add([
    kontext.text('Play', { size: 24 }),
    kontext.color(kontext.Color.fromHex('#d7f2f7')),
    kontext.area(),
    kontext.anchor('center'),
  ])

  buttonPlay.onClick(() => startGame(kontext))
  kontext.onKeyPress('space', () => startGame(kontext))
  kontext.onGamepadButtonPress('south', () => startGame(kontext))

  await saveSystem.load()
  if (!saveSystem.data.maxScore) {
    saveSystem.data.maxScore = 0
    await saveSystem.save()
  }
})

kontext.scene('main', async () => {
  let score = 0

  const colliders = await (await fetch('./collidersData.json')).json()
  const collidersData = colliders.data

  makeBackgr(kontext)
  kontext.setGravity(2500)

  const map = kontext.add([kontext.pos(0, -50), kontext.scale(SCALE_FACTOR)])

  const clouds = map.add([
    kontext.sprite('clouds'),
    kontext.pos(),
    {
      speed: 5,
    },
  ])

  clouds.onUpdate(() => {
    clouds.move(clouds.speed, 0)
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500
    }
  })

  const platforms = map.add([
    kontext.sprite('obstacles'),
    kontext.pos(),
    kontext.area(),
    {
      speed: 100,
    },
  ])

  platforms.onUpdate(() => {
    platforms.move(-platforms.speed, 0)
    if (platforms.pos.x < -490) {
      platforms.pos.x = 300
      platforms.speed += 10
    }
  })

  kontext.loop(1, () => {
    score += 1
  })

  for (const collider of collidersData) {
    platforms.add([
      kontext.area({
        shape: new kontext.Rect(
          kontext.vec2(0),
          collider.width,
          collider.height
        ),
      }),
      kontext.body({ isStatic: true }),
      kontext.pos(collider.x, collider.y),
      'obstacles',
    ])
  }

  kontext.add([
    kontext.rect(kontext.width(), 50),
    kontext.pos(0, -100),
    kontext.area(),
    kontext.fixed(),
    'obstacles',
  ])

  kontext.add([
    kontext.rect(kontext.width(), 50),
    kontext.pos(0, 1000),
    kontext.area(),
    kontext.fixed(),
    'obstacles',
  ])

  const player = kontext.add(makeChar(kontext))
  player.pos = kontext.vec2(600, 250)
  player.setControlls()
  player.onCollide('obstacles', async () => {
    if (player.isDead) return
    kontext.play('hurt')
    platforms.speed = 0
    player.disableControlls()
    kontext.add(await scoreBox(kontext, kontext.center(), score))
    player.isDead = true
  })
})
kontext.go('start', async () => {})
