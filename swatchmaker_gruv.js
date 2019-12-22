const convert = require('color-convert')
const fs = require('fs')
const yaml = require('js-yaml');

const inputFile = 'colours.yaml'
const outputFile = 'swatch_mystyle.svg'

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

const colCount = 8
const rowCount = 5

const top = `<?xml version="1.0" encoding="utf-8" ?>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${swatchWidth * colCount}" height="${swatchHeight * rowCount}">
`
const style = `
  <style>
    .hash {
      text-anchor: middle;
      font-family: sans-serif;
      font-size: ${swatchHeight * 0.2}px;
    }
    .name {
      text-anchor: middle;
      font-family: sans-serif;
      font-size: ${swatchHeight * 0.2}px;
    }
  </style>
`

function swatch(name, rowIdx, colIdx) {
  const x = colIdx * swatchWidth
  const y = rowIdx * swatchHeight
  const colorHash = colours[name]
  const textColour = convert.hex.lab(colorHash)[0] < 50 ? colours['grey10'] : colours['grey0']
  return `
  <g>
    <rect width="${swatchWidth}" height="${swatchHeight}" fill="${colorHash}" x="${x}" y="${y}"></rect>
    <text class="name" fill="${textColour}" x="${x}" y="${y}">
      <tspan dx="${swatchWidth / 2}" dy="${swatchHeight * 0.33}">${name}</tspan>
    </text>
    <text class="hash" fill="${textColour}" x="${x}" y="${y}">
      <tspan dx="${swatchWidth / 2}" dy="${swatchHeight * 0.66}">${colorHash}</tspan>
    </text>
  </g>
`
}

const bottom = `
</svg>
`

// const darkLayout = [
//   [
//     'grey0',
//     'darkred',
//     'darkgreen',
//     'darkyellow',
//     'darkblue',
//     'darkviolet',
//     'darkcyan',
//     'grey6',
//   ],
//   [
//     'grey5',
//     'red',
//     'green',
//     'yellow',
//     'blue',
//     'violet',
//     'cyan',
//     'grey9',
//   ],
//   [
//     'grey0hard',
//     'grey0',
//     'grey1',
//     'grey2',
//     'grey3',
//     'grey4',
//     'grey5',
//     'darkorange',
//   ],
//   [
//     'grey0',
//     'grey0soft',
//     'grey6',
//     'grey7',
//     'grey8',
//     'grey9',
//     'grey10',
//     'orange',
//   ],
// ]

const darkLayout = [
  [
    'darkred',
    'darkgreen',
    'darkyellow',
    'darkblue',
    'darkviolet',
    'darkcyan',
    'darkorange',
  ],
  [
    'red',
    'green',
    'yellow',
    'blue',
    'violet',
    'cyan',
    'orange',
  ],
  [
    'brightred',
    'brightgreen',
    'brightyellow',
    'brightblue',
    'brightviolet',
    'brightcyan',
    'brightorange',
  ],
  [
    'grey0hard',
    'grey0',
    'grey0soft',
    'grey1',
    'grey2',
    'grey3',
    'grey4',
  ],
  [
    'grey5',
    'grey6',
    'grey7',
    'grey8',
    'grey9',
    'grey10soft',
    'grey10',
    'grey10hard',
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

