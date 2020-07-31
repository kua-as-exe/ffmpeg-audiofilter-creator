import { spawnSync } from "child_process"
import { type } from "os"

export const ffmpegPath = './src/lib/ffmpeg.exe';

export const executeFFMPEG = async (ffmpegCommand: string[]) => await spawnSync("powershell.exe", ffmpegCommand)
