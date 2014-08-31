var rolloff = generateRolloff()

module.exports = function(audioContext){
  var node = audioContext.createGain()
  var oscillator = audioContext.createOscillator()
  var rolloffGain = audioContext.createGain()

  oscillator.connect(rolloffGain)
  rolloffGain.connect(node)

  var voltage = flatten(oscillator)

  // note param input
  var midiVoltage = scale(voltage)
  midiVoltage.gain.value = 69 // set base note (440hz middle A)

  // normalize to 0
  var offset = scale(voltage)
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

var flat = new Float32Array([1,1])
function flatten(node){
  var shaper = node.context.createWaveShaper()
  shaper.curve = flat
  node.connect(shaper)
  return shaper
}

function scale(node){
  var gain = node.context.createGain()
  node.connect(gain)
  return gain
}

function generateRolloff(){
  var result = new Float32Array(256)
  for (var i=0;i<128;i++){
    result[i+128] = (Math.exp(i/127)-1) * -0.5
  }
  return result
}
