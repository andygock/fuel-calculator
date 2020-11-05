const inputs = {};
const outputs = { fuelRequired: 0, lapCount: 0, formattedTime: "0:00" };

const inputNames = ["lapTime", "fuelRate", "raceTime"];

const calcFuelRequired = () => {
  const { lapTime, fuelRate, raceTime } = inputs;
  if (isNaN(lapTime) || isNaN(fuelRate) || isNaN(raceTime)) {
    outputs.fuelRequired = "ERR";
    return;
  }

  // calculate fuel required
  outputs.lapCount = (raceTime * 60) / lapTime;
  const fuelRequired = outputs.lapCount * fuelRate;
  outputs.fuelRequired = fuelRequired;

  // calculate laptime in MM:SS
  const minutes = Math.floor(parseFloat(lapTime) / 60);
  const seconds = lapTime - minutes * 60;
  outputs.formattedTime = minutes + ":" + seconds.toFixed(0).padStart(2, "0");
};

const updateOutputs = () => {
  const result = document.getElementById("fuelRequired");
  if (!isNaN(outputs.fuelRequired)) {
    // round to 1 decimal point
    result.innerText = outputs.fuelRequired.toFixed(1);
    result.classList.remove("error");
  } else {
    // probably an error occured, fuelRequired is likely a string "ERR"
    result.innerText = outputs.fuelRequired;
    result.classList.add("error");
  }

  // update other output params
  [...document.getElementsByClassName("lapTimeFormatted")].forEach((el) => {
    el.innerText = outputs.formattedTime;
  });
  document.getElementById("lapCount").innerText = outputs.lapCount.toFixed(1);
};

window.addEventListener("load", () => {
  inputNames.forEach((inputName) => {
    const inputElement = document.getElementById(inputName);
    inputs[inputName] = parseFloat(inputElement.value, 10);

    // handler to read calculate outputs
    const changeHandler = (e) => {
      inputs[inputName] = parseFloat(e.target.value);
      calcFuelRequired();
      updateOutputs();
    };

    // immediately update on any type of input change
    const events = ["change", "keyup"];
    events.forEach((event) => {
      inputElement.addEventListener(event, (e) => {
        changeHandler(e);
      });
    });

    // select all input value when user clicks inside
    inputElement.addEventListener("focus", (e) => {
      e.target.select();
    });
  });

  // add event listeners for presets
  const presets = [...document.getElementsByClassName("preset")];
  presets.forEach((preset) => {
    preset.addEventListener("click", (e) => {
      // user clicks preset button
      alert("Presets yet implemented yet");
      return;
      const presetName = preset.innerText;
      console.log("Preset " + presetName);
    });
  });

  // perform calculation on first load
  calcFuelRequired();
  updateOutputs();
});
