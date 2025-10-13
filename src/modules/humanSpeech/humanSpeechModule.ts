import { mergeSlices } from "ffmpeg-simplified"
import { spawn } from "child_process"
import fs from "fs"
import path from "path"
import { Readable } from "stream"
import { log } from "console"

export type HumanSpeechConfig = { human: string }

export class HumanSpeechModule {
  static dotPause = this.generateOrGetSilentAudioFile(700)
  static commaPause = this.generateOrGetSilentAudioFile(500)
  static betweenWordsPause = this.generateOrGetSilentAudioFile(30)

  static baseAudioPath = path.join(process.cwd(), `assets/audio/tts`)

  static async generateSpeech(text: string, options: HumanSpeechConfig) {
    const audioPaths: string[] = []

    const cleanedText = this.cleanText(text)
    log(cleanedText)

    for (const word of cleanedText.split(" ")) {
      audioPaths.push(
        ...(await this.getAudioFilePaths(word, options.human)),
        await this.betweenWordsPause,
      )
    }

    const outPath = "/tmp/out.mp3"

    await mergeSlices(audioPaths, outPath, { fast: true })

    return Readable.from(fs.readFileSync(outPath))
  }

  protected static audioExists(text: string, human: string): boolean {
    return fs.existsSync(
      path.join(process.cwd(), `assets/audio/tts/${human}/${text}.mp3`),
    )
  }

  protected static async getAudioFilePaths(
    word: string,
    human: string,
  ): Promise<string[]> {
    const audioFiles: string[] = []

    for (let i = 0; i < word.length; i++) {
      const letter: string = word.charAt(i)
      const nextLetter: string = word.charAt(i + 1)

      if (this.audioExists(letter + nextLetter, human)) {
        audioFiles.push(this.getAudioPath(letter + nextLetter, human))
        i++
      } else if (this.audioExists(letter, human)) {
        audioFiles.push(this.getAudioPath(letter, human))
      } else if (letter === ",") {
        audioFiles.push(await this.commaPause)
      } else if (letter === ".") {
        audioFiles.push(await this.dotPause)
      }
    }

    return audioFiles
  }

  protected static getAudioPath(filename: string, human: string) {
    return `${this.baseAudioPath}/${human}/${filename}.mp3`
  }

  protected static async generateOrGetSilentAudioFile(
    durationMs: number,
  ): Promise<string> {
    const outFile = `/var/lib/${durationMs}-silence.mp3`

    spawn("ffmpeg", [
      "-f",
      "lavfi",
      "-i",
      "anullsrc=r=44100:cl=stereo",
      "-t",
      (durationMs / 1000).toString(),
      "-c:a",
      "libmp3lame",
      outFile,
    ])

    return outFile
  }

  protected static cleanText(text: string) {
    const accentsMap: Record<string, string> = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U",
    }

    return text
      .split("")
      .map((char) => accentsMap[char] || char) // replace accented vowels
      .join("")
      .replace(/[^a-zA-Z0-9\sñÑ]/g, "") // remove punctuation except ñ
      .toLowerCase()
  }
}
