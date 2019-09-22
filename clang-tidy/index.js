const core = require('@actions/core')
const process = require('process')
const fs = require('fs')
const path = require('path')
const recursiveReaddirSync = require('recursive-readdir-sync')
const minimatch = require('minimatch')
const spawn = require('child_process').spawnSync

try {
    const build_path = process.argv[1] || '.'
    const source_path = process.argv[2] || '.'
    const include = (process.argv[3] || '*.cpp').split(';').filter(s => s.length != 0)
    const exclude = (process.argv[4] || '').split(';').filter(s => s.length != 0)
    const clang_tidy = (process.argv[5] || 'clang-tidy')

    const database = path.join(build_path, 'compilation_database.json')
    if (!fs.existsSync(database)) throw new Error(`compilation database does not exist: '${database}`)

    const all = (list, func) => {
        for (const value of list) {
            if (!func(value)) return false
        }
        return true
    }

    const files = recursiveReaddirSync(source_path)
        .filter(path => all(exclude, pattern => !minimatch(path, pattern)))
        .filter(path => all(include, pattern => minimatch(path, pattern)))
        .filter(path => fs.lstatSync(path).isFile)

    if (files.length == 0) throw new Error(`no files found in '${source_path}' matching pattern '${include.join(';')}' (excluding '${exclude.join(';')}')`)

    const args = ['-p', build_path].concat(files)

    console.log(`executing: ${clang_tidy} ${args.join(' ')}`)

    const result = spawn(clang_tidy, args, {encoding: 'utf8'})
    if (result.error) throw error
    
    console.log(result.status)
    console.log(result.stdout)
} catch (error) {
    core.setFailed(error.message)
}