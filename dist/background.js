chrome.runtime.onMessage.addListener((async function(t){const[i]=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});if("position"===t.action){const{startX:e,startY:n,width:o,height:s}=t.info,a={tab:i,startX:e,startY:n,width:o,height:s};chrome.runtime.sendMessage({action:"getqr",info:{positionInfo:a}})}}));