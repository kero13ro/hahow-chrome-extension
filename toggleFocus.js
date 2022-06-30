const extensions = "https://hahow.in/courses";

const aa = async () => {
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

  if (window) window.close();
}

export default aa;