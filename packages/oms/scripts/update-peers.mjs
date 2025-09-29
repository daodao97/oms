import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '../../..')
const omsPackagePath = path.resolve(__dirname, '..', 'package.json')
const utilsPackagePath = path.resolve(rootDir, 'packages', 'utils', 'package.json')
const vbtfPackagePath = path.resolve(rootDir, 'packages', 'vbtf', 'package.json')

const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'))

const omsPackage = readJson(omsPackagePath)
const utilsPackage = readJson(utilsPackagePath)
const vbtfPackage = readJson(vbtfPackagePath)

omsPackage.peerDependencies = omsPackage.peerDependencies || {}

const updates = {
  '@okiss/utils': `>=${utilsPackage.version}`,
  '@okiss/vbtf': `>=${vbtfPackage.version}`
}

let changed = false

Object.entries(updates).forEach(([name, versionRange]) => {
  if (omsPackage.peerDependencies[name] !== versionRange) {
    omsPackage.peerDependencies[name] = versionRange
    changed = true
  }
})

if (!changed) {
  console.log('Peer dependencies already up to date.')
  process.exit(0)
}

writeFileSync(omsPackagePath, `${JSON.stringify(omsPackage, null, 2)}\n`)
console.log('Updated peer dependencies to:', updates)
