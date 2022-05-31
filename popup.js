let copySub = document.getElementById("copySub");
let focusBtn = document.getElementById("focus");

const extensions = "https://hahow.in/courses";

focusBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.startsWith(extensions)) {
    return;
  }

  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    await chrome.scripting.insertCSS({
      files: ["focus-mode.css"],
      target: { tabId: tab.id },
    });
  } else if (nextState === "OFF") {
    await chrome.scripting.removeCSS({
      files: ["focus-mode.css"],
      target: { tabId: tab.id },
    });
  }

  window.close();
});

copySub.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.startsWith(extensions)) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: handleCopy,
  });

  window.close();
});

const handleCopy = () => {
  const container = document.getElementById("hh-transcript-vtt-container");

  const copy = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  if (container) {
    let res = "";
    const li = container.querySelectorAll("li");
    li.forEach((ele) => {
      res += `${ele.textContent}\n`;
    });
    copy(res);
    console.log(res);
  }
};
