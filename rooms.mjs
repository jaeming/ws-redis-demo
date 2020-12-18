import WebSocket from "ws"
import redis from "redis"

const APPID = process.env.APPID
const port = process.env.PORT

const subscriber = redis.createClient()
const publisher = redis.createClient()

const wss = new WebSocket.Server({ port })

subscriber.on('message', function (channel, message) {
  const channelSubscribers = [...wss.clients].filter(client => client.channel === channel)
  channelSubscribers.forEach(client => client.send(message))
})

wss.on('connection', (connection, req) => {
  connection.channel = req.url.replace('/?', '')
  
  subscriber.subscribe(connection.channel)

  connection.on('message', message => {
    if (message.includes('broadcast@')) {
      const [channel, body] = message.replace('broadcast@', '').split(':')
      publisher.publish(channel, `${connection.channel} says: ${body}`)
      connection.send(`sent to ${channel}`)
    }
  })
})


// //clean up stuff for closed connections:
//subscriber.unsubscribe()