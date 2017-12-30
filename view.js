var pull = require('pull-stream')
var paramap = require('pull-paramap')
var qs = require('qs')
var isMsg = require('ssb-ref').isMsg
var h = require('hyperscript')

var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

exports.needs = {
  sbot: {
    createUserStream: 'first',
    createLogStream: 'first',
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
    var id = opts.id
    var content = h('div.content')

    function createStream (opts) {
      return pull(
        (id
          ? More(api.sbot.createUserStream, opts, ['value', 'sequence'])
          : More(api.sbot.createLogStream, opts)
        ),
        pull.filter(function (data) {
          return data.value.content.type == 'vote'
        }),
        paramap(function (data, cb) {
          var key = data.value.content.vote.link
          api.sbot.get(key, function (err, value) {
            cb(null, {key:key, value: value})
          })
        }),
        pull.map(api.message.layout)
      )
    }

    pull(
      createStream({old: false, limit: 100, id: id}),
      HyperMoreStream.top(content)
    )

    pull(
      createStream({reverse: true, live: false, limit: 100, id: id}),
      HyperMoreStream.bottom(content)
    )

    return content

  }},
  avatar: {
    action: function (id) {
      return h('a', {href: 'votes?'+qs.stringify({id: id})}, 'yups')
    }
  }}
}

