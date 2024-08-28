import { appWindow } from '@tauri-apps/api/window'
import kaplay from 'kaplay'
import { makeBackgr } from './utilites'
import { SCALE_FACTOR } from './consts'
import { makeChar } from './char'

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

  const startGame = () => {
    kontext.play('confirm')
    kontext.go('main')
  }

  buttonPlay.onClick(startGame)
  kontext.onKeyPress('space', startGame)
  kontext.onGamepadButtonPress('south', startGame)
})

kontext.scene('main', async () => {})
kontext.go('start', async () => {})
