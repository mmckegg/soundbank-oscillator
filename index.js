var AudioVoltage = require('audio-voltage')
var rolloff = generateRolloff()

module.exports = function(audioContext){
  var node = audioContext.createGain()
  var oscillator = audioContext.createOscillator()
  var rolloffGain = audioContext.createGain()

  oscillator.connect(rolloffGain)
  rolloffGain.connect(node)


  // note param input
  var midiVoltage = AudioVoltage(audioContext)
  midiVoltage.gain.value = 69 // set base note (440hz middle A)

  // normalize to 0
  var offset = AudioVoltage(audioContext)
  offset.gain.value = -69
  midiVoltage.connect(offset.gain)

  // multiply by 100 and connect to oscillator detune
  var centMultiplier = audioContext.createGain()
  centMultiplier.gain.value = 100
  offset.connect(centMultiplier)
  centMultiplier.connect(oscillator.detune)


  // apply gain rolloff
  applyRolloff(midiVoltage, rolloffGain.gain)


  // export params
  node.amp = node.gain
  node.note = midiVoltage.gain
  node.frequency = oscillator.frequency
  node.detune = oscillator.detune

  Object.defineProperty(node, 'shape', {
    get: function(){
      return oscillator.type
    }, 
    set: function(value){
      oscillator.type = value
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

function applyRolloff(midiVoltage, target){
  var audioContext = midiVoltage.context
  
  var scale = audioContext.createGain()
  scale.gain.value = 1/127
  midiVoltage.connect(scale)

  var shape = audioContext.createWaveShaper()
  shape.curve = rolloff
  scale.connect(shape)

  shape.connect(target)
}

function generateRolloff(){
  var result = new Float32Array(256)
  for (var i=0;i<128;i++){
    result[i+128] = (Math.exp(i/127)-1) * -0.5
  }
  return result
}

function noteGainRolloff(a, b){
  var ampRolloff = (Math.exp((b||0)/127)-1) * 0.5
  return 1 - ampRolloff
}

function noteToCentOffset(a, b){
  return a + (((b||0) - 69) * 100)
}