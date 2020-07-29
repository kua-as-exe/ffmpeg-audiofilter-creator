import { spawnSync } from "child_process"
import { type } from "os"
import { ffmpegPath } from ".."


export const executeFFMPEG = async (ffmpegCommand: string[]) => await spawnSync("powershell.exe", ffmpegCommand)
