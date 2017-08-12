import { l } from 'utils/localization'
import $ from 'jquery'
import ps from 'perfect-scrollbar/jquery'
import _ from 'lodash'

function cssValueToInt (n, name) {
  let v = n.css(name)
  return v ? parseInt(v) : 0
}

function getFullHeight (n) {
  n = $(n)
  return n.height() + cssValueToInt(n, 'padding-top') + cssValueToInt(n, 'padding-bottom') + cssValueToInt(n, 'margin-top') + cssValueToInt(n, 'margin-bottom') + cssValueToInt(n, 'border-top-width') + cssValueToInt(n, 'border-bottom-width')
}

function getHeightWithoutContent (n) {
  n = $(n)
  return cssValueToInt(n, 'padding-top') + cssValueToInt(n, 'padding-bottom') + cssValueToInt(n, 'margin-top') + cssValueToInt(n, 'margin-bottom') + cssValueToInt(n, 'border-top-width') + cssValueToInt(n, 'border-bottom-width')
}

function getMarginHeight (n) {
  n = $(n)
  return cssValueToInt(n, 'margin-top') + cssValueToInt(n, 'margin-bottom') + cssValueToInt(n, 'border-top-width') + cssValueToInt(n, 'border-bottom-width')
}

function scrollHeight (n) {
  n = $(n)
  return n.length > 0 ? n.get(0).scrollHeight : 0
}

module.exports = {
  setHeight  (node, h) {
    node = $(node)
    h = h + 'px'
    node.css({'max-height': h, height: h})
  },

  addSimscroll (node, h, opt) {
    node = $(node)
    h = h + 'px'
    node.css({'max-height': h, height: h})
    if (!node.data('psInited')) {
      node.perfectScrollbar(opt ? opt : {})
      node.data('psInited', 1)
    }
    node.perfectScrollbar('update')
  },

  destrySimscroll (node) {
    $(node).perfectScrollbar('destroy').data('psInited', null)
  },

  updateSimscroll (node) {
    $(node).perfectScrollbar('update')
  },

  getFullHeight,

  getHeightWithoutContent,

  getMarginHeight,

  scrollHeight,

  calcFullFillHeight (node, nodeBelow, ignoreContainer) {
    node = $(node)
    let container = $('#container')
    let isWindowContainer = false
    if (ignoreContainer || container.length === 0 || container.get(0) === node.get(0)) {
      container = $(window)
      isWindowContainer = true
    }
    let h = container.height()
    if (nodeBelow) {
      if (_.isInteger(nodeBelow)) h -= nodeBelow
      else h -= getFullHeight(nodeBelow)
    }
    let domContainer = isWindowContainer ? $(document).get(0) : container.get(0)
    if (node.offset().top < 0) {
      let inner = $('.content-inner')
      if (inner.length > 0) h -= inner.offset().top - node.offset().top
      h -= (isWindowContainer ? 0 : container.offset().top)
    } else {
      h -= node.offset().top - (isWindowContainer ? 0 : container.offset().top)
    }
    node = node.parent()
    while (node.length > 0 && node.get(0) !== domContainer) {
      h -= cssValueToInt(node, 'padding-bottom')
      h -= cssValueToInt(node, 'margin-bottom')
      h -= cssValueToInt(node, 'border-bottom-width')
      node = node.parent()
    }
    return h
  },

  getResizeState (node, oldState) {
    node = $(node)
    let needResize = false
    if (!oldState) oldState = {}
    if (oldState.top !== node.offset().top) {
      oldState.top = node.offset().top
      needResize = true
    }
    let container = $('#container')
    if (container.length === 0 || container.get(0) === node.get(0)) container = $(window)
    if (container.height() !== oldState.winHeight) {
      oldState.winHeight = container.height()
      needResize = true
    }
    if (container.width() !== oldState.winWidth) {
      oldState.winWidth = container.width()
      needResize = true
    }
    oldState.needResize = needResize
    return oldState
  },

  getTableColumn (table, colOptions) {
    if (!table || !table.names || table.names.length === 0) return false
    let cols = []
    // [dataIndex, title, width, sort, render, className]
    for (let item of table.names) {
      let col = {
        title: item[1] ? l(item[1]) : '',
        width: item[2],
      }
      if (item[0]) {
        col.key = item[0]
        col.dataIndex = item[0]
      }
      if (item[3]) {
        if (colOptions && colOptions.sorter && colOptions.sorter[item[0]]) col.sorter = colOptions.sorter[item[0]]
        else col.sorter = true
      }
      if (colOptions) {
        if (item.length >= 5) {
          col.render = colOptions.render[item[4] === true ? item[0] : item[4]]
        }
        if (item.length >= 6) {
          col.className = colOptions.className[item[5] === true ? item[0] : item[5]]
        }
      }
      cols.push(col)
    }
    return cols
  },

  $,
}
