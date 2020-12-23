let sidebar;

window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed');

  sidebar = Sidebar();
  window.addEventListener('keydown', shortcutHandler, false);
});

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
  const html = document.querySelector('html');
  const contentElement = document.getElementById('content');

  // if (showSidebar === 'true') {
  //   show();
  // } else {
  //   hide();
  // }

  function toggle() {
    const showSidebar = html.getAttribute('data-show-sidebar');
    console.log(showSidebar);
    console.log(contentElement);

    if (showSidebar === 'true') {
      hide();
    } else {
      show();
    }
  }

  function show() {
    window.sessionStorage.setItem('showSidebar', 'true');
    html.setAttribute('data-show-sidebar', 'true');
    // contentElement.style.left = '300px';

    // sidebarElement.setAttribute('data-show', 'true');
    // sidebarElement.style.display = 'block';
  }

  function hide() {
    window.sessionStorage.setItem('showSidebar', 'false');
    html.setAttribute('data-show-sidebar', 'false');
    // contentElement.style.left = 0;

    // sidebarElement.setAttribute('data-show', 'false');
    // sidebarElement.style.display = 'none';
  }

  return Object.freeze({
    toggle,
  });
}

function shortcutHandler(e) {
  if (e.code === 'KeyT') {
    sidebar.toggle();
  } else if (e.code === 'KeyS') {
  } else if (e.code === 'ArrowLeft') {
    previousChapter();
  } else if (e.code === 'ArrowRight') {
    nextChapter();
  }
}

function previousChapter() {
  const prevButton = document.getElementById('page-nav-prev');
  if (prevButton) {
    window.location.href = prevButton.href;
  }
}

function nextChapter() {
  const nextButton = document.getElementById('page-nav-next');
  if (nextButton) {
    window.location.href = nextButton.href;
  }
}
