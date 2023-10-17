// 一定要把该 html 和 JavaScript，发布到 web server 上运行(比如使用 Node.js 的 express 框架)。
// 如果本地直接打开 HTML，会遇到错误：ServiceWorker registration failed：TypeError：failed to register a ServiceWorker：The URL protocol of the current origin(‘null’) is not supported.

// Service Worker注销方法
const unRegisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    // Service Worker 开关全局变量的名称
    const registrations = await  navigator.serviceWorker.getRegistrations();
    for (let reg of registrations) {
      // 注销掉所有的 Service Worker
      await reg.unregister()
    }
  }
  return true;
};

// Service Worker注册方法
const registerServiceWorker = async () => {
  console.log(navigator)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        './sw.js?v=2023',
        {scope: './',}
      );
      // setInterval(() => {
      //   registration.update();
      //   console.log('更新');
      // },10*1000)
      console.log('Service Worker',registration)
      // console.log('作用域',registration.scope)
      // Service Worker 开关 true-关 false-开
      if (window?.SW_TURN_OFF) {
        // 注销Service Worker
       await unRegisterServiceWorker();
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

// 注册service worker
registerServiceWorker();