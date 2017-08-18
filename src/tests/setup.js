import { JSDOM } from 'jsdom'

let dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, { url: 'http://localhost' })
global.document = dom.window.document
global.window = dom.window
global.navigator = global.window.navigator
