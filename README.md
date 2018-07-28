MonoxBot
========

Source code for MonoxBot

If you want invite this bot follow this link <http://monoxbot.ga>

# Selfhost

Requirements
- Python 2.7
- C++ compiler (WINDOWS ONLY)
- Node.js v9.x.x
- Imagemagick
- PostgreSQL Server (Local or cloud)

### Android
```
ANDROID NOTE: You must fixing npm in termux because npm can't get list of cpus 
              https://github.com/termux/termux-packages/issues/1855
```
```
ANDROID NOTE: Voice command won't working because node-opus won't installing in android
```
- Install termux in google play
- Open and install node.js
- Open `/usr/lib/node_modules/npm/node_modules/worker-farm/lib/farm.js` and set `maxConcurrentWorkers` to `1`
  (See android first note)
- Clone git
- cd to repository folder
- Install remaining requirements by do `npm installtermux`
- See environment.md to setup bot before open the bot.
- Run the bot by do `npm start`

### Windows or linux or etc

Make sure all requirement(s) are installed.

- Clone git
- cd to repository folder
- Install remaining requirements by do `npm install`
- See environment.md to setup bot before open the bot.
- Run the bot by do `npm start`

### Enabling Voice-command support

```
# ANDROID ISN'T SUPPORTED #

Voice support disabled by default because high cost of hosting thing.
Also it won't work on android tho.
```

Make sure python 2.7 installed and some other requirements

- do `npm install node-opus`
- Run the bot by do `npm start`
