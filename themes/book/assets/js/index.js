let sidebar
let search

window.addEventListener('DOMContentLoaded', (event) => {
  sidebar = Sidebar()
  search = Search()
  initSidebarResize()
  window.addEventListener('keydown', shortcutHandler, false)
  initRightTocScrollspy()
  initMenuBorder()
  initKeydownActivation()
  initSidebarScrollPreserve()

  // Focus content so arrow keys work for scrolling
  const content = document.getElementById('content')
  if (content) content.focus()
})

// Make buttons and links activate on keydown (Enter/Space) instead of waiting for keyup
function initKeydownActivation() {
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Enter' && e.code !== 'Space') return

    const el = document.activeElement
    if (!el) return

    const isLink = el.tagName === 'A'
    const isButton = el.tagName === 'BUTTON'

    if (isLink || isButton) {
      e.preventDefault()
      el.click()
    }
  })
}

function initSidebarScrollPreserve() {
  const sidebarEl = document.getElementById('sidebar')
  if (!sidebarEl) return

  // Restore scroll position on page load
  const savedScroll = sessionStorage.getItem('sidebarScroll')
  if (savedScroll) {
    sidebarEl.scrollTop = parseInt(savedScroll, 10)
  }

  // Save scroll position before navigating, restore for same-page anchors
  sidebarEl.addEventListener('click', (e) => {
    const link = e.target.closest('a')
    if (!link) return

    const scrollPos = sidebarEl.scrollTop
    sessionStorage.setItem('sidebarScroll', scrollPos.toString())

    // For same-page anchor links, restore scroll position after browser scrolls
    const href = link.getAttribute('href')
    if (href && href.startsWith('#')) {
      requestAnimationFrame(() => {
        sidebarEl.scrollTop = scrollPos
      })
    }
  })
}

function initMenuBorder() {
  const content = document.getElementById('content')
  const menu = document.querySelector('.content .menu')
  if (!content || !menu) return

  content.addEventListener('scroll', () => {
    if (content.scrollTop > 10) {
      menu.classList.add('scrolled')
    } else {
      menu.classList.remove('scrolled')
    }
  })
}

function scrollToTop() {
  const content = document.getElementById('content')
  if (content) {
    content.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function toggleTheme() {
  console.log('toggleTheme called')
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  console.log('Switching from', currentTheme, 'to', newTheme)
  html.setAttribute('data-theme', newTheme)
  window.localStorage.setItem('theme', newTheme)
}

function toggleFocusMode() {
  const html = document.documentElement
  const currentMode = html.getAttribute('data-focus-mode')
  const newMode = currentMode === 'true' ? 'false' : 'true'
  html.setAttribute('data-focus-mode', newMode)
  window.sessionStorage.setItem('focusMode', newMode)
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
  const html = document.querySelector('html')
  const contentElement = document.getElementById('content')

  // if (showSidebar === 'true') {
  //   show();
  // } else {
  //   hide();
  // }

  function toggle() {
    const showSidebar = html.getAttribute('data-show-sidebar')

    // Sidebar is visible by default (CSS only hides when explicitly "false")
    if (showSidebar === 'false') {
      show()
    } else {
      hide()
    }
  }

  function show() {
    window.sessionStorage.setItem('showSidebar', 'true')
    html.setAttribute('data-show-sidebar', 'true')
    // contentElement.style.left = '300px';

    // sidebarElement.setAttribute('data-show', 'true');
    // sidebarElement.style.display = 'block';
  }

  function hide() {
    window.sessionStorage.setItem('showSidebar', 'false')
    html.setAttribute('data-show-sidebar', 'false')
    // contentElement.style.left = 0;

    // sidebarElement.setAttribute('data-show', 'false');
    // sidebarElement.style.display = 'none';
  }

  return Object.freeze({
    toggle,
  })
}

function initSidebarResize() {
  const sidebar = document.getElementById('sidebar')
  const handle = document.querySelector('.sidebar-resize-handle')
  if (!sidebar || !handle) return

  const MIN_WIDTH = 200
  const MAX_WIDTH = 600

  // Restore saved width
  const savedWidth = localStorage.getItem('sidebarWidth')
  if (savedWidth) {
    const width = parseInt(savedWidth, 10)
    if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
      sidebar.style.minWidth = width + 'px'
      sidebar.style.width = width + 'px'
    }
  }

  let isDragging = false
  let startX = 0
  let startWidth = 0

  handle.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.clientX
    startWidth = sidebar.offsetWidth

    handle.classList.add('dragging')
    document.body.classList.add('sidebar-resizing')

    e.preventDefault()
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const delta = e.clientX - startX
    let newWidth = startWidth + delta

    // Clamp to min/max
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))

    sidebar.style.minWidth = newWidth + 'px'
    sidebar.style.width = newWidth + 'px'
  })

  document.addEventListener('mouseup', () => {
    if (!isDragging) return

    isDragging = false
    handle.classList.remove('dragging')
    document.body.classList.remove('sidebar-resizing')

    // Save the width
    localStorage.setItem('sidebarWidth', sidebar.offsetWidth.toString())
  })

  // Double-click to reset to default
  handle.addEventListener('dblclick', () => {
    sidebar.style.minWidth = ''
    sidebar.style.width = ''
    localStorage.removeItem('sidebarWidth')
  })
}

function shortcutHandler(e) {
  // Handle search modal shortcuts
  if (search && search.isOpen()) {
    if (e.code === 'Escape') {
      e.preventDefault()
      search.close()
      return
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault()
      search.selectNext()
      return
    }
    if (e.code === 'ArrowUp') {
      e.preventDefault()
      search.selectPrev()
      return
    }
    if (e.code === 'Enter') {
      e.preventDefault()
      search.goToSelected()
      return
    }
    return
  }

  // Ignore shortcuts when typing in input fields
  const activeElement = document.activeElement
  const isTyping =
    activeElement &&
    (activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable)

  // Cmd+K or Ctrl+K opens search regardless of typing state
  if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
    e.preventDefault()
    openSearch()
    return
  }

  if (isTyping) return

  // Slash opens search when not typing
  if (e.code === 'Slash') {
    e.preventDefault()
    openSearch()
    return
  }

  // Single-key shortcuts (no modifiers)
  if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    if (e.code === 'KeyT') {
      sidebar.toggle()
      return
    } else if (e.code === 'KeyD') {
      toggleTheme()
      return
    } else if (e.code === 'KeyF') {
      e.preventDefault() // Prevent browser's find
      toggleFocusMode()
      return
    } else if (e.code === 'KeyQ') {
      scrollToPrevHeader()
      return
    } else if (e.code === 'KeyW') {
      e.preventDefault() // Prevent browser close tab
      scrollToNextHeader()
      return
    }
  }

  if (!e.shiftKey && !e.metaKey && !e.ctrlKey && e.code === 'ArrowLeft') {
    previousChapter()
  } else if (!e.shiftKey && !e.metaKey && !e.ctrlKey && e.code === 'ArrowRight') {
    nextChapter()
  }
}

function previousChapter() {
  const prevButton = document.getElementById('page-nav-prev')
  if (prevButton) {
    window.location.href = prevButton.href
  }
}

function nextChapter() {
  const nextButton = document.getElementById('page-nav-next')
  if (nextButton) {
    window.location.href = nextButton.href
  }
}

function getPageHeaders() {
  const content = document.querySelector('.page-content')
  if (!content) return []
  return Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'))
}

function scrollToNextHeader() {
  const headers = getPageHeaders()
  if (headers.length === 0) return

  const content = document.getElementById('content')
  if (!content) return

  const scrollTop = content.scrollTop
  const offset = 100 // Account for sticky header

  for (const header of headers) {
    const headerTop = header.offsetTop - offset
    if (headerTop > scrollTop + 5) {
      content.scrollTo({ top: headerTop, behavior: 'smooth' })
      return
    }
  }
}

function scrollToPrevHeader() {
  const headers = getPageHeaders()
  if (headers.length === 0) return

  const content = document.getElementById('content')
  if (!content) return

  const scrollTop = content.scrollTop
  const offset = 100 // Account for sticky header

  for (let i = headers.length - 1; i >= 0; i--) {
    const headerTop = headers[i].offsetTop - offset
    if (headerTop < scrollTop - 5) {
      content.scrollTo({ top: headerTop, behavior: 'smooth' })
      return
    }
  }

  // If no previous header, scroll to top
  content.scrollTo({ top: 0, behavior: 'smooth' })
}

function initRightTocScrollspy() {
  const rightToc = document.querySelector('.right-toc')
  if (!rightToc) return

  const tocLinks = rightToc.querySelectorAll("a[href^='#']")
  if (tocLinks.length === 0) return

  const headingIds = Array.from(tocLinks).map((link) =>
    link.getAttribute('href').slice(1),
  )
  const headings = headingIds
    .map((id) => document.getElementById(id))
    .filter((el) => el !== null)

  if (headings.length === 0) return

  let activeLink = null

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          const link = rightToc.querySelector(`a[href="#${id}"]`)
          if (link && link !== activeLink) {
            if (activeLink) {
              activeLink.classList.remove('active')
            }
            link.classList.add('active')
            activeLink = link
          }
        }
      })
    },
    {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    },
  )

  headings.forEach((heading) => observer.observe(heading))

  // Handle click on TOC links - let native anchor behavior work
  // CSS scroll-margin-top on headings handles the sticky header offset
}

function openSearch() {
  if (search) {
    search.open()
  }
}

function closeSearch() {
  if (search) {
    search.close()
  }
}

function Search() {
  let searchIndex = null
  let selectedIndex = -1
  let results = []

  const modal = document.getElementById('search-modal')
  const input = document.getElementById('search-input')
  const resultsContainer = document.getElementById('search-results')

  if (!modal || !input || !resultsContainer) {
    return {
      open: () => {},
      close: () => {},
      isOpen: () => false,
      selectNext: () => {},
      selectPrev: () => {},
      goToSelected: () => {},
    }
  }

  input.addEventListener('input', () => {
    performSearch(input.value)
  })

  async function loadIndex() {
    if (searchIndex) return searchIndex

    try {
      const rootUrl = document.body.dataset.rootUrl || ''
      const response = await fetch(`${rootUrl}/search-index.json`)
      if (!response.ok) throw new Error('Failed to load search index')
      searchIndex = await response.json()
      return searchIndex
    } catch (err) {
      console.error('Failed to load search index:', err)
      return []
    }
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text)
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
    return escapeHtml(text).replace(regex, '<mark>$1</mark>')
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function performSearch(query) {
    if (!searchIndex || !query.trim()) {
      results = []
      renderResults([])
      return
    }

    const normalizedQuery = query.toLowerCase().trim()
    const scored = []

    for (const entry of searchIndex) {
      let score = 0
      let matchType = null

      // Title match (highest priority)
      if (entry.title.toLowerCase().includes(normalizedQuery)) {
        score += 100
        matchType = 'title'
      }

      // Heading match
      for (const heading of entry.headings || []) {
        if (heading.text.toLowerCase().includes(normalizedQuery)) {
          score += 50
          if (!matchType) matchType = 'heading'
        }
      }

      // Content match
      if (entry.content.toLowerCase().includes(normalizedQuery)) {
        score += 10
        if (!matchType) matchType = 'content'
      }

      if (score > 0) {
        scored.push({ entry, score, matchType })
      }
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score)

    // Take top 10
    results = scored.slice(0, 10)
    selectedIndex = results.length > 0 ? 0 : -1
    renderResults(results)
  }

  function renderResults(results) {
    if (results.length === 0) {
      if (input.value.trim()) {
        resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>'
      } else {
        resultsContainer.innerHTML = ''
      }
      return
    }

    const query = input.value.trim()
    const rootUrl = document.body.dataset.rootUrl || ''
    resultsContainer.innerHTML = results
      .map((result, index) => {
        const { entry, matchType } = result
        const isSelected = index === selectedIndex ? 'selected' : ''

        let preview = ''
        if (matchType === 'content' && entry.content) {
          const lowerContent = entry.content.toLowerCase()
          const queryLower = query.toLowerCase()
          const matchIndex = lowerContent.indexOf(queryLower)
          if (matchIndex !== -1) {
            const start = Math.max(0, matchIndex - 30)
            const end = Math.min(entry.content.length, matchIndex + query.length + 50)
            let snippet = entry.content.slice(start, end)
            if (start > 0) snippet = '...' + snippet
            if (end < entry.content.length) snippet = snippet + '...'
            preview = `<div class="search-result-preview">${highlightMatch(snippet, query)}</div>`
          }
        }

        return `
          <a href="${rootUrl}${entry.link}" class="search-result ${isSelected}" data-index="${index}">
            <div class="search-result-title">${highlightMatch(entry.title, query)}</div>
            ${preview}
          </a>
        `
      })
      .join('')

    // Add click handlers
    resultsContainer.querySelectorAll('.search-result').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        selectedIndex = parseInt(el.dataset.index, 10)
        updateSelection()
      })
    })
  }

  function updateSelection() {
    resultsContainer.querySelectorAll('.search-result').forEach((el, index) => {
      if (index === selectedIndex) {
        el.classList.add('selected')
        el.scrollIntoView({ block: 'nearest' })
      } else {
        el.classList.remove('selected')
      }
    })
  }

  function selectNext() {
    if (results.length === 0) return
    selectedIndex = (selectedIndex + 1) % results.length
    updateSelection()
  }

  function selectPrev() {
    if (results.length === 0) return
    selectedIndex = (selectedIndex - 1 + results.length) % results.length
    updateSelection()
  }

  function goToSelected() {
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      const link = resultsContainer.querySelector(`.search-result[data-index="${selectedIndex}"]`)
      if (link) {
        window.location.href = link.href
      }
    }
  }

  async function open() {
    modal.classList.remove('hidden')
    input.value = ''
    resultsContainer.innerHTML = ''
    selectedIndex = -1
    results = []
    input.focus()
    await loadIndex()
  }

  function close() {
    modal.classList.add('hidden')
    input.value = ''
    resultsContainer.innerHTML = ''
  }

  function isOpen() {
    return !modal.classList.contains('hidden')
  }

  return Object.freeze({
    open,
    close,
    isOpen,
    selectNext,
    selectPrev,
    goToSelected,
  })
}
