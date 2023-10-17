const cache_version = 1;
const cache_name = `cache_v${cache_version}`;
const pre_chache_urls = [
  './favicon.ico',
  './index.html',
  './style.css',
  './app.js',
  './image-list.js',
  './star-wars-logo.jpg',
  './assets/bountyHunters.jpg',
  './assets/myLittleVader.jpg',
  './assets/snowTroopers.jpg',
];
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cache_name);
  return  await cache.addAll(resources);
};

const clearCache = () => {
  return caches.keys().then(keys => {
    keys.forEach(key => {
      if(key!==cache_name){
        caches.delete(key);
      }
    })
  })
};

const putInCache = async (request, response) => {
  const cache = await caches.open(cache_name);
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  // 首先从缓存获取资源
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // 从网络请求获取资源
  try {
    const responseFromNetwork = await fetch(request.clone());
    // 缓存网络请求
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    // 返回失败响应
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener('activate', (event) => {
  // 获取控制权
  event.waitUntil(
      // clearCache()
    self.clients.claim().then(() => {
      clearCache()
    })
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    // addResourcesToCache(pre_chache_urls)
    addResourcesToCache(pre_chache_urls).then(self.skipWaiting)
  );
});

self.addEventListener('fetch', (event) => {
  // 非同域的走网络，且不放缓存
  let url = new URL(event.request.url);
  if(url.origin!==self.origin){
    return;
  }

  event.respondWith(
    // 缓存有限策略
    cacheFirst({
      request: event.request,
    })
  );
});
