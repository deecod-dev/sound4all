let slider = document.getElementById("slider");
let mutebtn = document.getElementById("no-sound");
let voltext = document.getElementById("cvol");
let toggleModeBtn = document.getElementById("toggle-mode");
let dnt = document.getElementById("daynight");

let isMuted = false;
let tabId = null;
let lastvol = -69;


const setvol = (vol) => {
  voltext.innerText = vol !== null ? `${Math.round(vol * 100)}%` : "--";
};

window.onload = function () {
  let f = localStorage.getItem("modeflag")
  console.log(f,"bbbbbbbbbbbbbbbbbbbbbbbbbbbb")
  if(f==1){
    document.body.classList.toggle("dark-mode");
    // if(dnt.checked)
    // console.log(dnt.checked,"kkkkkkkkkkkkkkkkkkkkk")
    dnt.checked=true;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      let tab = tabs[0];
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
      let tab = tabs[0];
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
      let tab = tabs[0];
      tabId = tab.id;

      chrome.runtime.sendMessage({ name: "toggle-mute", tabId }, (response) => {
        if (response && response.muted !== undefined) {
          setMuted(response.muted);
          if (response.muted) {
            lastvol = parseFloat(slider.value);
            slider.value = 0;
            setvol(0);
          } else {
            slider.value = lastvol;
            setvol(lastvol);
          }
        }
      });
    }
  });
});

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  let f = localStorage.getItem("modeflag");
  localStorage.setItem("modeflag",f^1);
  // console.log(dnt.checked,"kkkkkkkkkkkkkkkkkkk")
  // console.log(f,"ddddddddddddddd")
});
