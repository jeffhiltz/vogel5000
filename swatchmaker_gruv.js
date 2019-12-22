const fs = require('fs')
const yaml = require('js-yaml');

const inputFile = 'colours.yaml'
const outputFile = 'swatch_gruvstyle.svg'

let colours

// read colours from file
try {
  const doc = yaml.safeLoad(fs.readFileSync(inputFile, 'utf8'))
  colours = doc.vogel5000
} catch (e) {
  console.log(e)
}



const swatchWidth = 348 / 2
const swatchHeight = 240 * 0.6

const top = `<?xml version="1.0" encoding="utf-8" ?>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${swatchWidth * 8}" height="${swatchHeight * 4}">
`
const style = `
  <style>
    .hash {
      text-anchor: middle;
    }
    .name {
      text-anchor: middle;
    }
  </style>
`

function swatch(name, rowIdx, colIdx) {
  const x = colIdx * swatchWidth
  const y = rowIdx * swatchHeight
  const colorHash = colours[name]
  return `
  <g>
    <rect width="${swatchWidth}" height="${swatchHeight}" fill="${colorHash}" x="${x}" y="${y}"></rect>
    <text class="name" fill="${colours['grey10']}" x="${x}" y="${y}">
      <tspan dx="${swatchWidth / 2}" dy="${swatchHeight * 0.33}">${name}</tspan>
    </text>
    <text class="hash" fill="${colours['grey10']}" x="${x}" y="${y}">
      <tspan dx="${swatchWidth / 2}" dy="${swatchHeight * 0.66}">${colorHash}</tspan>
    </text>
  </g>
`
}

const bottom = `
</svg>
`

const darkLayout = [
  [
    'grey0',
    'darkred',
    'darkgreen',
    'darkyellow',
    'darkblue',
    'darkviolet',
    'darkcyan',
    'grey6',
  ],
  [
    'grey5',
    'red',
    'green',
    'yellow',
    'blue',
    'violet',
    'cyan',
    'grey9',
  ],
  [
    'grey0hard',
    'grey0',
    'grey1',
    'grey2',
    'grey3',
    'grey4',
    'grey5',
    'darkorange',
  ],
  [
    'grey0',
    'grey0soft',
    'grey6',
    'grey7',
    'grey8',
    'grey9',
    'grey10',
    'orange',
  ],
]

const outFile = fs.createWriteStream(outputFile)
outFile.on('open', () => {
  outFile.write(top)
  outFile.write(style)

  darkLayout.forEach((row, rowIdx) => {
    row.forEach((label, colIdx) => {
      outFile.write(swatch(label, rowIdx, colIdx))
    })
  })

  outFile.write(bottom)
})

