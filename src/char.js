import { SCALE_FACTOR } from './consts'

export function makeChar(kont) {
  return kont.make([
    kont.sprite('flappy'),
    kont.area({ shape: new kont.Rect(kont.vec2(0, 1.5), 8, 5) }),
    kont.anchor('center'),
    kont.body({ jumpForce: 600 }),
    kont.pos(),
    kont.scale(SCALE_FACTOR),
    {
      isDead: false,
      speed: 600,
      keyControllres: [],
      setControlls() {
        const jumpEvent = () => {
          kont.play('jump')
          this.jump()
        }

        this.keyControllres.push(kont.onKeyPress('space', jumpEvent))
        this.keyControllres.push(kont.onClick(jumpEvent))
        this.keyControllres.push(kont.onGamepadButtonPress('south', jumpEvent))
      },
      disableControlls() {
        this.keyControllres.forEach((keyControllrer) => keyControllrer.cancel())
      },
    },
  ])
}
