
function tryProc() {
    for (let tikz of document.getElementsByClassName("blog-tikz")) {
        let script = document.createElement('script');
        script.type = 'text/tikz';
        console.log(tikz.innerText);
        script.innerText = tikz.innerText;

        let wrap = document.createElement("div");
        wrap.className = 'blog-tikz-done';
        wrap.appendChild(script);
        tikz.replaceWith(wrap);
    }
}

window.addEventListener('load', tryProc);
window.addEventListener("DOMContentLoaded", tryProc);
window.addEventListener('tikzjax-load-finished', tryProc);
document.addEventListener('tikzjax-load-finished', tryProc);
