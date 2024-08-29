import { saveSystem } from './save'
import { computeRank, startGame } from './utilites'

export async function scoreBox(kont, pos, score) {
  await saveSystem.load()

  if (score > saveSystem.data.maxScore) {
    saveSystem.data.maxScore = score
    await saveSystem.save()
  }

  const scoreContainer = kont.make([
    kont.rect(600, 500),
    kont.pos(pos),
    kont.color(kont.Color.fromHex('#d7f2f7')),
    kont.area(),
    kont.anchor('center'),
    kont.outline(4, kont.Color.fromHex('#14638e')),
  ])

  scoreContainer.add([
    kont.text(`Previous best score : ${saveSystem.data.maxScore}`),
    kont.color(kont.Color.fromHex('#14638e')),
    kont.area(),
    kont.pos(-240, -200),
  ])

  scoreContainer.add([
    kont.text(`Current score: ${score}`),
    kont.color(kont.Color.fromHex('#14638e')),
    kont.area(),
    kont.pos(-240, -150),
  ])

  scoreContainer.add([
    kont.text(`Current rank : ${computeRank(score)}`),
    kont.color(kont.Color.fromHex('#14638e')),
    kont.area(),
    kont.pos(-240, 50),
  ])

  scoreContainer.add([
    kont.text(`Previous best rank : ${computeRank(saveSystem.data.maxScore)}`),
    kont.color(kont.Color.fromHex('#14638e')),
    kont.area(),
    kont.pos(-240, 0),
  ])

  const restartBtn = scoreContainer.add([
    kont.rect(200, 50, { radius: 3 }),
    kont.color(kont.Color.fromHex('#14638e')),
    kont.area(),
    kont.anchor('center'),
    kont.pos(0, 200),
  ])

  restartBtn.add([
    kont.text('Play again', { size: 24 }),
    kont.color(kont.Color.fromHex('#d7f2f7')),
    kont.area(),
    kont.anchor('center'),
  ])

  restartBtn.onClick(() => startGame(kont))

  kont.onKeyPress('space', () => startGame(kont))

  kont.onGamepadButtonPress('south', () => startGame(kont))

  return scoreContainer
}
