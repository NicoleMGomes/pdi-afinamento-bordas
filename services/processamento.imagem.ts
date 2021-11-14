import Jimp from 'jimp'
import formidable from 'formidable'

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
  const response = image.clone()

  //TODO: criar método

  return response
}

