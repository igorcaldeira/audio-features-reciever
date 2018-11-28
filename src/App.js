import React, { Component } from 'react';
import './App.css';

const wml_credentials = new Map();

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

  reachWatson = () => {

    // NOTE: you must manually construct wml_credentials hash map below using information retrieved
    // from your IBM Cloud Watson Machine Learning Service instance
    const authCredentials = {
      'apikey': '2glQx2cgEo4WkwbpYvjcR_g61qDXqVIgR7WhGEeQRMpG',
        'iam_apikey_description': 'Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:pm-20:us-south:a/a85f55113e0441639bfbd4bd38183cd3:be84ae42-2de0-4a6d-8e55-53bc175e38bc::',
          'iam_apikey_name': 'auto-generated-apikey-dca8061f-965d-4caf-8d4b-0526bb505df1',
            'iam_role_crn': 'crn:v1:bluemix:public:iam::::serviceRole:Manager',
              'iam_serviceid_crn': 'crn:v1:bluemix:public:iam-identity::a/a85f55113e0441639bfbd4bd38183cd3::serviceid:ServiceId-1cfe245f-06b3-48bd-b20a-c3851d6d26d1',
                'instance_id': 'be84ae42-2de0-4a6d-8e55-53bc175e38bc',
                  'password': 'cf2d876b-aaf5-4054-8440-e09585d0ac35',
                    'url': 'https://us-south.ml.cloud.ibm.com',
                      'username': 'dca8061f-965d-4caf-8d4b-0526bb505df1'
    }

    const wml_service_credentials_url = authCredentials['url']
    const wml_service_credentials_username = authCredentials['username']
    const wml_service_credentials_password = authCredentials['password']

    wml_credentials.set("url", wml_service_credentials_url);
    wml_credentials.set("username", wml_service_credentials_username);
    wml_credentials.set("password", wml_service_credentials_password);

    function apiGet(url, username, password, loadCallback, errorCallback) {
      const oReq = new XMLHttpRequest();
      const tokenHeader = "Basic " + btoa((username + ":" + password));
      const tokenUrl = url + "/v3/identity/token";

      oReq.addEventListener("load", loadCallback);
      oReq.addEventListener("error", errorCallback);
      oReq.open("GET", tokenUrl);
      oReq.setRequestHeader("Authorization", tokenHeader);
      oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      oReq.send();
    }

    function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", loadCallback);
      oReq.addEventListener("error", errorCallback);
      oReq.open("POST", scoring_url);
      oReq.setRequestHeader("Accept", "application/json");
      oReq.setRequestHeader("Authorization", token);
      oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      oReq.send(payload);
    }

    apiGet(wml_credentials.get("url"),
      wml_credentials.get("username"),
      wml_credentials.get("password"),
      function (res) {
        let parsedGetResponse;
        try {
          parsedGetResponse = JSON.parse(this.responseText);
        } catch (ex) {
          // TODO: handle parsing exception
        }
        if (parsedGetResponse && parsedGetResponse.token) {
          const token = parsedGetResponse.token
          const wmlToken = "Bearer " + token;

          // NOTE: manually define and pass the array(s) of values to be scored in the next line
          const payload = '{"fields": ["COLUMN2", "COLUMN3", "COLUMN4", "COLUMN5", "COLUMN6", "COLUMN7", "COLUMN8", "COLUMN9", "COLUMN10", "COLUMN11", "COLUMN12", "COLUMN13", "COLUMN14", "COLUMN15", "COLUMN16", "COLUMN17", "COLUMN18", "COLUMN19", "COLUMN20", "COLUMN21", "COLUMN22", "COLUMN23", "COLUMN24", "COLUMN25", "COLUMN26", "COLUMN27", "COLUMN28", "COLUMN29", "COLUMN30", "COLUMN31", "COLUMN32", "COLUMN33", "COLUMN34", "COLUMN35", "COLUMN36", "COLUMN37", "COLUMN38", "COLUMN39", "COLUMN40", "COLUMN41", "COLUMN42", "COLUMN43", "COLUMN44", "COLUMN45", "COLUMN46", "COLUMN47", "COLUMN48", "COLUMN49", "COLUMN50", "COLUMN51", "COLUMN52", "COLUMN53", "COLUMN54", "COLUMN55", "COLUMN56", "COLUMN57", "COLUMN58", "COLUMN59", "COLUMN60", "COLUMN61", "COLUMN62", "COLUMN63", "COLUMN64", "COLUMN65", "COLUMN66", "COLUMN67", "COLUMN68", "COLUMN69", "COLUMN70", "COLUMN71", "COLUMN72", "COLUMN73", "COLUMN74", "COLUMN75", "COLUMN76", "COLUMN77", "COLUMN78", "COLUMN79", "COLUMN80", "COLUMN81", "COLUMN82", "COLUMN83", "COLUMN84", "COLUMN85", "COLUMN86", "COLUMN87", "COLUMN88", "COLUMN89", "COLUMN90", "COLUMN91", "COLUMN92", "COLUMN93", "COLUMN94", "COLUMN95", "COLUMN96", "COLUMN97", "COLUMN98", "COLUMN99", "COLUMN100", "COLUMN101", "COLUMN102", "COLUMN103", "COLUMN104", "COLUMN105", "COLUMN106", "COLUMN107", "COLUMN108", "COLUMN109", "COLUMN110", "COLUMN111", "COLUMN112", "COLUMN113", "COLUMN114", "COLUMN115", "COLUMN116", "COLUMN117", "COLUMN118", "COLUMN119", "COLUMN120", "COLUMN121", "COLUMN122", "COLUMN123", "COLUMN124", "COLUMN125", "COLUMN126", "COLUMN127", "COLUMN128", "COLUMN129", "COLUMN130", "COLUMN131", "COLUMN132", "COLUMN133", "COLUMN134", "COLUMN135", "COLUMN136", "COLUMN137", "COLUMN138", "COLUMN139", "COLUMN140", "COLUMN141", "COLUMN142", "COLUMN143", "COLUMN144", "COLUMN145", "COLUMN146", "COLUMN147", "COLUMN148", "COLUMN149", "COLUMN150", "COLUMN151", "COLUMN152", "COLUMN153", "COLUMN154", "COLUMN155", "COLUMN156", "COLUMN157", "COLUMN158", "COLUMN159", "COLUMN160", "COLUMN161", "COLUMN162", "COLUMN163", "COLUMN164", "COLUMN165", "COLUMN166", "COLUMN167", "COLUMN168", "COLUMN169", "COLUMN170", "COLUMN171", "COLUMN172", "COLUMN173", "COLUMN174", "COLUMN175", "COLUMN176", "COLUMN177", "COLUMN178", "COLUMN179", "COLUMN180", "COLUMN181", "COLUMN182", "COLUMN183", "COLUMN184", "COLUMN185", "COLUMN186", "COLUMN187", "COLUMN188", "COLUMN189", "COLUMN190", "COLUMN191", "COLUMN192", "COLUMN193", "COLUMN194", "COLUMN195", "COLUMN196", "COLUMN197", "COLUMN198", "COLUMN199", "COLUMN200", "COLUMN201", "COLUMN202", "COLUMN203", "COLUMN204", "COLUMN205", "COLUMN206", "COLUMN207", "COLUMN208", "COLUMN209", "COLUMN210", "COLUMN211", "COLUMN212", "COLUMN213", "COLUMN214", "COLUMN215", "COLUMN216", "COLUMN217", "COLUMN218", "COLUMN219", "COLUMN220", "COLUMN221", "COLUMN222", "COLUMN223", "COLUMN224", "COLUMN225", "COLUMN226", "COLUMN227", "COLUMN228", "COLUMN229", "COLUMN230", "COLUMN231", "COLUMN232", "COLUMN233", "COLUMN234", "COLUMN235", "COLUMN236", "COLUMN237", "COLUMN238", "COLUMN239", "COLUMN240", "COLUMN241", "COLUMN242", "COLUMN243", "COLUMN244", "COLUMN245", "COLUMN246", "COLUMN247", "COLUMN248", "COLUMN249", "COLUMN250", "COLUMN251", "COLUMN252", "COLUMN253", "COLUMN254", "COLUMN255", "COLUMN256", "COLUMN257", "COLUMN258", "COLUMN259", "COLUMN260", "COLUMN261", "COLUMN262", "COLUMN263", "COLUMN264", "COLUMN265", "COLUMN266", "COLUMN267", "COLUMN268", "COLUMN269", "COLUMN270", "COLUMN271", "COLUMN272", "COLUMN273", "COLUMN274", "COLUMN275", "COLUMN276", "COLUMN277", "COLUMN278", "COLUMN279", "COLUMN280", "COLUMN281", "COLUMN282", "COLUMN283", "COLUMN284", "COLUMN285", "COLUMN286", "COLUMN287", "COLUMN288", "COLUMN289", "COLUMN290", "COLUMN291", "COLUMN292", "COLUMN293", "COLUMN294", "COLUMN295", "COLUMN296", "COLUMN297", "COLUMN298", "COLUMN299", "COLUMN300", "COLUMN301", "COLUMN302", "COLUMN303", "COLUMN304", "COLUMN305", "COLUMN306", "COLUMN307", "COLUMN308", "COLUMN309", "COLUMN310", "COLUMN311", "COLUMN312", "COLUMN313", "COLUMN314", "COLUMN315", "COLUMN316", "COLUMN317", "COLUMN318", "COLUMN319", "COLUMN320", "COLUMN321", "COLUMN322", "COLUMN323", "COLUMN324", "COLUMN325", "COLUMN326", "COLUMN327", "COLUMN328", "COLUMN329", "COLUMN330", "COLUMN331", "COLUMN332", "COLUMN333", "COLUMN334", "COLUMN335", "COLUMN336", "COLUMN337", "COLUMN338", "COLUMN339", "COLUMN340", "COLUMN341", "COLUMN342", "COLUMN343", "COLUMN344", "COLUMN345", "COLUMN346", "COLUMN347", "COLUMN348", "COLUMN349", "COLUMN350", "COLUMN351", "COLUMN352", "COLUMN353", "COLUMN354", "COLUMN355", "COLUMN356", "COLUMN357", "COLUMN358", "COLUMN359", "COLUMN360", "COLUMN361", "COLUMN362", "COLUMN363", "COLUMN364", "COLUMN365", "COLUMN366", "COLUMN367", "COLUMN368", "COLUMN369", "COLUMN370", "COLUMN371", "COLUMN372", "COLUMN373", "COLUMN374", "COLUMN375", "COLUMN376", "COLUMN377", "COLUMN378", "COLUMN379", "COLUMN380", "COLUMN381", "COLUMN382", "COLUMN383", "COLUMN384", "COLUMN385", "COLUMN386", "COLUMN387", "COLUMN388", "COLUMN389", "COLUMN390", "COLUMN391", "COLUMN392", "COLUMN393", "COLUMN394", "COLUMN395", "COLUMN396", "COLUMN397", "COLUMN398", "COLUMN399", "COLUMN400", "COLUMN401", "COLUMN402", "COLUMN403", "COLUMN404", "COLUMN405", "COLUMN406", "COLUMN407", "COLUMN408", "COLUMN409", "COLUMN410", "COLUMN411", "COLUMN412", "COLUMN413", "COLUMN414", "COLUMN415", "COLUMN416", "COLUMN417", "COLUMN418", "COLUMN419", "COLUMN420", "COLUMN421", "COLUMN422", "COLUMN423", "COLUMN424", "COLUMN425", "COLUMN426", "COLUMN427", "COLUMN428", "COLUMN429", "COLUMN430", "COLUMN431", "COLUMN432", "COLUMN433", "COLUMN434", "COLUMN435", "COLUMN436", "COLUMN437", "COLUMN438", "COLUMN439", "COLUMN440", "COLUMN441", "COLUMN442", "COLUMN443", "COLUMN444", "COLUMN445", "COLUMN446", "COLUMN447", "COLUMN448", "COLUMN449", "COLUMN450", "COLUMN451", "COLUMN452", "COLUMN453", "COLUMN454", "COLUMN455", "COLUMN456"], "values": [array_of_values_to_be_scored, another_array_of_values_to_be_scored]}';
          const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/be84ae42-2de0-4a6d-8e55-53bc175e38bc/deployments/f06f95f5-1a0b-45c7-8af7-7f5f01f73395/online";

          apiPost(scoring_url, wmlToken, payload, function (resp) {
            let parsedPostResponse;
            try {
              parsedPostResponse = JSON.parse(this.responseText);
            } catch (ex) {
              // TODO: handle parsing exception
            }
            console.log("Scoring response");
            console.log(parsedPostResponse);
          }, function (error) {
            console.log(error);
          });
        } else {
          console.log("Failed to retrieve Bearer token");
        }
      }, function (err) {
        console.log(err);
      });
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
        <hr />
        <button id="reach watson" onClick={() => this.reachWatson()}>watson testing</button>
      </div>
    )
  }
}

export default App;
