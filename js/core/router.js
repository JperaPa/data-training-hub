export const Router = {
    routes: {},

    register(routeName, loaderFunction) {
        this.routes[routeName] = loaderFunction;
    },

    async load(routeName) {
        const main = document.getElementById("main-content");

        if (!this.routes[routeName]) {
            main.innerHTML = `<p>Module not found: ${routeName}</p>`;
            return;
        }

        main.innerHTML = `<p>Loading...</p>`;
        const html = await this.routes[routeName]();
        main.innerHTML = html;
    }
};