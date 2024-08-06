let slider = document.getElementById("slider");
let mutebtn = document.getElementById("no-sound");
let voltext = document.getElementById("cvol");

let isMuted = false;
let tabId = null;
let lastvol = -69;

const setvol = (vol) => {
  voltext.innerText = vol !== null ? `${Math.round(vol * 100)}%` : "--";
};

window.onload = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      tab = tabs[0];
      tabId = tab.id;
      chrome.runtime.sendMessage(
        { name: "idk-man", tabId, mute: false },
        (vol) => {
          if (vol != undefined) {
            slider.value = vol;
            setvol(vol);
          }
        }
      );
    }
  });
};

const setMuted = (muted) => {
  isMuted = muted;
};

slider.addEventListener("change", (el) => {
  let newVol = parseFloat(window.event.target.value);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      tab = tabs[0];
      tabId = tab.id;

      voltext.innerText = `${Math.round(newVol * 100)}%`;
      chrome.runtime.sendMessage(
        { name: "set-tab-volume", tabId, newVol, mute: false },
        (muted) => {
          setMuted(muted);
        }
      );
    }
  });
});

mutebtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      tab = tabs[0];
      tabId = tab.id;

      chrome.runtime.sendMessage({ name: "toggle-mute", tabId }, (response) => {
        if (response && response.muted !== undefined) {
          setMuted(response.muted);
          if (response.muted) {
            lastvol = parseFloat(slider.value);
            slider.value = 0;
            setvol(0);
          } else {
            slider.value = response.volume;
            setvol(response.volume);
          }
        }
      });
    }
  });
});
