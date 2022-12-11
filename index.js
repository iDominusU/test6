const express = require('express');
const app = express();
const port = 3000;
const WebSocket = require("ws");
const SocketServer = require("ws").Server;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const func = [
  "maskequip",
  "equiptool",
  "disableall",
  "enableall",
  "killmobs",
  "farmant",
  "converthoney",
  "hourly",
  "pickfield",
  "shutdown"
];

const server = app.listen(port, () => {
  console.log(`Listening`)
})


const wss = new SocketServer({ server });

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

wss.on('connection', (ws) => {
  console.log('Connection found.')
  console.log('Connection found.')
  ws.on('close', () => {
    console.log('Connection has been closed.')
  });
  ws.on('message', (message) => {
    console.log('Message recieved. (%s)', message);
    if (message.toString().startsWith("id|")) {
      var idArray = message.toString().split("|");
      ws.id = idArray[1]
    }
    if (message.toString().startsWith("hourly|")) {
      var hourlyArray = message.toString().split("|");
      //url,timepassed,honeygained,totalhoneystring,honeygainedstring,honeyperhourstring,uptimestring,macrov2.vars.discordid
      // console.log(hourlyArray)//whole array
      // console.log(hourlyArray[1])//url
      // console.log(hourlyArray[2])//timepassed
      // console.log(hourlyArray[3])//honeygained
      // console.log(hourlyArray[4])//totalhoneystring
      // console.log(hourlyArray[5])//honeygainedstring
      // console.log(hourlyArray[6])//uptimestring
      // console.log(hourlyArray[7])//the users id

      var data = {
        "content": "<@" + hourlyArray[8] + ">",
        "embeds": [
          {
            "title": "Honey Update",
            "description": "An update of the honey info",
            "color": 5814783,
            "fields": [
              {
                "name": "Total Honey",
                "value": hourlyArray[4]
              },
              {
                "name": "Current Honey",
                "value": hourlyArray[11]
              },
              {
                "name": "Gained Honey",
                "value": hourlyArray[5]
              },
              {
                "name": "Hourly Honey",
                "value": hourlyArray[6]
              }
            ],
            "author": {
              "name": hourlyArray[9],
              "icon_url": hourlyArray[10]
            },
            timestamp: new Date().toISOString(),
          }
        ]
      }
      console.log(JSON.stringify(data))
      fetch(hourlyArray[1], { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }).then(res => res.json())
        .then(res => {
          console.log(JSON.stringify(res))
        })
        .catch(err => console.log(err));

    }

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

app.get('/:userId/functions/:funcId/:args', (req, res) => {
  var userId = req.params.userId;
  var funcId = req.params.funcId;
  var args = req.params.args;
  if (!args) args = "0";
  console.log(args)

  if (args == "gmy") {
    args = "Gummy Mask"
  } else if (args == "dmn") {
    args = "Demon Mask"
  } else if (args == "dmd") {
    args = "Diamond Mask"
  } else if (args == "bkp") {
    args = "Beekeeper's Mask"
  } else if (args == "hny") {
    args = "Honey Mask"
  } else if (args == "fir") {
    args = "Fire Mask"
  } else if (args == "bbl") {
    args = "Bubble Mask"
  } else if (args == "sff") {
    args = "Sunflower Field"
  } else if (args == "ddf") {
    args = "Dandelion Field"
  } else if (args == "cvf") {
    args = "Clover Field"
  } else if (args == "bff") {
    args = "Blue Flower Field"
  } else if (args == "mrf") {
    args = "Mushroom Field"
  } else if (args == "sbf") {
    args = "Strawberry Field"
  } else if (args == "spf") {
    args = "Spider Field"
  } else if (args == "bbf") {
    args = "Bamboo Field"
  } else if (args == "pnp") {
    args = "Pineapple Patch"
  } else if (args == "stf") {
    args = "Stump Field"
  } else if (args == "rsf") {
    args = "Rose Field"
  } else if (args == "ptf") {
    args = "Pine Tree Forest"
  } else if (args == "ctf") {
    args = "Cactus Field"
  } else if (args == "pkp") {
    args = "Pumpkin Patch"
  } else if (args == "mtf") {
    args = "Mountain Top Field"
  } else if (args == "ccf") {
    args = "Coconut Field"
  } else if (args == "prp") {
    args = "Pepper Patch"
  } else if (args == "ssf") {
    args = "Spark Staff"
  } else if (args == "gre") {
    args = "Golden Rake"
  } else if (args == "pdr") {
    args = "Porcelain Dipper"
  } else if (args == "pwd") {
    args = "Petal Wand"
  } else if (args == "gbr") {
    args = "Gummy Baller"
  } else if (args == "dse") {
    args = "Dark Scythe"
  } else if (args == "tpe") {
    args = "Tide Popper"
  } else if (args == "rse") {
    args = "Red Scythe"
  } else if (args == "bbw") {
    args = "Bubble Wand"
  } 

  wss.clients.forEach(function each(client) {
    if (client.id == userId && client.readyState === WebSocket.OPEN) {
      if (args == "0") {
        client.send(func[funcId])
      } else {
        client.send(`${func[funcId]},${args}`);
      }
    } else return;
  });

  res.sendStatus(200);
});