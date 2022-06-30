const extensions = "https://hahow.in/courses";

const toggleFocus = async () => {
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

  try {
    window.close();
  } catch (error) {}
};

const handleCopy = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.startsWith(extensions)) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: async () => {
      const url = document.querySelector("track")?.src;

      if (!url) {
        alert("沒有字幕檔");
      }
      alert(url);

      // fetch(url)
      //   .then((response) => response.text())
      //   .then((data) => {
      //     const aa = data.split("\n\n").map((item) => item.split("\n")[1]);
      //   })
      //   .catch((err) => {
      //     alert("沒有字幕");
      //     console.log({ err });
      //   });
    },
  });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);

  if (command === "run-copy") {
    handleCopy();
  }
  if (command === "run-toggle") {
    toggleFocus();
  }
});
