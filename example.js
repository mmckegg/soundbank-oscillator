var Oscillator = require('./index')

var audioContext = new AudioContext()
var oscillator = Oscillator(audioContext)

oscillator.connect(audioContext.destination)

addSlider('amp', oscillator.amp, 0.001, 0, 10)
addSlider('note', oscillator.note, 1, 0, 127)
addSlider('frequency', oscillator.frequency, 1, 440/4, 440*4)
addSlider('detune', oscillator.detune, 1, -100, 100)

oscillator.start(0)

var shapePicker = document.createElement('select')
shapePicker.innerHTML = '<option>sine</option><option>triangle</option><option>sawtooth</option><option>square</option>'
shapePicker.onchange = function(){
  oscillator.shape = this.value
}
document.body.appendChild(shapePicker)


function addSlider(name, param, step, min, max){
  var container = document.createElement('div')
  container.appendChild(document.createTextNode(name))
  var label = document.createTextNode(param.value)
  var slider = document.createElement('input')
  slider.type = 'range'
  slider.min = min != null ? min : (param.minValue || 0)
  slider.max = max != null ? max : (param.maxValue || 100)
  slider.value = param.value

  slider.style.width = '300px'

  slider.step = step || 0.1
  
  slider.oninput = function(){
    label.data = this.value
    param.value = parseFloat(this.value)
  }
  container.appendChild(slider)
  container.appendChild(label)
  document.body.appendChild(container)
}