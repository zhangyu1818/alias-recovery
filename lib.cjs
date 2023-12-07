#!/usr/bin/env node

const fs = require('fs')
const glob = require('glob')
const processFile = require('./index.cjs')

const args = process.argv.slice(2)
const [folderPath, aliasJSONPath] = args

const alias = JSON.parse(fs.readFileSync(aliasJSONPath, 'utf-8'))

const files = glob.sync(`${folderPath}/**/*.{js,jsx,ts,tsx}`)

files.forEach((filePath) => {
  console.log(filePath)
  processFile(filePath, alias)
})
