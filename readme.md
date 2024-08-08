# local setup:
1. clone this repo to any folder and remember it's location.
2. go to chrome->extensions->manage extensions.
3. switch on the developers settings if not turned on already.
4. you will see a load unpacked option on the left, click on it(it will be named sound_extension).
5. select the repo which you cloned.
6. go back from the settings and pin the extension added(current icon=insta hehe :3)

# FOR DEVELOPERS:
6. click on the background_page for the console logs.
7. Using manifest v2 currently so ignore errors.
8. there are two js files, popup.js runs only when you click the extension icon and the background.js runs all the time.
9. background_page shows logs of background.js and when you click the extension inspect it to open the logs of popup.js.

<img src="dark.png" width=350 height=300>
<img src="light.png" width=350 height=300>
<!-- ctrl shift v for readme preview on vscode -->

# Volume Manager Chrome Extension

## Overview

**Volume Manager** is a Chrome extension that allows users to control the audio volume of individual tabs. Whether you're listening to music, watching videos, or participating in a webinar, this extension gives you the ability to fine-tune the sound levels across different tabs without affecting the system's master volume.

## Features

- **Tab-Specific Volume Control**: Adjust the volume for each tab independently.
- **Persistent Volume Levels**: The extension remembers volume settings for each tab, even after the browser is closed and reopened.
- **Visual Feedback**: Displays the current volume percentage for quick reference.
- **Simple and Intuitive UI**: Easy-to-use popup interface for adjusting volumes and muting tabs.
- **Compatibility with All Sites**: Works on youtube very well, regardless of whether they contain audio or video elements, working on more features currently.
- **Light and Dark mode**: Who likes light mode anyways, use dark mode to suit your taste.
- **Clean UI/UX**


## Installation

1. **Clone or download the repository**:

   ```bash
   git clone https://github.com/deecod-dev/sound4all


2. **Follow the local setup steps as mentioned above**:

3. **WORKS ON ALL WEBSITES**