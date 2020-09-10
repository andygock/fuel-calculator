const inputs = {};
const outputs = { fuelRequired: 0 };

const inputNames = ["lapTime", "fuelRate", "raceTime"];

inputNames.forEach((inputName) => {
  const inputElement = document.getElementById(inputName);
  inputs[inputName] = parseFloat(inputElement.value, 10);

  // immediately update on change
  inputElement.addEventListener("change", (e) => {
    inputs[inputName] = parseFloat(e.target.value);
    calcFuelRequired();
    updateOutputs();
  });

  // select all input value when user clicks inside
  inputElement.addEventListener("focus", (e) => {
    e.target.select();
  });
});

const calcFuelRequired = () => {
  const { lapTime, fuelRate, raceTime } = inputs;
  if (isNaN(lapTime) || isNaN(fuelRate) || isNaN(raceTime)) {
    outputs.fuelRequired = "ERR";
    return;
  }

  // calculate fuel required
  const laps = (raceTime * 60) / lapTime;
  const fuelRequired = laps * fuelRate;
  outputs.fuelRequired = fuelRequired;
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

  // calculate laptime in MM:SS
  const { lapTime } = inputs; // user input lap time in seconds
  const minutes = Math.floor(parseFloat(lapTime) / 60);
  const seconds = lapTime - minutes * 60;
  const formattedTime = minutes + ":" + seconds.toFixed(0).padStart(2,'0');
  document.getElementById("lapTimeFormatted").innerHTML = formattedTime;
};

window.addEventListener("load", () => {
  // perform calculation on first load
  calcFuelRequired();
  updateOutputs();
});
