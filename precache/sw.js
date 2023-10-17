self.importScripts(
  '/sw/router.js',
  '/sw/strategy.js',
  '/sw/precacher.js'
)
// 方法用于在 Service Worker 脚本中动态加载其他脚本文件。
// 它接受一个或多个脚本文件路径作为参数，并在 Service Worker 的上下文中加载这些脚本文件。
// 在你提供的代码中，self.importScripts() 方法被用于加载三个脚本文件：/sw/router.js、/sw/strategy.js 和 /sw/precacher.js。
// 这些文件路径应该是相对于当前 Service Worker 脚本文件的路径或一个完整的 URL。
let resources = [
  {
    url: '/index.html',
    revision: '5ed70e0c237b4c66'
  },
  '/index.f8666b443c7a0e84.js',
  '/index.1236d1250f7ffbdc.css'
]

let precacher = new Precacher()
precacher.precacheAndRoute(resources)

let router = new Router()
// router.registerRoute(/\/index\.(html|css|js)$/, cacheFirst())
router.registerRoute(/\/article\.json$/, staleWhileRevalidate())
router.registerRoute(/\/statistics\.json$/, networkOnly())
