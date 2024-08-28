export function makeBackgr(kont) {
  kont.add([
    kont.rect(kont.width(), kont.height()),
    kont.color(kont.Color.fromHex('#d7f2f7')),
    kont.fixed(),
  ])
}
