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
  const url = document.querySelector("track")?.src;

  const copy = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  if (!url) {
    alert("沒有字幕");
  }
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const aa = data.split("\n\n").map((item) => item.split("\n")[1]);
      copy(aa);
      alert("複製成功！");
    })
    .catch((err) => {
      console.log({ err });
      alert("沒有字幕");
    });
  // const container = document.getElementById("hh-transcript-vtt-container");

  // if (container) {
  //   let res = "";
  //   const li = container.querySelectorAll("li");
  //   li.forEach((ele) => {
  //     res += `${ele.textContent}\n`;
  //   });
  //   copy(res);
  //   console.log(res);
  //   alert('複製成功！')
  // } else {
  //   alert('沒有字幕')
  // }
};
