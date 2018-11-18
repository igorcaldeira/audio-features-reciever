import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const URLlink = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/Yodel_Sound_Effect.mp3';
const {Meyda} = window 

class App extends Component {

  componentDidMount(){
    const levelRangeElement0 = document.getElementById("levelRange0");
    const levelRangeElement1 = document.getElementById("levelRange1");
    const levelRangeElement2 = document.getElementById("levelRange2");
    const levelRangeElement3 = document.getElementById("levelRange3");
    const levelRangeElement4 = document.getElementById("levelRange4");
    const levelRangeElement5 = document.getElementById("levelRange5");
    const levelRangeElement6 = document.getElementById("levelRange6");
    const levelRangeElement7 = document.getElementById("levelRange7");
    const levelRangeElement8 = document.getElementById("levelRange8");
    const levelRangeElement9 = document.getElementById("levelRange9");
    const levelRangeElement10 = document.getElementById("levelRange10");
    const levelRangeElement11 = document.getElementById("levelRange11");
    const levelRangeElement12 = document.getElementById("levelRange12");
    const levelRangeElement13 = document.getElementById("levelRange13");

    const audioContext = new AudioContext();
    // Select the Audio Element from the DOM
    const htmlAudioElement = document.getElementById("audio");
    // Create an "Audio Node" from the Audio Element
    const source = audioContext.createMediaElementSource(htmlAudioElement);
    // Connect the Audio Node to your speakers. Now that the audio lives in the
    // Audio Context, you have to explicitly connect it to the speakers in order to
    // hear it
    source.connect(audioContext.destination);

    let oldf = {}

    if (typeof Meyda === "undefined") {
      console.log("Meyda could not be found! Have you included it?");
    }
    else {
      const analyzer = Meyda.createMeydaAnalyzer({
        "audioContext": audioContext,
        "source": source,
        "bufferSize": 512,
        "featureExtractors": ["chroma"],
        "callback": features => {
          if (features["chroma"][0] !== 0 && features["chroma"][1] !== 0 && features["chroma"][2] !== 0) {
            levelRangeElement0.value =  features["chroma"][0];
            levelRangeElement1.value =  features["chroma"][1];
            levelRangeElement2.value =  features["chroma"][2];
            levelRangeElement3.value =  features["chroma"][3];
            levelRangeElement4.value =  features["chroma"][4];
            levelRangeElement5.value =  features["chroma"][5];
            levelRangeElement6.value =  features["chroma"][6];
            levelRangeElement7.value =  features["chroma"][7];
            levelRangeElement8.value =  features["chroma"][8];
            levelRangeElement9.value =  features["chroma"][9];
            levelRangeElement10.value =  features["chroma"][10];
            levelRangeElement11.value =  features["chroma"][11];
          }
        }
      });
      analyzer.start();
    }

    /***************************** */
  }

  recordAndPlay = () => {
    const recordAudio = () =>
      new Promise(async resolve => {
        console.log('gravar')

        let featuresStock = []
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaStreamSource(stream);

        let audioRanges = []
        let rangeNames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

        rangeNames.map((item, index) => {
          audioRanges.push(document.getElementById("levelRange"+index))
        })

        const levelRangeElement1 = document.getElementById("levelRange1");
        const levelRangeElement2 = document.getElementById("levelRange2");
        const levelRangeElement3 = document.getElementById("levelRange3");
        const levelRangeElement4 = document.getElementById("levelRange4");
        const levelRangeElement5 = document.getElementById("levelRange5");
        const levelRangeElement6 = document.getElementById("levelRange6");
        const levelRangeElement7 = document.getElementById("levelRange7");
        const levelRangeElement8 = document.getElementById("levelRange8");
        const levelRangeElement9 = document.getElementById("levelRange9");
        const levelRangeElement10 = document.getElementById("levelRange10");
        const levelRangeElement11 = document.getElementById("levelRange11");
        const levelRangeElement12 = document.getElementById("levelRange12");
        const levelRangeElement13 = document.getElementById("levelRange13");

        const analyzer = Meyda.createMeydaAnalyzer({
          "audioContext": audioCtx,
          "source": source,
          "bufferSize": 512,
          "featureExtractors": ["chroma", "rms", "spectralCentroid", "spectralRolloff"],
          "callback": features => {
            console.log("chroma", features);

            let fChroma = features['chroma']
            let fRms = isNaN(features['rms']) ? 0 : features['rms']
            let fSpectralCentroid = isNaN(features['spectralCentroid']) ? 0 : features['spectralCentroid']
            let fSpectralRolloff = isNaN(features['spectralRolloff']) ? 0 : features['spectralRolloff']

            let featuresArray = [fRms, fSpectralCentroid, fSpectralRolloff].concat(fChroma)

            featuresStock.push(featuresArray)

            if (features["chroma"][0] !== 0 && features["chroma"][1] !== 0 && features["chroma"][2] !== 0) {

              audioRanges = audioRanges.map((item,index) => {
                item.value = features["chroma"][index]
                return item
              })

              levelRangeElement1.value = features["chroma"][1];
              levelRangeElement2.value = features["chroma"][2];
              levelRangeElement3.value = features["chroma"][3];
              levelRangeElement4.value = features["chroma"][4];
              levelRangeElement5.value = features["chroma"][5];
              levelRangeElement6.value = features["chroma"][6];
              levelRangeElement7.value = features["chroma"][7];
              levelRangeElement8.value = features["chroma"][8];
              levelRangeElement9.value = features["chroma"][9];
              levelRangeElement10.value = features["chroma"][10];
              levelRangeElement11.value = features["chroma"][11];
            }
          }
        });

        analyzer.start()

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () =>
          new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
              console.log(featuresStock)

              var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(featuresStock))
              var dlAnchorElem = document.getElementById('downloadAnchorElem')
                  dlAnchorElem.setAttribute("href", dataStr)
                  dlAnchorElem.setAttribute("download", "audio.json")

              const audioBlob = new Blob(audioChunks);
              const audioUrl = URL.createObjectURL(audioBlob);
              this.refs.localAudioPrincipal.src = audioUrl
              const audio = new Audio(audioUrl);
              const play = () => audio.play();
              resolve({ audioBlob, audioUrl, play });
            });

            mediaRecorder.stop();
            analyzer.stop()
          });

        resolve({ start, stop });
      });

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    (async () => {
      const recorder = await recordAudio();
      recorder.start();
      await sleep(1500);
      const audio = await recorder.stop();
      audio.play();
    })();
  }

  render() {

    return (
      <div className="App">
        <button id="record audio" onClick={() => this.recordAndPlay()}>gravar</button>
        <audio
          ref='localAudioPrincipal'
          controls
          crossOrigin="anonymous"
          id="audio"
          src={URLlink} >
        </audio>
        <canvas id="myChart"></canvas>
      <hr />
      <div style={{'transform': 'rotate(90deg)'}}>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map((item, key) => <div key={key}><input type="range"
          id={"levelRange"+key}
          name={"levelRange" + key}
          min="0.0"
          max="2.0"
          step="0.0001"
        /> {document.getElementById("levelRange" + key) ? document.getElementById("levelRange"+key).value : ''} <br /></div>)}
          
        </div>
        <center>(C, C♯, D, D♯, E, F, F♯, G, G♯, A, A♯, B)</center>
        <hr />
        <br />
        <div>
          <a id="downloadAnchorElem" style={{float: 'left'}} >baixar audio após gravado</a>
        </div>
      </div>
    );
  }
}

export default App;
