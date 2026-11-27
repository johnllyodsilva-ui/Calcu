(function () {
  var display = document.getElementById("display");
  var history = document.getElementById("history");
  var symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  var current = "0", previous = null, operator = null, justEvaluated = false;

  function compute(a, b, op) {
    a = parseFloat(a); b = parseFloat(b);
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? "Error" : a / b;
    return b;
  }
  function fmt(v) {
    if (v === "Error") return v;
    return String(parseFloat(Number(v).toPrecision(12)));
  }
  function render() {
    display.textContent = current;
    history.textContent = previous !== null && operator ? previous + " " + symbols[operator] : "";
  }
  function inputNumber(n) {
    if (current === "Error" || justEvaluated) { current = "0"; justEvaluated = false; }
    if (current.replace(/[-.]/g, "").length >= 12) return;
    current = current === "0" ? n : current + n;
  }
  function inputDot() {
    if (current === "Error" || justEvaluated) { current = "0"; justEvaluated = false; }
    if (current.indexOf(".") === -1) current += ".";
  }
  function chooseOperator(op) {
    if (current === "Error") return;
    if (operator && previous !== null && !justEvaluated) {
      current = fmt(compute(previous, current, operator));
    }
    previous = current; operator = op; justEvaluated = true;
  }
  function equals() {
    if (operator === null || previous === null) return;
    var result = fmt(compute(previous, current, operator));
    history.textContent = previous + " " + symbols[operator] + " " + current + " =";
    current = result; previous = null; operator = null; justEvaluated = true;
    display.textContent = current;
  }
  function clearAll() { current = "0"; previous = null; operator = null; justEvaluated = false; }
  function backspace() {
    if (justEvaluated || current === "Error") { current = "0"; return; }
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
  }
  function percent() {
    if (current === "Error") return;
    current = fmt(parseFloat(current) / 100);
  }

  document.getElementById("keys").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.num !== undefined) inputNumber(b.dataset.num);
    else if (b.dataset.op) chooseOperator(b.dataset.op);
    else if (b.dataset.act === "dot") inputDot();
    else if (b.dataset.act === "equals") { equals(); return; }
    else if (b.dataset.act === "clear") clearAll();
    else if (b.dataset.act === "back") backspace();
    else if (b.dataset.act === "percent") percent();
    render();
  });

  document.addEventListener("keydown", function (e) {
    var k = e.key;
    if (k >= "0" && k <= "9") inputNumber(k);
    else if (k === ".") inputDot();
    else if ("+-*/".indexOf(k) !== -1) chooseOperator(k);
    else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); return; }
    else if (k === "Backspace") backspace();
    else if (k === "Escape") clearAll();
    else if (k === "%") percent();
    else return;
    render();
  });
})();
