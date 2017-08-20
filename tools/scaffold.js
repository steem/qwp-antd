import cli from 'cli'
import path from 'path'
import fs from 'fs'

const templatePath = path.join(__dirname, 'code-template')
const uiTemplateCodeDir = path.join(templatePath, 'ui')
const serviceTempateCodeDir = path.join(templatePath, 'service')
const modelTempateCodeDir = path.join(templatePath, 'model')
let opt

function parseOptions() {
  let args = JSON.parse(process.env.npm_config_argv).original
  cli.setArgv(args)
  opt = cli.parse({
    module: [ false, 'module path, eg: /system/user', 'string'],
    ops: [ false, 'module ops, eg: create#list#del#edit', 'string'],
    model: [ false, 'whether has model', 'boolean' ],
    object: [ false, 'CRUD object name, eg: customer', 'string' ],
  })
  console.log(opt)
  if (!opt.module || !opt.object) {
    console.log('module and object must not be empty')
    return false
  }
  let uiModulePath = path.resolve(path.join(path.dirname(__dirname), 'ui', opt.module))
  if (fs.existsSync(uiModulePath)) {
    console.log(`duplicated module, the directory already exists: ${modulePath}`)
    return false
  }
  console.log(`ui code path: ${uiModulePath}`)
  opt.uiModulePath = uiModulePath
  let ops = []
  let serviceModulePath = path.resolve(path.join(path.dirname(__dirname), 'services', 'modules', opt.module))
  if (opt.ops) {
    ops = opt.ops.split('#')
    if (fs.existsSync(serviceModulePath)) {
      console.log(`duplicated module, the directory already exists: ${serviceModulePath}`)
      return false
    }
    console.log(`service code path: ${uiModulePath}`)
  }
  opt.serviceModulePath = serviceModulePath
  if (opt.model) {
    let modelModulePath = path.resolve(path.join(path.dirname(__dirname), 'model', opt.object))
  }
}

function generateCode(codeFile) {
  console.log(`create code: ${codeFile}`)
  let code = fs.readFileSync(codeFile, {encoding: 'utf-8'})
  //fs.writeFileSync(codeFile, code.replace(/user/, opt.object).replace(/User/, opt.object.substr(0, 1).toUpperCase() + opt.object.substr(1))
}

function createUICodeFromTemplate(modulePath) {
  fs.mkdirSync(modulePath)
  let codeFiles = fs.readdirSync(modulePath)
  for (let fileName of codeFiles) {
    generateCode(path.join(modulePath, fileName))
  }
}

function createModelFromTemplate(modulePath) {
  fs.mkdirSync(modulePath)
  let codeFiles = fs.readdirSync(modulePath)
  for (let fileName of codeFiles) {
    generateCode(path.join(modulePath, fileName))
  }
}

function createServiceCodeFromTemplate(modulePath, ops) {
  if (ops.length === 0) return
  fs.mkdirSync(modulePath)
  let codeFiles = fs.readdirSync(modulePath)
  for (let fileName of codeFiles) {
    generateCode(path.join(modulePath, fileName))
  }
}

function main() {
  if (!parseOptions() === false) return
  createCodeFromTemplate(uiModulePath)
  createModelFromTemplate(modelTempateCodeDir)
  createServiceCodeFromTemplate(serviceModulePath, ops)
}

main()
