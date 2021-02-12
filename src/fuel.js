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

// handler to read calculate outputs
const changeHandler = (name, value) => {
  inputs[name] = parseFloat(value);
  calcFuelRequired();
  updateOutputs();
};

window.addEventListener("load", () => {
  inputNames.forEach((inputName) => {
    // initially, set input var as the element's default value
    const inputElement = document.getElementById(inputName);
    inputs[inputName] = parseFloat(inputElement.value, 10);

    // immediately update on any type of input change
    const events = ["change", "keyup"];
    events.forEach((event) => {
      inputElement.addEventListener(event, (e) => {
        changeHandler(inputName, e.target.value);
      });
    });

    // select all input value when user clicks inside
    inputElement.addEventListener("focus", (e) => {
      e.target.select();
    });
  });

  // load inputs from stored values, if they exist
  localStorage = window.localStorage;
  const savedInputsJSON = localStorage?.fuel;

  try {
    const savedInputs = JSON.parse(savedInputsJSON);
    // console.log("localStorage", savedInputs);

    // if any values are null or undefined, reset the localStorage saved values
    if (
      Object.values(savedInputs).filter(
        (val) => val === null || val === undefined
      ).length
    ) {
      // save current input values to local storage, these should be valid
      localStorage.fuel = JSON.stringify(inputs);
    }

    // update inputs with the saved values
    Object.keys(savedInputs).forEach((inputName) => {
      const inputElement = document.getElementById(inputName);
      if (inputElement) {
        // console.log(inputElement, savedInputs[inputName]);
        inputElement.value = savedInputs[inputName].toString();
        inputs[inputName] = savedInputs[inputName];
      }
    });
  } catch (err) {
    // no data saved, or saved data is invalid - reset it
    console.log("Resetting local storage values");
    console.log(err);
    localStorage.fuel = JSON.stringify(inputs);
  }

  // perform calculation on first load
  calcFuelRequired();
  updateOutputs();

  // handle clicking of save button
  const saveElement = document.getElementById("save");
  saveElement.addEventListener("click", () => {
    // save all input values to local storage
    localStorage.fuel = JSON.stringify(inputs);
  });
});
