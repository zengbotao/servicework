
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
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        './sw.js?v=2023',
        {scope: './',}
      );
      console.log('Service Worker',registration)
      // console.log('作用域',registration.scope)
      // Service Worker 开关 true-关 false-开
      if (window.SW_TURN_OFF) {
        // 注销Service Worker
       await unRegisterServiceWorker();
      }
      
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

// 注册service worker
registerServiceWorker();