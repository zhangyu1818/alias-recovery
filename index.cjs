const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

const processFile = (filePath, alias) => {
  const sourceCode = fs.readFileSync(filePath, 'utf-8')
  const aliasPaths = Object.keys(alias)
  const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  traverse(ast, {
    ImportDeclaration(nodePath) {
      const { node } = nodePath
      const { value } = node.source
      aliasPaths.forEach((aliasPath) => {
        if (value.startsWith(aliasPath)) {
          const absolutePath = alias[aliasPath]
          const fileDir = path.dirname(filePath)
          const newPath = path.relative(fileDir, absolutePath)
          node.source.value = value.replace(aliasPath, newPath)
        }
      })
    },
  })

  const { code } = generate(ast, {})
  fs.writeFileSync(filePath, code, 'utf-8')
}

module.exports = processFile
