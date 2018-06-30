const users = [];
const names = {};

// function htmlEscape(text) {
//   return text.replace(/[<>"&]/g, (match) => {
//     switch (match) {
//       case '<': return '&lt;';
//       case '>': return '&gt;';
//       case '&': return '&amp;';
//       case '"': return '&quot;';
//       default: return '';
//     }
//   });
// }

function broadcastMsg(msg) {
  users.forEach((ctx) => {
    // console.log('broadcast msg', msg);
    ctx.websocket.send(JSON.stringify(msg));
  });
}

module.exports = () => function websocketServer(ctx) {
  let name = null;

  ctx.websocket.on('message', (message) => {
    const msgData = JSON.parse(message);
    switch (msgData.event) {
      case 'login': {
        name = msgData.info;
        if (names[name]) {
          ctx.websocket.send(JSON.stringify({ event: 'nameExists' }));
        } else {
          console.log(`${name} login`);
          names[name] = 1;
          users.push(ctx);
          ctx.websocket.send(JSON.stringify({ event: 'loginSuccess' }));
          broadcastMsg({ event: 'join', numOfUser: users.length, who: name });
        }
        break;
      }
      case 'chat':
        broadcastMsg({
          event: 'chat',
          who: name,
          content: msgData.info,
          color: msgData.color,
        });
        break;
      case 'img':
        broadcastMsg({
          event: 'img',
          who: name,
          content: msgData.info,
        });
        break;
      default:
        console.log('unknown msg event', msgData);
        break;
    }
  });

  ctx.websocket.on('close', () => {
    if (names[name]) {
      names[name] = null;
    }
    const index = users.indexOf(ctx);
    users.splice(index, 1);
    broadcastMsg({ event: 'leave', numOfUser: users.length, who: name });
    console.log(`user ${name || 'unknown'} left`);
  });
};
