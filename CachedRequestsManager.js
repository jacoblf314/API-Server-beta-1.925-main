class CachedRequestsManager {
    static cache = new Map();
    static cacheExpirationTime = 12000; // 50 secondes

    static startCachedRequestsCleaner() {
        setInterval(() => {
            this.flushExpired();
        }, this.cacheExpirationTime); 
    }

    static add(url, content, ETag = "") {
        const expirationDate = Date.now() + this.cacheExpirationTime;
        this.cache.set(url, { content, ETag, expirationDate });
        console.log(` Ajout dans la cache: ${url}`);
    }

    static find(url) {
        return this.cache.get(url);
    }

    static clear(url) {
        this.cache.delete(url);
    }

    static flushExpired() {
        const now = Date.now();
        for (const [url, { expirationDate }] of this.cache) {
            if (expirationDate < now) {
                this.cache.clear(url)
                console.log(` Retrait de cache expirée: ${url}`);
            }
        }
    }

    static get(httpContext) {
        const cachedEntry = this.find(httpContext.req.url);
        if (cachedEntry) {
            console.log(` Extraction de la cache: ${httpContext.req.url}`);
            httpContext.response.JSON(cachedEntry.content, cachedEntry.ETag, true); 
            return true; 
        }
        return false; 
    }
}

export default CachedRequestsManager;