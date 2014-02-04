var createAudioNode = require('custom-audio-node')
var extendTransform = require('audio-param-transform')

module.exports = function(audioContext){
  var oscillator = audioContext.createOscillator()
  var gain = audioContext.createGain()

  extendTransform(oscillator.detune, audioContext)
  extendTransform(gain.gain, audioContext)

  var ampParam = gain.gain.transform()
  var ampRolloffParam = gain.gain.transform(noteGainRolloff)

  var detuneParam = oscillator.detune.transform()
  var noteParam = oscillator.detune.transform(noteToCentOffset)

  oscillator.connect(gain)

  var node = createAudioNode(null, gain, {
    amp: {
      min: 0, defaultValue: 1,
      target: ampParam
    },
    note: {
      min: 0, max: 127, defaultValue: 69,
      targets: [ noteParam, ampRolloffParam ]
    },
    frequency: {
      min: 20, max: 20000, defaultValue: 440,
      target: oscillator.frequency
    },
    detune: {
      min: -200, max: 200, defaultValue: 0,
      target: detuneParam
    }
  })

  node.start = function(at){
    oscillator.start(at)
  }

  node.stop = function(at){
    oscillator.onended = node.onended
    oscillator.stop(at)
  }

  return node
}

function noteGainRolloff(a, b){
  var ampRolloff = (Math.exp((b||0)/127)-1) * 0.5
  return a - (a * ampRolloff)
}

function noteToCentOffset(a, b){
  return a + (((b||0) - 69) * 100)
}