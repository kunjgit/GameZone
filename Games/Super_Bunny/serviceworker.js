var version = 'v1.1'
self.addEventListener('install', event=>{
	console.log('[ServiceWorker] Installed version', version);
	event.waitUntil(
		//caches.delete(version) // force deletion
		caches.open(version).then(cache => {
			return cache.addAll([
				'index.html'
			])
		})
	)
})

self.addEventListener('activate', event=>{
	self.clients.matchAll({
		includeUncontrolled: true
	}).then(clientList=>{
		var urls = clientList.map(client=>{
			return client.url;
		});
		console.log('[ServiceWorker] Matching clients:', urls.join(', '));
	});
	event.waitUntil(
		caches.keys().then(cacheNames=>{
			return Promise.all(
				cacheNames.map(cacheName=>{
					if (cacheName !== version) {
						console.log('[ServiceWorker] Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		}).then(function() {
			console.log('[ServiceWorker] Claiming clients for version', version);
			return self.clients.claim();
		})
	);
});

self.addEventListener('fetch', event=>{
	if(event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return
	event.respondWith(
		caches.match(event.request).then(resp=>{
			console.log('[ServiceWorker] Requesting', (resp?"(Response) "+resp.url:null)||event.request.url, version);
			return resp || fetch(event.request).then(response=>{
				return caches.open(version).then(cache=>{
					console.log('[ServiceWorker] Fetching', event.request.url, version);
					cache.put(event.request, response.clone())
					return response
				})
			})
		})
	)
})
