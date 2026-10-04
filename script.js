const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const siteHeader = document.querySelector(".site-header");
const estimateForm = document.querySelector("[data-estimate-form]");
const formStatus = document.querySelector("#form-status");
const mobileNav = window.matchMedia("(max-width: 760px)");

function syncNavigation() {
  const isMobile = mobileNav.matches;

  if (!menuButton || !primaryNav) {
    return;
  }

  if (isMobile) {
    primaryNav.hidden = menuButton.getAttribute("aria-expanded") !== "true";
  } else {
    primaryNav.hidden = false;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }
}

menuButton?.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.hidden = isExpanded;
});

primaryNav?.addEventListener("click", (event) => {
  if (event.target.closest("a") && mobileNav.matches) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    primaryNav.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav.matches && menuButton?.getAttribute("aria-expanded") === "true") {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    primaryNav.hidden = true;
    menuButton.focus();
  }
});

mobileNav.addEventListener("change", syncNavigation);
syncNavigation();

function updateHeaderShadow() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", updateHeaderShadow, { passive: true });
updateHeaderShadow();

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const requestedService = new URLSearchParams(window.location.search).get("service");
const serviceSelect = estimateForm?.elements.namedItem("service");
if (requestedService && serviceSelect instanceof HTMLSelectElement) {
  const matchingOption = [...serviceSelect.options].find((option) => option.value === requestedService || option.textContent.trim() === requestedService);
  if (matchingOption) {
    serviceSelect.value = matchingOption.value;
  }
}

estimateForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const details = new FormData(estimateForm);
  const subject = `Free estimate request from ${details.get("name")}`;
  const body = [
    `Name: ${details.get("name")}`,
    `Email: ${details.get("email")}`,
    `Phone: ${details.get("phone") || "Not provided"}`,
    `Property type: ${details.get("property") || "Not provided"}`,
    `Service: ${details.get("service") || "Not selected"}`,
    "",
    "Project details:",
    details.get("message") || "No additional details provided."
  ].join("\n");

  if (formStatus) {
    formStatus.textContent = "Your email app should open with your request. Review it and choose Send; if it doesn't open, email alex@southernlandscapingserv.com.";
  }
  window.location.href = `mailto:alex@southernlandscapingserv.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
