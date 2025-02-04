import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

function saveSys(savefileName) {
  return {
    data: {},
    async save() {
      await writeTextFile(savefileName, JSON.stringify(this.data), {
        dir: BaseDirectory.AppLocalData,
      })
    },
    async load() {
      try {
        this.data = JSON.parse(
          await readTextFile(savefileName, {
            dir: BaseDirectory.AppLocalData,
          })
        )
      } catch {
        this.data = {}
      }
    },
  }
}

export const saveSystem = saveSys('save.json')
