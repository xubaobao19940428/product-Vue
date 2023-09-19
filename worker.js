// worker.js
self.addEventListener("message", function(e) {
    e.waitUntil(
        self.clients.matchAll().then(function(clients) {
            if (!clients || clients.length === 0) {
                return;
            }
            clients.forEach(function(client) {
                console.log(client)
                // client.postMessage(e.data);
            });
        })
    );
});
