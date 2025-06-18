
window.addEventListener("DOMContentLoaded", () => {
    console.log('content loaded');
    let interval = setInterval(() => {
        let tikzs = document.getElementsByClassName("blog-tikz");
        console.log(tikzs);
        if (tikzs.length === 0)
            clearInterval(interval);

        for (let tikz of tikzs) {
            console.log(tikz);
            let script = document.createElement('script');
            script.type = 'text/tikz';
            script.innerText = tikz.innerText;

            let wrap = document.createElement("div");
            wrap.className = 'blog-tikz-done';
            wrap.appendChild(script);
            tikz.replaceWith(wrap);
        }
    }, 1000);
});
