# patchapp-vote

adds a little button for saying for "yup" "like" "dig" "+1" or however you want to express acknowledgement/approval.

"vote" message type allows you to express an acknowledgement or approval
for another ssb message. ssb-clients choose how they want to lable this button and most disagree.

This is also a good example of how `patchless` plugins work.

Firstly this adds a "vote" action on messages (a small button, by giving a `message.action`)
and also `vote` `app.view` which gives a screen showing all votes, or more
interestingly, all the votes by a given identity. This is accessed via a `avatar.action`
which adds a `votes` button on their profile page.

This enables you somewhat to be able to use votes as bookmarks.

## structure of plugin

gives: message.render, message.action, avatar.action, app.view

needs: sbot.links, sbot.names.getSignifier, confirm.show, sbot.createUserStream, sbot.createLogStream, sbot.get, message.layout

## TODO

the name of the button is currently hard wired into the code... but this should
at least be pulled from translations or a settings module.

## License

MIT





