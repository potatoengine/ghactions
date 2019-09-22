const process = require('process')
const fs = require('fs')
const recursiveReaddirSync = require('recursive-readdir-sync')
const minimatch = require('minimatch')
const spawn = require('child_process').spawnSync

const build_path = process.argv[0] || '.'
const include = (process.argv[1] || '*.cpp').split(';').filter(s => s.length != 0)
const exclude = (process.argv[2] || '').split(';').filter(s => s.length != 0)

const all = (list, func) => {
    for (const value of list) {
        if (!func(value)) return false
    }
    return true
}

const files = recursiveReaddirSync('.')
    .filter(path => all(exclude, pattern => !minimatch(path, pattern)))
    .filter(path => all(include, pattern => minimatch(path, pattern)))
    .filter(path => fs.lstatSync(path).isFile)

const args = ['-p', build_path].concat(files)
const result = spawn('clang-tidy', args, {encoding: 'utf8'})
console.log(result.stdout)