const methodSelect = document.getElementById("method");
const payload = document.getElementById("payload");
const payloadLabel = document.getElementById("payloadLabel");
const repeatToggle = document.getElementById("repeatToggle");
const repeatCount = document.getElementById("repeatCount");
const loader = document.getElementById("loader");
const toast = document.getElementById("toast");
const historyList = document.getElementById("historyList");

methodSelect.addEventListener("change", () => {
  const isPost = methodSelect.value === "POST";
  payload.style.display = isPost ? "block" : "none";
  payloadLabel.style.display = isPost ? "block" : "none";
});

repeatToggle.addEventListener("change", () => {
  const show = repeatToggle.checked;
  repeatCount.classList.toggle("hidden", !show);
  repeatCount.disabled = !show;
});

function showToast(msg, duration = 2000) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, duration);
}

async function sendRequest() {
  const url = document.getElementById("url").value;
  const method = methodSelect.value;
  const data = payload.value;
  const repeat = repeatToggle.checked ? parseInt(repeatCount.value || 1) : 1;
  const responseArea = document.getElementById("response");
  responseArea.textContent = "";

  if (!url) {
    showToast("Please enter a URL");
    return;
  }

  loader.style.display = "block";

  for (let i = 0; i < repeat; i++) {
    try {
      const options = {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      };

      if (method === "POST" && data) {
        options.body = data;
      }

      const res = await fetch(url, options);
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        responseArea.textContent += JSON.stringify(json, null, 2) + "\n\n";
      } catch {
        responseArea.textContent += text + "\n\n";
      }
    } catch (err) {
      responseArea.textContent += `Error (${i + 1}): ${err.message}\n`;
    }
  }

  loader.style.display = "none";
  showToast("Request Completed");

  // Add to history
  const li = document.createElement("li");
  li.textContent = url;
  historyList.prepend(li);
}

methodSelect.dispatchEvent(new Event('change'));
