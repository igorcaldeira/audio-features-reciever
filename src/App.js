import React, { Component } from 'react';
import './App.css';

const { Meyda } = window
const buffersizevar = 2048
let arraysObject = []
let shouldCollect = false
var analyzer = {}
var featuresStock = []

async function createAndStartAna() {
  const audioCtx = new AudioContext()
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const source = audioCtx.createMediaStreamSource(stream)
  analyzer = Meyda.createMeydaAnalyzer({
    "audioContext": audioCtx,
    "source": source,
    "bufferSize": buffersizevar,
    "featureExtractors": ["mfcc"],
    "callback": features => { if (shouldCollect === true) featuresStock.push(features["mfcc"]) }
  })
  analyzer.start()
}
createAndStartAna()

class App extends Component {
  recordAndPlay = () => {
    const recordAudio = () =>
      new Promise(async resolve => {
        shouldCollect = true
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)

        const start = () => mediaRecorder.start()

        const stop = () =>
          new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
              shouldCollect = false
              var merged = [].concat.apply([document.getElementById('textbox_name').value], featuresStock.slice(0, 35))
              featuresStock = []
              arraysObject.push(merged)

              /* transform to csv */

              // start creating columns

              let columns = ["name"]


              for (let k = 0; k < 13; k++) {
                for (let j = 0; j < 35; j++) {
                  columns.push(k + '/' + j)
                }
              }

              const items = [columns].concat(arraysObject)

              let csvOutput = ""

              items.map((item) => {
                csvOutput += item.join(';')
                csvOutput += '\r\n'
              })

              console.log(csvOutput)

              var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(csvOutput)
              var dlAnchorElem = document.getElementById('downloadAnchorElem')
              dlAnchorElem.setAttribute("href", dataStr)
              dlAnchorElem.setAttribute("download", "audio.csv")

              alert('Novo audio!')
            })

            mediaRecorder.stop()
          })

        resolve({ start, stop });
      })

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    (async () => {
      const recorder = await recordAudio();
      recorder.start();
      await sleep(1500);
      await recorder.stop();
    })();
  }

  render() {
    return (
      <div className="App">
        <input id="textbox_name" type="text" required />
        <button id="record audio" onClick={() => this.recordAndPlay()}>gravar</button>
        <hr />
        <br />
        <div>
          <a id="downloadAnchorElem" style={{ float: 'left' }} >baixar audio após gravado</a>
        </div>
      </div>
    )
  }
}

export default App;
