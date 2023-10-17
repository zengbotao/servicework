// sw.js
console.log('service worker 注册成功')

const addResourcesToCache = async (resources) => {
  console.log('service worker 安装成功')
  const cache = await caches.open("v1");
  //caches.open() 方法返回一个 Promise 对象，所以我们使用 await 关键字等待 Promise 的解析结果。
  await cache.addAll(resources);
  //使用 cache.addAll() 方法将资源数组 resources 添加到缓存中。
  //cache.addAll() 方法也返回一个 Promise 对象，所以我们使用 await 关键字等待 Promise 的解析结果。
};
// 接受一个资源数组作为参数。该函数使用 caches.open() 方法打开一个名为 "v1" 的缓存，
// 并使用 cache.addAll() 方法将资源数组添加到缓存中。

//step1
self.addEventListener('install', (event) => {
  // event.waitUntil() 接受一个 Promise 对象作为参数，这个 Promise 对象应该在安装过程中完成，并且是一个异步操作。
  // 在这个 Promise 中，你调用了一个名为 addResourcesToCache() 的函数，并将需要缓存的资源路径作为参数传递给它。
  // addResourcesToCache() 函数可能是你自己定义的，它的作用是将指定的资源添加到缓存中。
  // 根据你提供的资源路径列表，你可以使用 cache.addAll() 或其他相关方法来将这些资源缓存起来。
  
  // 跳过等待
  // self.skipWaiting()
  // 引入 event.waitUntil 方法
  event.waitUntil(addResourcesToCache([
          // 资源路径不要写错
          "./",
          "./index.html",         
          "./app.js",
        ]))
})

//step2
self.addEventListener('activate', (event) => {
  // 激活回调的逻辑处理
  console.log('service worker 激活成功')

  // 在激活后注册fetch事件监听器
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
// 首先使用 caches.keys() 获取当前所有的缓存名称。然后，通过 Promise.all() 和 cacheNames.map() 方法，
// 创建一个包含所有缓存删除操作的 Promise 数组。
// 每个缓存删除操作使用 caches.delete(cacheName) 方法来删除对应的缓存。
// 最后，通过 event.waitUntil() 将整个清理缓存的操作包装在一个 Promise 中，以确保在该 Promise 完成之前，
// Service Worker 的 activate 事件不会被认为已完成。
// 这段代码的作用是在 Service Worker 激活后立即清理旧的缓存，以避免旧缓存对新版本的 Service Worker 造成干扰或冗余。
})
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#recovering_failed_requests
// const cacheFirst = async (request) => {
//   const responseFromCache = await caches.match(request);
//   if (responseFromCache) {
//     return responseFromCache;
//   }
//   return fetch(request);
// };
// self.addEventListener('fetch', event => {
//   event.respondWith(cacheFirst(event.request));
//   console.log('service worker 抓取请求成功: ' + event.request.url)
// })

// 缓存优先策略（cache-first strategy）的 Service Worker 实现。
// 它定义了两个异步函数 putInCache 和 cacheFirst，并在 fetch 事件的监听器中使用了 cacheFirst 函数来处理网络请求。

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
  // putInCache 函数用于将请求和响应对象存储到缓存中。
  // 它打开一个名为 "v1" 的缓存，然后使用 cache.put(request, response) 将请求和响应对象存储到缓存中。
};

const cacheFirst = async (request) => {
  // cacheFirst 函数是缓存优先策略的核心。它首先尝试从缓存中匹配请求 (caches.match(request))，
  // 如果能够找到匹配的响应对象 (responseFromCache)，则直接返回该响应对象。
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  // 如果缓存中没有匹配的响应对象，它会通过网络发起请求 (fetch(request))，获取到网络响应 (responseFromNetwork)。然后，
  // 它会调用 putInCache(request, responseFromNetwork.clone()) 将请求和响应对象存储到缓存中，以备将来的请求使用。
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;//cacheFirst 函数返回网络响应对象
};

self.addEventListener("fetch", (event) => {
  console.log('service worker 抓取请求成功: ' + event.request.url)
  event.respondWith(cacheFirst(event.request));
});