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

document.querySelectorAll("[data-progress-card]").forEach((card) => {
  const group = card.dataset.progressCard;
  const taskChecks = [...document.querySelectorAll(`[data-task-group="${group}"]`)];
  const progressNumber = card.querySelector("[data-progress-number]");
  const progressBar = card.querySelector("[data-progress-bar]");
  const progressTrack = card.querySelector("[data-progress-track]");

  function updateProgress() {
    const finished = taskChecks.filter((check) => check.checked).length;
    const percentage = taskChecks.length ? Math.round((finished / taskChecks.length) * 100) : 0;
    progressNumber.textContent = percentage + "%";
    progressBar.style.width = percentage + "%";
    progressTrack.setAttribute("aria-valuenow", String(percentage));
    taskChecks.forEach((check) => check.closest("label").classList.toggle("complete", check.checked));
  }

  taskChecks.forEach((check) => check.addEventListener("change", updateProgress));
  updateProgress();
});

const topicOptions = {
  Spanish: ["ser and estar", "daily routine", "describing people", "school vocabulary", "My own topic…"],
  English: ["poetic techniques", "persuasive language", "character and theme", "paragraph writing", "My own topic…"],
  History: ["the causes of World War I", "Irish independence", "the Industrial Revolution", "the Cold War", "My own topic…"],
  Science: ["photosynthesis", "cells", "forces and energy", "genetics", "My own topic…"],
  Maths: ["linear equations", "percentages", "Pythagoras' theorem", "probability", "My own topic…"],
  Other: ["My own topic…"]
};

const subjectSelect = document.getElementById("quest-subject");
const topicSelect = document.getElementById("quest-topic");
const customTopicWrap = document.getElementById("custom-topic-wrap");
const customTopicInput = document.getElementById("quest-custom-topic");
const questPrompt = document.getElementById("quest-prompt");
const copyQuestButton = document.getElementById("copy-quest");

function updateTopicOptions() {
  if (!subjectSelect || !topicSelect) return;
  topicSelect.innerHTML = "";
  topicOptions[subjectSelect.value].forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });
  updateCustomTopicVisibility();
}

function updateCustomTopicVisibility() {
  if (!topicSelect || !customTopicWrap) return;
  const needsCustomTopic = topicSelect.value === "My own topic…";
  customTopicWrap.hidden = !needsCustomTopic;
  if (needsCustomTopic) customTopicInput.focus();
}

subjectSelect?.addEventListener("change", updateTopicOptions);
topicSelect?.addEventListener("change", updateCustomTopicVisibility);
updateTopicOptions();

document.getElementById("build-quest")?.addEventListener("click", () => {
  const selectedTopic = topicSelect.value === "My own topic…" ? customTopicInput.value.trim() : topicSelect.value;
  if (!selectedTopic) {
    customTopicInput.focus();
    showToast("Add your school topic first");
    return;
  }

  const subject = subjectSelect.value === "Other" ? "a school subject" : subjectSelect.value;
  const character = document.getElementById("quest-character").value;
  const world = document.getElementById("quest-world").value;
  const difficulty = document.getElementById("quest-difficulty").value;

  questPrompt.textContent = `You are the game master of a short educational text RPG called The Knowledge Quest.

I am a 15-year-old student. The topic I need to learn is ${selectedTopic} from ${subject}. My character is ${character} exploring ${world}. The starting difficulty is ${difficulty}.

Create an adventure containing exactly four short scenes. In each scene, I must overcome a challenge by answering a question about the topic.

Rules:
• Present only one scene and one question at a time.
• Keep each scene under 100 words.
• Wait for my answer before continuing.
• Gradually increase or decrease the difficulty depending on my answers.
• Give me three health points.
• If I answer incorrectly, remove one health point, give me a useful hint and let me try again.
• Do not reveal the correct answer immediately.
• Make my answers affect what happens in the story.
• Keep the story suitable for school.

After the final scene, give me a Hero's Learning Report showing:
1. what I understood well;
2. what I found difficult;
3. one thing I should revise;
4. my final health and score.

First, introduce yourself as the game master and ask me to confirm my character, world and topic. Do not begin the adventure until I reply.`;
  copyQuestButton.disabled = false;
  showToast("Your Knowledge Quest is ready");
});

document.getElementById("present-button").addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  else await document.exitFullscreen?.();
});

const requestedPage = location.hash.replace("#", "");
const initialPage = requestedPage === "session" ? "session1" : requestedPage;
if (["home", "session1", "session2", "session3", "portfolio"].includes(initialPage)) showPage(initialPage);
else showPage("home");
