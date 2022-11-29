const fs = require('fs')
const path = require('path')

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

function pkgJson(dir) {
    const str = fs.readFileSync(path.resolve(dir, 'package.json'), 'utf8').toString()
    return JSON.parse(str)
}

function savePkgJson(dir, data) {
    let str = JSON.stringify(data, undefined, '  ')
    fs.writeFileSync(path.join(dir, 'package.json'), str)
}

const base = path.resolve(__dirname, '../')
const basePkg = pkgJson(base)

const pkgs = getDirectories(path.join(__dirname, '../packages'))

pkgs.forEach(pkgName => {
    let ROOT = path.resolve(__dirname, '../packages/' + pkgName)
    const pkg = pkgJson(ROOT)
    Object.keys(pkg.dependencies).forEach(key => {
        if (basePkg.dependencies[key] !== undefined) {
            pkg.dependencies[key] = basePkg.dependencies[key]
        }
    })
    savePkgJson(ROOT, pkg)
})