const CACHE_NAME = 'flappy-fish-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/game.js',
  '/manifest.json',
  '/assets/fish.png',
  '/assets/pipe.png',
  '/assets/background.png',
  '/assets/music.mp3',
  '/assets/jump.wav',
  '/assets/gameover.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
