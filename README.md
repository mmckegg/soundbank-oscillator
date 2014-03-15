soundbank-oscillator
===

Oscillator AudioNode source extended with automatable amplitude and midi note params.

Intended for use as a source in [soundbank](https://github.com/mmckegg/soundbank), but it is compatible with any Web Audio API AudioNode set up.

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

**AudioParams**: frequency, note (higher notes rolloff amplitude), detune, amp

### source.shape (get/set)

Set the waveform shape of the audio node: 'sine', 'triangle', 'sawtooth', 'square'

### source.start(at)

Schedule note start. Can only be called once. For each event, create a new instance of oscillator.

### source.stop(at)

Schedule note stop.

## Standalone Example

```js
var Oscillator = require('soundbank-oscillator')

var audioContext = new webkitAudioContext()
var oscillator = Oscillator(audioContext)

oscillator.note.value = 60 // middle C (midi)
oscillator.start(0)
```
