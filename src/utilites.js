export function makeBackgr(kont) {
  kont.add([
    kont.rect(kont.width(), kont.height()),
    kont.color(kont.Color.fromHex('#d7f2f7')),
    kont.fixed(),
  ])
}

export function computeRank(score) {
  if (score > 30) {
    return 'S'
  }

  if (score > 20) {
    return 'A'
  }

  if (score > 10) {
    return 'B'
  }

  if (score > 2) {
    return 'C'
  }

  return 'D'
}

export function startGame(kont) {
  kont.play('confirm')
  kont.go('main')
}
