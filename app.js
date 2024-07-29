const registerBtn = document.getElementById("sw-register");
const unregisterBtn = document.getElementById("sw-unregister");
const loadUsersBtn = document.getElementById("load-users");
let swInstance;
const form = document.querySelector("form");
const input = document.querySelector('input[type="number"]');
const result = document.querySelector("p#result");
const worker = new Worker("fibonacci.js");

worker.onmessage = function (event) {
  result.textContent = event.data;
  console.log("Got: " + event.data + "\n");
};

worker.onerror = function (error) {
  console.log(`Worker error: ${error.message} \n`);
  throw error;
};

form.onsubmit = function (event) {
  event.preventDefault();
  worker.postMessage(input.value);
  input.value = "";
};

const renderUsers = async () => {
  try {
    const { users } = await (await fetch("https://dummyjson.com/users")).json();
    if (users.length) {
      const count = document.createElement("p");
      count.textContent = `Users Count ${users.length}`;
      document.body.appendChild(count);
    }
  } catch (e) {
    console.log(`Error while loading users ${e}`);
  }
};

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      swInstance = await navigator.serviceWorker.register("sw.js");
      console.log(`sw is registered, entry path ${swInstance.scope}`);
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
const setServiceWorkerInstace = () => {
  navigator.serviceWorker.ready.then(function (sw) {
    if (sw.active) {
      swInstance = sw;
    }
  });
};
const unregisterServiceWorker = async () => {
  try {
    const isUnregisted = await swInstance.unregister();
    console.log(`sw is unregistered: ${isUnregisted}`);
  } catch (error) {
    console.error(`Unregistered failed with ${error}`);
  }
};

window.onload = () => {
  setServiceWorkerInstace();
};

registerBtn.addEventListener("click", registerServiceWorker);
unregisterBtn.addEventListener("click", unregisterServiceWorker);
loadUsersBtn.addEventListener("click", renderUsers);

