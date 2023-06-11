var ver = 'v1';
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(ver).then(cache => {
			return cache.addAll([
				'index.html'
			])
		})
	)
})
self.addEventListener('fetch', event => {
	if(event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return
	event.respondWith(
		caches.match(event.request).then(resp => {
			return resp || fetch(event.request).then(response =>  {
				return caches.open(ver).then(cache =>  {
					cache.put(event.request, response.clone())
					return response
				})
			})
		})
	)
})
