soundbank-oscillator
===

Oscillator AudioNode source extended with automatable amplitude and midi note params.

Intended for use as a source in [soundbank](https://github.com/mmckegg/soundbank), but it is compatiable with any old Web Audio API AudioNode set up.

## Install

```bash
$ npm install soundbank-oscillator
```

## API

```js
var Oscillator = require('soundbank-oscillator')
```

### Oscillator(audioContext)

Returns a source AudioNode.

**AudioParams**: frequency, note, detune, amp 

### source.start(at)

Schedule note start. Can only be called once. For each event, create a new instance of oscillator.

### source.stop(at)

Schedule note stop.

## Standalone Example

```js
var Oscillator = require('./index')

var audioContext = new webkitAudioContext()
var oscillator = Oscillator(audioContext)

oscillator.note.value = 60 // middle C (midi)
oscillator.start(0)
```
