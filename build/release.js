const fs = require('fs')
const path = require('path')
const mri = require('mri')
const { cp, cd, exec, rm, mkdir } = require('shelljs')

const pkgName = process.env.pkg
const ROOT = path.resolve(__dirname, '../packages/' + pkgName)
const distDir = path.resolve(ROOT, 'dist')
const tmpDir = path.join(ROOT, 'tmp')
const args = {...mri(process.argv.slice(2)), type: 'patch'}

checkErr(rm('-rf', tmpDir), "rm tmp dir fail")
checkErr(mkdir(tmpDir), 'make tmp dir fail')

const pkg = pkgJson()
const cache = JSON.parse(JSON.stringify(pkg))
pkg.version = getUpdatedVersion(args.type, pkg.version)
savePkgJson(ROOT, pkg)

// exec('vue-dts-generator')
exec('pnpm ts > /dev/null')

exec('pnpm build')

pkg['module'] = './dist/index.es.js'
pkg['exports']['.']['import'] = './dist/index.es.js'
savePkgJson(tmpDir, pkg, true)

checkErr(cp("-R", distDir, tmpDir), 'cp -rf dist tmp/ fail')
checkErr(cd(tmpDir), 'cd tmp dir fail')
const dry = args['dry-run'] ? '--dry-run' : ''
checkErr(exec('npm publish --access public ' + dry), 'npm publish fail')
checkErr(rm('-rf', tmpDir), 'rm -rf tmp dir fail')

if (dry) {
  savePkgJson(ROOT, cache)
}

// helper
function checkErr(result, msg) {
  if (result.code !== 0) {
    console.error(msg)
    process.exit(1)
  }
}

function  pkgJson ()  {
  const str = fs.readFileSync(path.resolve(ROOT, 'package.json'), 'utf8').toString()
  return JSON.parse(str)
}
function savePkgJson(dir, data, replaceDep= false) {
  let str = JSON.stringify(data, undefined, '  ')
  if (replaceDep) {
    str = str.replaceAll("workspace:*", "latest")
  }
  fs.writeFileSync(path.join(dir, 'package.json'), str)
}
function getUpdatedVersion(type, v1) {
  const nums = v1.split('.').map(v => +v)
  switch (type) {
    case 'major':
      ++nums[0] // X.0.0
      break
    case 'minor':
      ++nums[1] // 0.X.0
      break
    case 'patch':
      ++nums[2] // 0.0.X
      break
  }
  return nums.join('.')
}
