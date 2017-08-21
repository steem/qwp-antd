// command line example:
// npm run scaffold --module=system --object=customer --ops=create#del#edit#list --model=on --request=on --org=catagory

import cli from 'cli'
import path from 'path'
import fs from 'fs'

const supportedOps = ['create', 'list', 'del', 'edit']
const templatePath = path.join(__dirname, 'code-template')
const uiTemplateCodeDir = path.join(templatePath, 'ui')
const serviceTempateCodeDir = path.join(templatePath, 'services')
const modelTempateCodeDir = path.join(templatePath, 'models')
const requestTempateCodeDir = path.join(templatePath, 'requests')
let opt

function replaceRegChars(c) {
  return c.replace('.', '\\.')
          .replace('$', '\\$')
          .replace('^', '\\^')
          .replace('(', '\\(')
          .replace(')', '\\)')
          .replace('*', '\\*')
          .replace('+', '\\+')
          .replace('\\', '\\\\')
          .replace('/', '\\/')
          .replace('[', '\\[')
          .replace(']', '\\]')
          .replace('{', '\\{')
          .replace('}', '\\}')
          .replace('?', '\\?')
          .replace('|', '\\|')
}

function trimLineTag(c) {
  return c.replace(new RegExp('^[\r\n]+'), '').replace(new RegExp('[\r\n]+$'), '');
}

function parseOptions() {
  let args = JSON.parse(process.env.npm_config_argv).original
  cli.setArgv(args)
  opt = cli.parse({
    module: [ false, 'module path, eg: system', 'string'],
    ops: [ false, `module ops, eg: ${supportedOps.join('#')}`, 'string'],
    object: [ false, 'CRUD object name, eg: customer', 'string'],
    model: [ false, 'whether has model', true],
    request: [ false, 'whether has request', true],
    org: [ false, 'whether has organization list', 'string'],
    init: [ false, 'init the template code file', true],
  })
  console.log(opt)
  if (opt.init) return true
  if (!opt.module || !opt.object) {
    console.log('module and object must not be empty')
    return false
  }
  if (!/^[a-z][a-z|A-Z]+/.test(opt.object)) {
    console.log('object must be letters and start with lower case')
    return false
  }
  if (opt.org) {
    if (!/^[a-z][a-z|A-Z]+/.test(opt.org)) {
      console.log('org must be letters and start with lower case')
      return false
    }
    opt.orgTransformed = opt.org.substr(0, 1).toUpperCase() + opt.org.substr(1)
  }
  opt.objectTransformed = opt.object.substr(0, 1).toUpperCase() + opt.object.substr(1)

  opt.module = path.join(opt.module, opt.object)
  let uiModulePath = path.resolve(path.join(path.dirname(__dirname), 'ui', opt.module))
  if (fs.existsSync(uiModulePath)) {
    console.log(`duplicated ui, the directory already exists: ${uiModulePath}`)
    return false
  }
  console.log(`ui code path: ${uiModulePath}`)
  opt.uiModulePath = uiModulePath
  let ops = []
  let serviceModulePath = path.resolve(path.join(path.dirname(__dirname), 'services', 'modules', opt.module))
  if (opt.ops) {
    ops = opt.ops.split('#')
    if (fs.existsSync(serviceModulePath)) {
      console.log(`duplicated service, the directory already exists: ${serviceModulePath}`)
      return false
    }
    opt.ops = ops
    console.log(`service code path: ${serviceModulePath}`)
    opt.serviceModulePath = serviceModulePath
  }
  if (opt.model) {
    let modelModulePath = path.resolve(path.join(path.dirname(__dirname), 'models', opt.object + '.js'))
    if (fs.existsSync(modelModulePath)) {
      console.log(`duplicated model, the directory already exists: ${modelModulePath}`)
      return false
    }
    console.log(`model code path: ${modelModulePath}`)
    opt.modelModulePath = path.resolve(path.join(path.dirname(__dirname), 'models'))
  }
  if (opt.request) {
    let requestModulePath = path.resolve(path.join(path.dirname(__dirname), 'requests', opt.object + '.js'))
    if (fs.existsSync(requestModulePath)) {
      console.log(`duplicated request, the directory already exists: ${requestModulePath}`)
      return false
    }
    console.log(`request code path: ${requestModulePath}`)
    opt.requestModulePath = path.resolve(path.join(path.dirname(__dirname), 'requests'))
  }
}

function generateCode(fileName, srcCodeFile, dstDir, replaceLines) {
  let code = fs.readFileSync(srcCodeFile, {encoding: 'utf-8'})
  fileName = fileName.replace('user', opt.object).replace('User', opt.objectTransformed)
  if (opt.org) fileName = fileName.replace('org', opt.org).replace('Org', opt.orgTransformed)
  let dstFile = path.join(dstDir, fileName)
  if (replaceLines) {
    for (let line of replaceLines) {
      code = code.replace(line[1] ? line[0] : line[0] + '\r\n', line[1] ? line[1] : '')
      if (!line[1]) code = code.replace(line[0] + '\n', '')
    }
  }
  code = code.replace(/user/g, opt.object).replace(/User/g, opt.objectTransformed)
  if (opt.org) {
    code = code.replace(/Organization/g, opt.orgTransformed).replace(/org/g, opt.org).replace(/Org/g, opt.orgTransformed)
  }
  console.log(`+++create code: ${dstFile}`)
  fs.writeFileSync(dstFile, code)
}

function createUICodeFromTemplate() {
  fs.mkdirSync(opt.uiModulePath)
  let codeFiles = fs.readdirSync(uiTemplateCodeDir)
  let replaceLines = [['system/user', [opt.module, opt.object].join('/')]]
  if (!opt.model) {
    replaceLines = [...replaceLines, ...opt.modelReplacement]
  }
  if (!opt.org) {
    replaceLines = [...replaceLines, ...opt.orgReplacement]
    replaceLines.push(['                  {moduleSettings', '        {moduleSettings'])
  }
  for (let fileName of codeFiles) {
    if (!opt.org && fileName.indexOf('Org') !== -1) continue
    generateCode(fileName, path.join(uiTemplateCodeDir, fileName), opt.uiModulePath, replaceLines)
  }
}

function createModelFromTemplate() {
  if (!opt.model) return
  let fileName = 'user.js'
  let replacement = []
  if (!opt.org) replacement.push([`    selectedOrgKeys: [],`])
  generateCode(fileName, path.join(modelTempateCodeDir, fileName), opt.modelModulePath, replacement)
}

function createRequestFromTemplate() {
  if (!opt.request) return
  let fileName = 'user.js'
  let replacement = [
    [`'system', 'customer'`, [...opt.module.split('/'), opt.object].join(', ')]
  ]
  generateCode(fileName, path.join(requestTempateCodeDir, fileName), opt.requestModulePath, replacement)
  fileName = 'org.js'
  generateCode(fileName, path.join(requestTempateCodeDir, fileName), opt.requestModulePath, replacement)
}

function createServiceCodeFromTemplate(modulePath, ops) {
  if (opt.ops.length === 0) return
  fs.mkdirSync(opt.serviceModulePath)
  let codeFiles = fs.readdirSync(serviceTempateCodeDir)
  for (let fileName of codeFiles) {
    generateCode(fileName, path.join(serviceTempateCodeDir, fileName), opt.serviceModulePath)
  }
}

function loadReplacements() {
  let baseDir = path.join(templatePath, 'replacement')
  let code = fs.readFileSync(path.join(baseDir, 'model.txt'), {encoding: 'utf-8'})
  code = code.split('```')
  opt.modelReplacement = []
  for (let c of code) {
    c = trimLineTag(c)
    if (c) opt.modelReplacement.push([c])
  }
  code = fs.readFileSync(path.join(baseDir, 'org.txt'), {encoding: 'utf-8'})
  code = code.split('```')
  opt.orgReplacement = []
  for (let c of code) {
    c = trimLineTag(c)
    if (c) opt.orgReplacement.push([c])
  }
}

function initTemplateCode() {
  console.log('start to init template code...')
  let srcDir = path.dirname(__dirname)
  fs.writeFileSync(path.join(requestTempateCodeDir, 'user.js'), fs.readFileSync(path.join(srcDir, 'requests', 'user.js')))
  fs.writeFileSync(path.join(requestTempateCodeDir, 'org.js'), fs.readFileSync(path.join(srcDir, 'requests', 'org.js')))
  fs.writeFileSync(path.join(modelTempateCodeDir, 'user.js'), fs.readFileSync(path.join(srcDir, 'models', 'user.js')))

  let baseDir = path.join(srcDir, 'ui', 'system', 'user')
  let codeFiles = fs.readdirSync(baseDir)
  for (let fileName of codeFiles) {
    fs.writeFileSync(path.join(uiTemplateCodeDir, fileName), fs.readFileSync(path.join(baseDir, fileName)))
  }

  baseDir = path.join(srcDir, 'services', 'modules', 'system', 'user')
  codeFiles = fs.readdirSync(baseDir)
  for (let fileName of codeFiles) {
    fs.writeFileSync(path.join(serviceTempateCodeDir, fileName), fs.readFileSync(path.join(baseDir, fileName)))
  }
}

function main() {
  if (parseOptions() === false) return
  if (opt.init) {
    initTemplateCode()
    return
  }
  loadReplacements()
  createUICodeFromTemplate()
  createModelFromTemplate()
  createRequestFromTemplate()
  createServiceCodeFromTemplate()
}

main()
