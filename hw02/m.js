function m() {
    const num1 = Number(document.getElementById('num1').value);
    const num2 = Number(document.getElementById('num2').value);
    if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
        document.getElementById('result').textContent = 'Please enter two valid numbers.';
        return;
    }
    const result = num1 * num2;
    document.getElementById('result').textContent = 'Result: ' + result;
}
