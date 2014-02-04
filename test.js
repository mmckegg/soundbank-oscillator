var Oscillator = require('./index')

var audioContext = new webkitAudioContext()
var oscillator = Oscillator(audioContext)

oscillator.connect(audioContext.destination)

addSlider(oscillator.amp, 0.001, 0, 10)
addSlider(oscillator.note)
addSlider(oscillator.frequency)
addSlider(oscillator.detune)

oscillator.start(0)

function addSlider(param, step, min, max){
  var container = document.createElement('div')
  container.appendChild(document.createTextNode(param.name))
  var label = document.createTextNode(param.defaultValue)
  var slider = document.createElement('input')
  slider.type = 'range'
  slider.min = min != null ? min : (param.min || 0)
  slider.max = max != null ? max : (param.max || 100)
  slider.value = param.defaultValue

  slider.style.width = '300px'

  if (step){
    slider.step = step
  }

  slider.onchange = function(){
    label.data = this.value
    param.value = parseFloat(this.value)
  }
  container.appendChild(slider)
  container.appendChild(label)
  document.body.appendChild(container)
}