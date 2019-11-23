importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
    workbox.routing.registerRoute(
        "/",
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        new RegExp(".+\\.js$"),
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        new RegExp(".+\\.css$"),
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        new RegExp(".+\\.png$"),
        new workbox.strategies.StaleWhileRevalidate()
    );
    workbox.routing.registerRoute(
        new RegExp(".+\\.svg$"),
        new workbox.strategies.StaleWhileRevalidate()
    );

    console.log(`Yay! Workbox is loaded 🎉`)
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
