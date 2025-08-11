export function debounce(fn, delay = 300) {
    let t = null;
    return (...args) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => fn(...args), delay)
    }
}