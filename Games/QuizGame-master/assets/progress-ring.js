class ProgressRing extends HTMLElement {
    connectedCallback() {
        // get config from attributes
        const stroke = this.getAttribute("stroke");
        const radius = this.getAttribute("radius");
        const normalizedRadius = radius - stroke * 2;
        this._circumference = normalizedRadius * 2 * Math.PI;
        
        // create shadow dom root
        this._root = this.attachShadow({mode: 'open'});
        this._root.innerHTML = `
            <svg
            height="${radius * 2}"
            width="${radius * 2}"
            >
                <circle
                stroke="white"
                stroke-dasharray="${this._circumference} ${this._circumference}"
                style="stroke-dashoffset:${this._circumference}"
                stroke-width="${stroke}"
                fill="transparent"
                r="${normalizedRadius}"
                cx="${radius}"
                cy="${radius}"
            />
            </svg>
        
            <style>
            circle {
                transition: stroke-dashoffset 0.35s;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
            }
            </style>
        `;
    }
    static get observedAttributes() {
        return ['progress'];
    }
    setProgress(percent) {
        const offset = this._circumference - (percent / 100 * this._circumference);
        const circle = this._root.querySelector('circle');
        circle.style.strokeDashoffset = offset; 
    };
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'progress') {
            this._root && this.setProgress(newValue);
        }
    }
}