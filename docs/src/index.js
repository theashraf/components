console.time('load')
const scrollToY = require('scrolltoy')
const { qs, qsa } = require('qs')

function setupNavigation () {
  const mainLink = qs(`a[name="${document.body.dataset.page}"]`)
  mainLink.classList.add('active')

  const main = qs('main')
  const links = qsa('nav ul li a')
  const ranges = []
  let current

  links.map(link => {
    const id = link.getAttribute('href').slice(1)
    const section = document.getElementById(id)
    const { top } = section.getBoundingClientRect()

    ranges.push({
      upper: top,
      lower: top + section.offsetHeight,
      id: id,
      link: link
    })

    link.addEventListener('click', event => {
      event.preventDefault()

      const prev = qs('a.selected')
      if (prev) prev.className = ''
      link.className = 'selected'
      scrollToY(main, section.offsetTop, 500)
      window.location.hash = id
    })
  })

  function onscroll (event) {
    if (scrollToY.scrolling) return
    var pos = main.scrollTop

    pos = pos + 100

    ranges.map(function (range) {
      if (pos >= range.upper && pos <= range.lower) {
        if (range.id === current) return

        current = range.id
        var prev = qs('a.selected')
        if (prev) prev.className = ''
        range.link.className = 'selected'
      }
    })
  }
  main.addEventListener('scroll', onscroll)
}

function ready () {
  console.timeEnd('load')
  setupNavigation()

  const theme = window.localStorage.theme
  if (theme) document.body.classList.add(theme)

  qs('.theme-picker').addEventListener('click', e => {
    const dark = document.body.classList.contains('theme-dark')
    window.localStorage.theme = `theme-${dark ? 'light' : 'dark'}`

    document.body.classList.toggle('theme-dark')
  })
}

document.addEventListener('DOMContentLoaded', ready)
