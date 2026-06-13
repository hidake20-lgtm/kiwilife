// Kiwi Life Online — Hanmer Springs 多人伺服器 (Colyseus)
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server, Room } = require('colyseus');
const { WebSocketTransport } = require('@colyseus/ws-transport');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer })
});

class TownRoom extends Room {
  onCreate() {
    this.maxClients = 40;
    this.players = {};
    // 玩家位置更新
    this.onMessage('move', (client, d) => {
      const p = this.players[client.sessionId];
      if (p && d) {
        p.x = +d.x || 0;
        p.y = +d.y || 0;
        p.dir = ['d','l','r','u'].includes(d.dir) ? d.dir : 'd';
        p.m = !!d.m;
      }
    });
    // 聊天廣播
    this.onMessage('chat', (client, t) => {
      t = String(t || '').slice(0, 80).trim();
      if (!t) return;
      const p = this.players[client.sessionId];
      this.broadcast('chat', { id: client.sessionId, name: p ? p.name : '?', t });
    });
    // 好友私訊（悄悄話）：依暱稱送給對方，並回傳一份給自己
    this.onMessage('whisper', (client, d) => {
      d = d || {};
      const to = String(d.to || '').slice(0, 12).trim();
      const t = String(d.t || '').slice(0, 80).trim();
      if (!to || !t) return;
      const from = this.players[client.sessionId];
      const fromName = from ? from.name : '?';
      const payload = { fromId: client.sessionId, from: fromName, to: to, t: t };
      let delivered = false;
      // 送給所有暱稱相符的在線玩家
      for (const c of this.clients) {
        if (c.sessionId === client.sessionId) continue;
        const tp = this.players[c.sessionId];
        if (tp && tp.name === to) { c.send('whisper', payload); delivered = true; }
      }
      // 回傳給自己（顯示在自己的對話區，並回報是否送達）
      client.send('whisper', Object.assign({ self: true, delivered: delivered }, payload));
    });
    // 每 100ms 廣播所有玩家狀態
    this.clock.setInterval(() => this.broadcast('st', this.players), 100);
  }
  onJoin(client, options) {
    options = options || {};
    this.players[client.sessionId] = {
      x: 1088, y: 1376, dir: 'd', m: false,
      name: String(options.name || 'Kiwi').slice(0, 12),
      skin: (options.skin | 0) % 6
    };
    console.log('[join]', client.sessionId, this.players[client.sessionId].name);
  }
  onLeave(client) {
    console.log('[leave]', client.sessionId);
    delete this.players[client.sessionId];
  }
}

gameServer.define('town', TownRoom);

const PORT = process.env.PORT || 2567;
gameServer.listen(PORT).then(() => {
  console.log('==========================================');
  console.log(' Kiwi Life Online 伺服器已啟動！');
  console.log(' 本機遊玩：http://localhost:' + PORT);
  console.log(' 同 WiFi 朋友：http://<你的IP>:' + PORT);
  console.log('==========================================');
});
