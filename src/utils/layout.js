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

module.exports = {
  addSimscroll (node, h, opt) {
    node = $(node)
    h = h + 'px'
    node.css({'max-height': h, height: h})
    if (!node.attr('psInited')) node.perfectScrollbar(opt ? opt : {})
    node.perfectScrollbar('update')
  },

  getFullHeight,

  calcFullFillHeight (node, nodeBelow) {
    node = $(node)
    let h = $(window).height()
    if (nodeBelow) {
      if (_.isInteger(nodeBelow)) h -= nodeBelow
      else h -= getFullHeight(nodeBelow)
    }
    h -= node.offset().top
    while (node && node.get(0) !== document) {
      h -= cssValueToInt(node, 'padding-bottom')
      h -= cssValueToInt(node, 'margin-bottom')
      h -= cssValueToInt(node, 'border-bottom-width')
      node = node.parent()
    }
    return h
  },
  $,
}
