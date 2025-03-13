
const cacheID = "sienceV2";
const contentToCache = [
    "/index.html",
    "/app.mjs",
    "/icons/bookshelf.png",
    "/icons/bookshelfLarge.png",
    "/css/index.css",
  
    "/modules/fetch-data.mjs",
    "/modules/formData-to-object.mjs",
    "/modules/load-templates.mjs",
    "/modules/message-handler.mjs",

    "/templates/add-work-template.html",
    "/templates/browse-works-template.html",
    "/templates/change-work-template.html",
    "/templates/create-user-template.html",
    "/templates/header-template.html",
    "/templates/home-template.html",
    "/templates/login-user-template.html",
    "/templates/profile-template.html",
    "/templates/show-work-template.html",

    "/views/add-work.mjs",
    "/views/browse-works.mjs",
    "/views/change-work.mjs",
    "/views/create-user.mjs",
    "/views/header.mjs",
    "/views/home.mjs",
    "/views/login-user.mjs",
    "/views/profile.mjs",
    "/views/show-work.mjs",

];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheID);
        console.log(cache);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
        e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r };
        const response = await fetch(e.request);
        const cache = await caches.open(cacheID);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});
