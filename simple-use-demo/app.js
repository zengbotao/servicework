import { imgList } from './image-list.js';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        'sw.js',
        {
          scope: './',
        }
      );
      console.log('Service Work 作用域',registration.scope);
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }

      navigator.serviceWorker.oncontrollerchange = (event) => {
        alert('页面已经更新，请重新加载页面');
        window.location.reload();
      }
      
      if(!navigator.onLine){
        alert('网络已断开，内容可能已过期')
      }
      
      window.addEventListener('online',() => {
        alert('网络已恢复，请刷新加载最新内容')
        window.location.reload();
      })

    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

const imgSection = document.querySelector('section');

const getImageBlob = async (url) => {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(
      `Image didn't load successfully; error code: ${
        imageResponse.statusText || imageResponse.status
      }`
    );
  }
  return imageResponse.blob();
};

const createGalleryFigure = async (galleryImage) => {
  try {
    const imageBlob = await getImageBlob(galleryImage.url);
    const myImage = document.createElement('img');
    myImage.src = window.URL.createObjectURL(imageBlob);
    myImage.setAttribute('alt', galleryImage.alt);
    imgSection.append(myImage);
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('load',()=>{
  registerServiceWorker();
})
imgList.images.map(createGalleryFigure);
