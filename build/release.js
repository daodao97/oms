const fs = require('fs')
const path = require('path')
const mri = require('mri')
const { spawnSync } = require('child_process')

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
// map of all workspace packages name -> version
const WORKSPACE_DIR = path.resolve(__dirname, '../packages')
const workspaceVersions = {}
try {
  fs.readdirSync(WORKSPACE_DIR).forEach(dir => {
    const p = path.join(WORKSPACE_DIR, dir, 'package.json')
    if (fs.existsSync(p)) {
      try {
        const pj = JSON.parse(fs.readFileSync(p, 'utf8'))
        if (pj.name && pj.version) workspaceVersions[pj.name] = pj.version
      } catch {}
    }
  })
} catch {}

function resolveWorkspaceRanges(deps = {}) {
  Object.keys(deps).forEach(key => {
    const val = deps[key]
    if (basePkg.dependencies[key] !== undefined) {
      deps[key] = basePkg.dependencies[key]
      return
    }
    if (typeof val === 'string' && val.startsWith('workspace:')) {
      const suffix = val.slice('workspace:'.length)
      const v = workspaceVersions[key]
      if (v) {
        if (suffix === '^') deps[key] = `^${v}`
        else if (suffix === '~') deps[key] = `~${v}`
        else if (suffix === '*' || suffix === '') deps[key] = v
        else deps[key] = `^${v}`
      } else {
        // fallback if workspace target not found
        deps[key] = 'latest'
      }
    }
  })
}

resolveWorkspaceRanges(pkg.dependencies)
resolveWorkspaceRanges(pkg.peerDependencies)
resolveWorkspaceRanges(pkg.optionalDependencies)

savePkgJson(ROOT, pkg)

process.chdir(ROOT)

checkErr(run('pnpm', ['build']), 'pnpm build fail')

// ensure dist/style.css exists (normalize css filename)
try {
  const distDir = path.join(process.cwd(), 'dist')
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir)
    const cssFiles = files.filter(f => f.endsWith('.css'))
    if (cssFiles.length > 0 && !cssFiles.includes('style.css')) {
      const firstCss = cssFiles[0]
      const src = path.join(distDir, firstCss)
      const dest = path.join(distDir, 'style.css')
      fs.copyFileSync(src, dest)
      console.log(`[release] normalized css: ${firstCss} -> style.css`)
    }
  }
} catch (e) {
  console.warn('[warn] normalize css filename failed:', e?.message || e)
}

if (pkg.scripts && pkg.scripts.ts) {
  console.log('generate ts ...')
  const tsStatus = run('pnpm', ['ts'])
  if (tsStatus !== 0) {
    console.warn('[warn] skip ts errors: vue-tsc returned non-zero exit code')
  }
} else {
  console.log('skip ts (no ts script)')
}

const publishArgs = ['publish', '--access', 'public']
if (args['dry-run']) publishArgs.push('--dry-run')
checkErr(run('pnpm', publishArgs), 'npm publish fail')

// helper
function checkErr(status, msg) {
  if (status !== 0) {
    console.error(msg)
    process.exit(1)
  }
}

function run(cmd, args = [], opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  return res.status == null ? 1 : res.status
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
