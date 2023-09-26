const styles = new Map()

export function addStyle(name: any, rules: any) {
    if (styles.get(name)) return;
    const style = document.createElement('style');
    style.innerHTML = rules;
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', `ReactGiphySearchbox-${name}`);
    document.head.appendChild(style);
    styles.set(name, style);
}

export function useStyle(name: any, rules: any) {
    addStyle(name, rules);
}