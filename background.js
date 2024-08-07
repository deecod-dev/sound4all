// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("mess recv");
  let ops = {
    "idk-man": (msg) => {
      if (msg.tabId in tabs) {
        console.log("Volume for tabId:", tabs[msg.tabId].gainNode.gain.value);
        sendResponse(tabs[msg.tabId].gainNode.gain.value);
      } else {
        sendResponse(null); // Handle the case where tabId is not found
      }
    },
    "get-tab-volume": (msg) => {
      res(getTabVolume(msg.tabId));
      console.log("vol got: ", getTabVolume(msg.tabId));
    },
    "set-tab-volume": (msg) => {
      console.log("in set vol");
      if (msg.mute) {
        console.log("inmute");
        // If you want to mute
        tabs[msg.tabId].mute = true;
        setTabVolume(msg.tabId, 0);
        res(true);
      } else {
        console.log("other case");
        // Else set new volume
        setTabVolume(msg.tabId, msg.newVol);
        res(false);
      }
    },
    "toggle-mute": async (msg) => {
      console.log("in toggle mute");
      if (msg.tabId in tabs) {
        if (tabs[msg.tabId].mute) {
          tabs[msg.tabId].mute = false;
          await setTabVolume(msg.tabId, tabs[msg.tabId].previousVolume || 1);
        } else {
          tabs[msg.tabId].previousVolume = tabs[msg.tabId].gainNode.gain.value;
          tabs[msg.tabId].mute = true;
          await setTabVolume(msg.tabId, 0);
        }
        sendResponse({
          muted: tabs[msg.tabId].mute,
          volume: tabs[msg.tabId].gainNode.gain.value,
        });
      } else {
        sendResponse(new Error("[ERR] tab not found"));
      }
    },
    undefined(msg) {
      return res(new Error("[ERR] function not implemented"));
    },
  };

  console.log("msg: ", message);
  if (ops[message.name]) {
    ops[message.name](message);
  } else {
    sendResponse(new Error("[ERR] function not implemented"));
  }

  return true; // Indicates that the response is sent asynchronously
});

// Clean everything up once the tab is closed
chrome.tabs.onRemoved.addListener(disposeTab);

let tabs = {};

/**
 * Captures a tab's sound, allowing it to be programmatically modified.
 * We only need to call this function if the tab isn't yet in that object.
 * @param tabId Tab ID
 */
function captureTab(tabId) {
  return new Promise((resolve, reject) => {
    let f=localStorage.getItem("modeflag")
    // console.log(f,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    if(f===null){
      localStorage.setItem("modeflag",0)
    }
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const audioContext = new AudioContext();
      const streamSource = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();

      streamSource.connect(gainNode);
      gainNode.connect(audioContext.destination);

      tabs[tabId] = {
        audioContext,
        streamSource,
        gainNode,
        mute: false,
        previousVolume: 1,
      };
      resolve();
    });
  });
}

/**
 * Returns a tab's volume, `1` if the tab isn't captured yet.
 * @param tabId Tab ID
 */
function getTabVolume(tabId) {
  console.log("///get vol works");
  return tabId in tabs ? tabs[tabId].gainNode.gain.value : 0;
}

let tabval = {};

/**
 * Sets a tab's volume. Captures the tab if it wasn't captured.
 * @param tabId Tab ID
 * @param vol Volume. `1` means 100%, `0.5` is 50%, etc
 */
async function setTabVolume(tabId, vol) {
  console.log("in settabvol");

  if (!(tabId in tabs)) {
    await captureTab(tabId);
  }

  console.log("in settabvol2", vol);

  if (vol >= 0 && vol <= 7 && tabId in tabs) {
    tabs[tabId].gainNode.gain.value = vol;
  }

  console.log("this", tabs[tabId]);

  updateBadge(tabId, vol);
  tabval[tabId] = vol;
}

/**
 * Updates the badge which represents current volume.
 * @param tabId Tab ID
 * @param volume Volume. `1` will display 100, `0.5` - 50, etc
 */
function updateBadge(tabId, vol) {
  if (tabId in tabs) {
    const text = String(Math.round(vol * 100)); // I love rounding errors!
    chrome.browserAction.setBadgeText({ text, tabId });
  }
}

/**
 * Removes the tab from `tabs` object and closes its AudioContext.
 * This function gets called when a tab is closed.
 * @param tabId Tab ID
 */
function disposeTab(tabId) {
  if (tabId in tabs) {
    tabs[tabId].audioContext.close();
    delete tabs[tabId];
  }
}
