
var cacheName = 'test37';
var filesToCache = [
  '/',
  '/css/materialize.css',
  '/css/style.css',
  'fonts/roboto/Roboto-Bold.woff',
  'js/init.js',
  'js/materialize.js',
  'js/content.js',
];

var dataCacheName = 'promo_v1';

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName)
    .then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
    .then(function(){
      //Forces the update on reload
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://pdbmanager-dot-pdbenv-dev.appspot.com';
  if (e.request.url.indexOf(dataUrl) > -1) {
    
    caches.match(e.request).then(function(response) {
      if (response) {
        response.json().then(function(json) {
          console.log(json);
        });
      }
    });
    
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    //FETCH THE APP SHELL
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: event.data.text(),
    icon: 'img/apple-icon.png',
    badge: 'img/apple-icon.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});