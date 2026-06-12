module.exports.config = {
  name: 'out',
  version: '1.0.0',
  hasPermssion: 2,
  credits: 'DũngUwU',
  description: 'out box',
  commandCategory: 'Nhóm',
  usages: '[tid]',
  cooldowns: 3,
}

module.exports.run = async ({ api, event, args }) => {
  var id
  if (!args.join(' ')) {
    id = event.threadID
  } else {
    id = parseInt(args.join(' '), 10)
  }
  return api.sendMessage('Đã nhận lệnh out nhóm từ admin!', id, () =>
    api.removeUserFromGroup(api.getCurrentUserID(), id)
  )
}
