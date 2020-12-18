##Broadcast all clients accross different server instances

###index.mjs

Start up a server in the terminal, specifiying the app id and port: `APPID=1 PORT=8081 node index.mjs`
Start a 2nd server in a new tab/window with a different id and port: `APPID=2 PORT=8082 node index.mjs`

connent a client to the first server: `wscat -c 'ws://localhost:8081'`
connent another client to the second server: `wscat -c 'ws://localhost:8082'`

type a message in your client, hit enter. Every client should see the message.

##Broadcast to selective clients that are subscribed to a channel:

###rooms.mjs

start up two different servers on different ports: 

- `PORT=8081 node rooms.mjs`
- `PORT=8082 node rooms.mjs`

Connect your client and specify a "user channel" with a querystring url: `wscat -c 'ws://localhost:8081?user=123`
And again with a different user value: `wscat -c 'ws://localhost:8081?user=456`

broadcast a message to a specific user prefixed with `broadcast@<user_channel_here>:`.
eg:

```
broadcast@user=456: Hello, I wonder if you have any spare food
```

Only that user will recieve the message.