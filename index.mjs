import WebSocket from "ws"
import redis from "redis"

const APPID = process.env.APPID
const port = process.env.PORT

const subscriber = redis.createClient()
const publisher = redis.createClient()

const wss = new WebSocket.Server({ port })

subscriber.on('message', function (channel, message) {
  wss.clients.forEach(client => client.send(`server-${APPID}: ${message}`))
})

subscriber.subscribe('foobar-channel')

wss.on('connection', connection => {
  connection.send(`connected to server-${APPID}`)
  connection.on('message', message => publisher.publish('foobar-channel', message))
})


// //clean up stuff for closed connections:
//subscriber.unsubscribe()
//subscriber.quit()
//publisher.quit()
