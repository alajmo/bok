let sidebar;

window.addEventListener("DOMContentLoaded", (event) => {
  sidebar = Sidebar();
  initSidebarResize();
  window.addEventListener("keydown", shortcutHandler, false);
  initRightTocScrollspy();
  initMenuBorder();
  initKeydownActivation();
});

// Make buttons and links activate on keydown (Enter/Space) instead of waiting for keyup
function initKeydownActivation() {
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Enter" && e.code !== "Space") return;

    const el = document.activeElement;
    if (!el) return;

    const isLink = el.tagName === "A";
    const isButton = el.tagName === "BUTTON";

    if (isLink || isButton) {
      e.preventDefault();
      el.click();
    }
  });
}

function initMenuBorder() {
  const content = document.getElementById("content");
  const menu = document.querySelector(".content .menu");
  if (!content || !menu) return;

  content.addEventListener("scroll", () => {
    if (content.scrollTop > 10) {
      menu.classList.add("scrolled");
    } else {
      menu.classList.remove("scrolled");
    }
  });
}

function scrollToTop() {
  const content = document.getElementById("content");
  if (content) {
    content.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function toggleTheme() {
  console.log('toggleTheme called');
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  console.log('Switching from', currentTheme, 'to', newTheme);
  html.setAttribute('data-theme', newTheme);
  window.localStorage.setItem('theme', newTheme);
}

function toggleFocusMode() {
  const html = document.documentElement;
  const currentMode = html.getAttribute('data-focus-mode');
  const newMode = currentMode === 'true' ? 'false' : 'true';
  html.setAttribute('data-focus-mode', newMode);
  window.sessionStorage.setItem('focusMode', newMode);
}

// let systemInitiatedDark = window.matchMedia('(prefers-color-scheme: dark)');
// let theme = sessionStorage.getItem('theme');
// systemInitiatedDark.addListener(prefersColorTest);

// if (theme === 'dark') {
//   document.documentElement.setAttribute('data-theme', 'dark');
//   sessionStorage.setItem('theme', 'dark');
// } else if (theme === 'light') {
//   document.documentElement.setAttribute('data-theme', 'light');
//   sessionStorage.setItem('theme', 'light');
// }

// function themeModeSwitcher() {
//   let theme = sessionStorage.getItem('theme');

//   if (theme === 'dark') {
//     document.documentElement.setAttribute('data-theme', 'light');
//     sessionStorage.setItem('theme', 'light');
//   } else if (theme === 'light') {
//     document.documentElement.setAttribute('data-theme', 'dark');
//     sessionStorage.setItem('theme', 'dark');
//   } else if (systemInitiatedDark.matches) {
//     document.documentElement.setAttribute('data-theme', 'light');
//     sessionStorage.setItem('theme', 'light');
//   } else {
//     document.documentElement.setAttribute('data-theme', 'dark');
//     sessionStorage.setItem('theme', 'dark');
//   }
// }

// function prefersColorTest(systemInitiatedDark) {
//   if (systemInitiatedDark.matches) {
//     document.documentElement.setAttribute('data-theme', 'dark');
//     sessionStorage.setItem('theme', '');
//   } else {
//     document.documentElement.setAttribute('data-theme', 'light');
//     sessionStorage.setItem('theme', '');
//   }
// }

function Sidebar() {
  const html = document.querySelector("html");
  const contentElement = document.getElementById("content");

  // if (showSidebar === 'true') {
  //   show();
  // } else {
  //   hide();
  // }

  function toggle() {
    const showSidebar = html.getAttribute("data-show-sidebar");

    // Sidebar is visible by default (CSS only hides when explicitly "false")
    if (showSidebar === "false") {
      show();
    } else {
      hide();
    }
  }

  function show() {
    window.sessionStorage.setItem("showSidebar", "true");
    html.setAttribute("data-show-sidebar", "true");
    // contentElement.style.left = '300px';

    // sidebarElement.setAttribute('data-show', 'true');
    // sidebarElement.style.display = 'block';
  }

  function hide() {
    window.sessionStorage.setItem("showSidebar", "false");
    html.setAttribute("data-show-sidebar", "false");
    // contentElement.style.left = 0;

    // sidebarElement.setAttribute('data-show', 'false');
    // sidebarElement.style.display = 'none';
  }

  return Object.freeze({
    toggle,
  });
}

function initSidebarResize() {
  const sidebar = document.getElementById("sidebar");
  const handle = document.querySelector(".sidebar-resize-handle");
  if (!sidebar || !handle) return;

  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;

  // Restore saved width
  const savedWidth = localStorage.getItem("sidebarWidth");
  if (savedWidth) {
    const width = parseInt(savedWidth, 10);
    if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
      sidebar.style.minWidth = width + "px";
      sidebar.style.width = width + "px";
    }
  }

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;

    handle.classList.add("dragging");
    document.body.classList.add("sidebar-resizing");

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const delta = e.clientX - startX;
    let newWidth = startWidth + delta;

    // Clamp to min/max
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));

    sidebar.style.minWidth = newWidth + "px";
    sidebar.style.width = newWidth + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    handle.classList.remove("dragging");
    document.body.classList.remove("sidebar-resizing");

    // Save the width
    localStorage.setItem("sidebarWidth", sidebar.offsetWidth.toString());
  });

  // Double-click to reset to default
  handle.addEventListener("dblclick", () => {
    sidebar.style.minWidth = "";
    sidebar.style.width = "";
    localStorage.removeItem("sidebarWidth");
  });
}

function shortcutHandler(e) {
  // Ignore shortcuts when typing in input fields
  const activeElement = document.activeElement;
  const isTyping = activeElement && (
    activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.isContentEditable
  );
  if (isTyping) return;

  if (e.code === "KeyT") {
    sidebar.toggle();
  } else if (e.code === "KeyS") {
  } else if (e.code === "ArrowLeft") {
    previousChapter();
  } else if (e.code === "ArrowRight") {
    nextChapter();
  }
}

function previousChapter() {
  const prevButton = document.getElementById("page-nav-prev");
  if (prevButton) {
    window.location.href = prevButton.href;
  }
}

function nextChapter() {
  const nextButton = document.getElementById("page-nav-next");
  if (nextButton) {
    window.location.href = nextButton.href;
  }
}

function initRightTocScrollspy() {
  const rightToc = document.querySelector(".right-toc");
  if (!rightToc) return;

  const tocLinks = rightToc.querySelectorAll("a[href^='#']");
  if (tocLinks.length === 0) return;

  const headingIds = Array.from(tocLinks).map((link) =>
    link.getAttribute("href").slice(1)
  );
  const headings = headingIds
    .map((id) => document.getElementById(id))
    .filter((el) => el !== null);

  if (headings.length === 0) return;

  let activeLink = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const link = rightToc.querySelector(`a[href="#${id}"]`);
          if (link && link !== activeLink) {
            if (activeLink) {
              activeLink.classList.remove("active");
            }
            link.classList.add("active");
            activeLink = link;
          }
        }
      });
    },
    {
      rootMargin: "-80px 0px -80% 0px",
      threshold: 0,
    }
  );

  headings.forEach((heading) => observer.observe(heading));

  // Handle click on TOC links for smooth scroll
  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}
