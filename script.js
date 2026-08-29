const pages = document.querySelectorAll(".page");
const pageButtons = document.querySelectorAll("[data-page-link]");
const tabButtons = document.querySelectorAll(".tab-button");
const toast = document.getElementById("toast");

function showPage(pageId) {
  pages.forEach((page) => {
    const selected = page.id === pageId;
    page.hidden = !selected;
    page.classList.toggle("active", selected);
  });
  tabButtons.forEach((button) => {
    const selected = button.dataset.pageLink === pageId;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  history.replaceState(null, "", "#" + pageId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

pageButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(button.dataset.pageLink);
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    await navigator.clipboard.writeText(target.innerText.trim());
    showToast("Copied to clipboard");
  });
});

const taskChecks = [...document.querySelectorAll(".task-check")];
const progressNumber = document.getElementById("progress-number");
const progressBar = document.getElementById("progress-bar");
const progressTrack = document.querySelector(".progress-track");

function updateProgress() {
  const finished = taskChecks.filter((check) => check.checked).length;
  const percentage = Math.round((finished / taskChecks.length) * 100);
  progressNumber.textContent = percentage + "%";
  progressBar.style.width = percentage + "%";
  progressTrack.setAttribute("aria-valuenow", String(percentage));
  taskChecks.forEach((check) => check.closest("label").classList.toggle("complete", check.checked));
}

taskChecks.forEach((check) => check.addEventListener("change", updateProgress));

document.getElementById("present-button").addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  else await document.exitFullscreen?.();
});

const initialPage = location.hash.replace("#", "");
if (["home", "session", "portfolio"].includes(initialPage)) showPage(initialPage);
else showPage("home");
