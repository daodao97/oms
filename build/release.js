const fs = require('fs')
const path = require('path')
const mri = require('mri')
const { exec, cd } = require('shelljs')

const args = {...mri(process.argv.slice(2)), type: 'patch'}

const pkgName = process.env.pkg

if (!pkgName) {
  console.log('need pkg name')
  return
}

const base = path.resolve(__dirname, '../')
const ROOT = path.resolve(__dirname, '../packages/' + pkgName)

const pkg = pkgJson(ROOT)
const basePkg = pkgJson(base)
pkg.version = getUpdatedVersion(args.type, pkg.version)
Object.keys(pkg.dependencies).forEach(key => {
  if (basePkg.dependencies[key] !== undefined) {
    pkg.dependencies[key] = basePkg.dependencies[key] 
  }
})
savePkgJson(ROOT, pkg)

cd(ROOT)

exec('pnpm build')

console.log("generate ts ...")
exec('pnpm ts > /dev/null')

const dry = args['dry-run'] ? '--dry-run' : ''
checkErr(exec('pnpm publish --access public ' + dry), 'npm publish fail')

// helper
function checkErr(result, msg) {
  if (result.code !== 0) {
    console.error(msg)
    process.exit(1)
  }
}

function  pkgJson (dir)  {
  const str = fs.readFileSync(path.resolve(dir, 'package.json'), 'utf8').toString()
  return JSON.parse(str)
}

function savePkgJson(dir, data) {
  let str = JSON.stringify(data, undefined, '  ')
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
