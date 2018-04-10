var pull = require('pull-stream')
var paramap = require('pull-paramap')
var qs = require('qs')
var isMsg = require('ssb-ref').isMsg
var h = require('hyperscript')

var QueryStream = require('mfr-query-stream')

exports.needs = {
  sbot: {
    query: { read: 'first' },
    get: 'first'
  },
  message: {
    layout: 'first'
  }
}

exports.gives = {
  app: {
    view: true
  },
  avatar: {
    action: true
  }
}

exports.create = function (api) {
  return {app: {view: function (src) {
    if(!/^votes/.test(src)) return
    var opts = qs.parse(src.substring(6))
    return QueryStream(
      api.sbot.query.read,
      [{$filter: {value: {
        private: {$is: 'undefined'},
        content: {type: 'vote'},
        author: opts.id
      }}}],
      function () {
        return pull(
          paramap(function (data, cb) {
            var key = data.value.content.vote.link
            api.sbot.get(key, function (err, value) {
              cb(null, {key:key, value: value})
            })
          }),
          pull.map(api.message.layout)
        )
      },
      h('div.content')
    )
  }},
  avatar: {
    action: function (id) {
      return h('a', {href: 'votes?'+qs.stringify({id: id})}, 'yups')
    }
  }}
}

