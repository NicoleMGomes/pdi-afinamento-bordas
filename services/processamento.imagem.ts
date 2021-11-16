import Jimp from 'jimp'
import formidable from 'formidable'

const STEP_1 = 1
const STEP_2 = 2
const STEP_3 = 3
const STEP_4 = 4

export async function aplicaEfeitoImagem(
  efeito: string,
  file: formidable.File
): Promise<string> {
  const image = await Jimp.read(file.path)
  let response

  switch (efeito) {
    case 'stentiford':
      response = stentiford(image)
      break
    default:
      response = stentiford(image)
      break
  }

  const url = `/output/${efeito}-${file.name}`
  response.write('./public' + url)

  return url
}

export function stentiford(image: Jimp): Jimp {
  const resultImage = createEmptyImage(image)
  let change = true
  let step = 0
  let processImageResult = image.clone()
  const higherPixelValue = getHigherPixelValue(image)

  while (change) {
    change = false
    step++

    for (let x = 1; x < processImageResult.getWidth() - 1; x++) {
      for (let y = 1; y < processImageResult.getHeight() - 1; y++) {
        if (getPixelColor(processImageResult, x, y) == higherPixelValue) {
          const values = pixels(x, y, processImageResult)
          const v = Math.max(
            Math.min(calc(values, step, higherPixelValue), higherPixelValue),
            0
          )
          if (v != getPixelColor(processImageResult, x, y)) {
            change = true
          }

          setPixelColor(resultImage, x, y, v)
        }
      }
    }

    processImageResult = resultImage.clone()

    if (step == STEP_4) {
      step = 0
    }
  }

  return resultImage
}

function calc(
  pixels: number[][],
  step: number,
  higherPixelValue: number
): number {
  const values = neighborhood(pixels, higherPixelValue)

  if (!isConnected(values)) {
    return pixels[1][1]
  }

  const n = pixels[1][0]
  const l = pixels[2][1]
  const s = pixels[1][2]
  const o = pixels[0][1]
  const no = pixels[0][0]

  if (step == STEP_1) {
    if (!(n != higherPixelValue && s == higherPixelValue)) {
      return pixels[1][1]
    }
  }
  if (step == STEP_2) {
    if (!(no != higherPixelValue && l == higherPixelValue)) {
      return pixels[1][1]
    }
  }
  if (step == STEP_3) {
    if (!(s != higherPixelValue && n == higherPixelValue)) {
      return pixels[1][1]
    }
  }
  if (step == STEP_4) {
    if (!(l != higherPixelValue && o == higherPixelValue)) {
      return pixels[1][1]
    }
  }

  return 0
}

function neighborhood(pixels: number[][], higherPixelValue: number): number[] {
  const p2 = Math.floor(pixels[1][0] / higherPixelValue)
  const p3 = Math.floor(pixels[2][0] / higherPixelValue)
  const p4 = Math.floor(pixels[2][1] / higherPixelValue)
  const p5 = Math.floor(pixels[2][2] / higherPixelValue)
  const p6 = Math.floor(pixels[1][2] / higherPixelValue)
  const p7 = Math.floor(pixels[0][2] / higherPixelValue)
  const p8 = Math.floor(pixels[0][1] / higherPixelValue)
  const p9 = Math.floor(pixels[0][0] / higherPixelValue)

  return [p2, p3, p4, p5, p6, p7, p8, p9]
}

function isConnected(neighborhood: number[]): boolean {
  const sp =
    (neighborhood[0] < neighborhood[1] ? 1 : 0) +
    (neighborhood[1] < neighborhood[2] ? 1 : 0) +
    (neighborhood[2] < neighborhood[3] ? 1 : 0) +
    (neighborhood[3] < neighborhood[4] ? 1 : 0) +
    (neighborhood[4] < neighborhood[5] ? 1 : 0) +
    (neighborhood[5] < neighborhood[6] ? 1 : 0) +
    (neighborhood[6] < neighborhood[7] ? 1 : 0) +
    (neighborhood[7] < neighborhood[0] ? 1 : 0)

  return sp == 1
}

function pixels(x: number, y: number, image: Jimp): number[][] {
  const pixels: number[][] = []

  for (let x2 = 0; x2 < 3; x2++) {
    pixels.push([])

    for (let y2 = 0; y2 < 3; y2++) {
      pixels[x2][y2] = getPixelColor(image, x + x2 - 1, y + y2 - 1)
    }
  }

  return pixels
}

function getHigherPixelValue(image: Jimp): number {
  let value = 0

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    const pixelColor: number = getPixelColor(image, x, y)

    if (pixelColor === 255) {
      return 255
    }

    if (value < pixelColor) {
      value = pixelColor
    }
  }

  return value
}

function getPixelColor(image: Jimp, x: number, y: number): number {
  return Jimp.intToRGBA(image.getPixelColor(x, y)).r
}

function setPixelColor(image: Jimp, x: number, y: number, color: number) {
  image.setPixelColor(
    Jimp.rgbaToInt(
      color,
      color,
      color,
      Jimp.intToRGBA(image.getPixelColor(x, y)).a
    ),
    x,
    y
  )
}

function createEmptyImage(image: Jimp): Jimp {
  const emptyImage: Jimp = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    setPixelColor(emptyImage, x, y, 0)
  }

  return emptyImage
}
