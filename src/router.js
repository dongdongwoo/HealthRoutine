// template
const healthRegisterHtml = require('./pages/healthRegister.html')
const healthStartHtml = require('./pages/healthStart.html')

const routes = {
  '/': healthRegisterHtml,
  '/healthRegister': healthRegisterHtml,
  '/healthStart': healthStartHtml
}

// entry point
function initialRoutes (mode, el) {
  const contentDiv = renderHTML(el, routes['/'])

  if (mode === 'history') {
    window.onpopstate = () => renderHTML(el, routes[window.location.pathname])
  }
  return contentDiv;
}

// set browser history
function historyRouterPush (pathName, el) {
  window.history.pushState({}, pathName, window.location.origin + pathName)
  renderHTML(el, routes[pathName])
}

// render
function renderHTML (el, route) {
  el.innerHTML = route;
  return el;
}

module.exports = {
  initialRoutes,
  historyRouterPush
}
