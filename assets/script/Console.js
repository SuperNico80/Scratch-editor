let pre = document.querySelector(".con");
pre.textContent += "\n";
window.onerror = function (mensaje) {
  pre.textContent += mensaje + "\n";
};

window.addEventListener("unhandledrejection", function (e) {
  pre.textContent += e.reason + "\n";
});
//For iframe consoles
//nonexistent()
/*            const frame = contentWindow;

frame.onload = () => {
    const w = frame.contentWindow;

    const originalLog = w.console.log;

    w.console.log = (...args) => {
        originalLog.apply(w.console, args);

        pre.textContent += <iframe>\\${w.location.href}: ${args.join(" ")}\n;
    };
};*/
const originalLog = console.log;

console.log = (...args) => {
  originalLog(...args); // Sigue mostrando en la consola

  pre.textContent +=
    args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
      )
      .join(" ") + "\n";
};
