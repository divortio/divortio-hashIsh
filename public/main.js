import hashIsh from './js/hashIsh.js';
import {initAnimation} from './js/animation.js';
import serialize from './js/serial.js'; // <-- Updated import path

// --- hashIsh.js Library Source for Display ---
const hashIshSourceCode = `
const hashIsh = (function () {
    // Default character set is now defined within the library's scope.
    const DEFAULT_PUSH_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';

    function _serialize(val) {
        if (val === null || val === undefined) return 'null';
        if (typeof val !== 'object') return JSON.stringify(val);
        if (Array.isArray(val)) return '[' + val.map(_serialize).join(',') + ']';
        return '{' + Object.keys(val).sort().map(key => JSON.stringify(key) + ':' + _serialize(val[key])).join(',') + '}';
    }
    
    // The function now uses default parameters for length and PUSH_CHARS.
    return function (input, length = 12, PUSH_CHARS = DEFAULT_PUSH_CHARS) {
        const serialized = _serialize(input);
        let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < serialized.length; i++) {
            k = serialized.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1, 597399067);
            h2 = h3 ^ Math.imul(h2, 2869860233);
            h3 = h4 ^ Math.imul(h3, 951274213);
            h4 = h1 ^ Math.imul(h4, 2716044179);
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
            h2 = Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507);
            h4 = Math.imul(h4 ^ (h4 >>> 13), 3266489909);
            h1 = (h1 ^ k) >>> 0;
        }
        const hashChars = new Array(length);
        for (let i = 0; i < length; i++) {
            const state = [h1, h2, h3, h4];
            const charIndex = (state[i % 4] >> ((i % 5) * 3)) & 63;
            hashChars[i] = PUSH_CHARS.charAt(charIndex);
        }
        return hashChars.join('');
    }
})();
`.trim();

// --- Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the background animation
    initAnimation();

    // --- Interactive Page Logic ---
    // The PUSH_CHARS constant is no longer needed here.

    // DOM Elements
    const tabs = document.querySelectorAll('.tab');
    const textInput = document.getElementById('text-input');
    const numberInput = document.getElementById('number-input');
    const hashOutput = document.getElementById('hash-output');
    const copyButton = document.getElementById('copy-button');
    const copyFeedback = document.getElementById('copy-feedback');

    // Strain Profile Stats
    const speedStat = document.getElementById('speed-stat');
    const collisionStat = document.getElementById('collision-stat');
    const strainType = document.getElementById('strain-type');
    const inputSize = document.getElementById('input-size');
    const potencyLevel = document.getElementById('potency-level');

    // Sliders
    const lengthSlider1 = document.getElementById('length-slider');
    const lengthValue1 = document.getElementById('length-value');
    const lengthSlider2 = document.getElementById('length-slider-2');
    const lengthValue2 = document.getElementById('length-value-2');

    // Example Elements
    const exampleObjectCode = document.getElementById('example-object-code');
    const exampleObjectOutput = document.getElementById('example-object-output');
    const exampleStringCode = document.getElementById('example-string-code');
    const exampleStringOutput = document.getElementById('example-string-output');
    const exampleArrayCode = document.getElementById('example-array-code');
    const exampleArrayOutput = document.getElementById('example-array-output');
    const exampleNumberCode = document.getElementById('example-number-code');
    const exampleNumberOutput = document.getElementById('example-number-output');

    let currentType = 'object';
    const defaultInputs = {
        object: JSON.stringify({
            user: {firstName: "Smokey", lastName: "Robinson"},
            session: {location: "Amsterdam", isTokenBaked: true, sessionId: "420-abc-69-xyz"},
            preferences: ["Sativa", "Indica", "Hybrid"]
        }, null, 2),
        string: "feat: Implemented the good stuff",
        array: JSON.stringify(["kief", "trichomes", "resin", 420], null, 2),
        number: "420"
    };

    function updateAll() {
        updateHash();
        updateStrainProfile();
        updateUsageExamples();
    }

    function setGlobalLength(value) {
        lengthSlider1.value = value;
        lengthValue1.textContent = value;
        lengthSlider2.value = value;
        lengthValue2.textContent = value;
        updateAll();
    }

    function handleSliderChange(e) {
        setGlobalLength(e.target.value);
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function updateStrainProfile() {
        const length = parseInt(lengthSlider1.value, 10);
        if (length < 16) collisionStat.textContent = '< 0.0001%';
        else if (length < 24) collisionStat.textContent = '< 0.00000001%';
        else collisionStat.textContent = '≈ 0%';
        strainType.textContent = currentType;
        potencyLevel.textContent = length;
    }

    function updateHash() {
        let input;
        const length = parseInt(lengthSlider1.value, 10);
        const startTime = performance.now();
        try {
            switch (currentType) {
                case 'object':
                case 'array':
                    input = JSON.parse(textInput.value);
                    textInput.classList.remove('border-red-500');
                    break;
                case 'number':
                    input = parseFloat(numberInput.value);
                    break;
                case 'string':
                default:
                    input = textInput.value;
                    break;
            }
            const hash = hashIsh(input, length);
            const endTime = performance.now();
            hashOutput.value = hash;
            speedStat.textContent = `≈ ${(endTime - startTime).toFixed(3)}ms`;

            // Use the imported serialize function directly
            const serializedInput = serialize(input);
            const byteLength = new TextEncoder().encode(serializedInput).length;
            inputSize.textContent = formatBytes(byteLength);

        } catch (e) {
            if (currentType === 'object' || currentType === 'array') textInput.classList.add('border-red-500');
            hashOutput.value = 'Invalid input...';
            speedStat.textContent = 'N/A';
            inputSize.textContent = 'N/A';
        }
    }

    function switchType(type) {
        currentType = type;
        tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.type === type));
        const isNumber = type === 'number';
        textInput.classList.toggle('hidden', isNumber);
        numberInput.classList.toggle('hidden', !isNumber);
        if (isNumber) numberInput.value = defaultInputs.number;
        else textInput.value = defaultInputs[type];
        updateAll();
    }

    function updateUsageExamples() {
        const length = parseInt(lengthSlider1.value, 10);
        const examples = {
            object: {input: {a: 1, b: "two"}, codeEl: exampleObjectCode, outEl: exampleObjectOutput},
            string: {input: "hashish", codeEl: exampleStringCode, outEl: exampleStringOutput},
            array: {input: [1, 2, 3], codeEl: exampleArrayCode, outEl: exampleArrayOutput},
            number: {input: 1337, codeEl: exampleNumberCode, outEl: exampleNumberOutput}
        };
        for (const [key, val] of Object.entries(examples)) {
            // The third argument is no longer needed.
            const hash = hashIsh(val.input, length);
            const inputString = JSON.stringify(val.input);
            val.codeEl.innerHTML = `<span class="keyword">const</span> <span class="variable">potency</span> = <span class="string">${length}</span>;
<span class="keyword">const</span> <span class="variable">input</span> = ${inputString};
<span class="keyword">const</span> <span class="variable">hash</span> = <span class="variable">hashIsh</span>(<span class="variable">input</span>, <span class="variable">potency</span>);
<span class="variable">console</span>.<span class="keyword">log</span>(<span class="variable">hash</span>);`;
            val.outEl.innerHTML = `<span class="comment">> </span><span class="string">"${hash}"</span>`;
        }
    }

    // --- Event Listeners & Initialisation ---
    lengthSlider1.addEventListener('input', handleSliderChange);
    lengthSlider2.addEventListener('input', handleSliderChange);
    tabs.forEach(tab => tab.addEventListener('click', () => switchType(tab.dataset.type)));
    textInput.addEventListener('input', updateAll);
    numberInput.addEventListener('input', updateAll);

    function setupCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                if (button.closest('summary')) event.preventDefault();
                const targetId = button.dataset.target;
                const targetElement = document.getElementById(targetId);
                const feedbackElement = button.nextElementSibling;
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = targetElement.textContent;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
                feedbackElement.style.opacity = '1';
                setTimeout(() => {
                    feedbackElement.style.opacity = '0';
                }, 2000);
            });
        });
    }

    copyButton.addEventListener('click', () => {
        hashOutput.select();
        document.execCommand('copy');
        copyFeedback.style.opacity = '1';
        setTimeout(() => {
            copyFeedback.style.opacity = '0';
        }, 2000);
    });

    document.getElementById('library-code-block').textContent = hashIshSourceCode;

    setupCopyButtons();
    switchType('object');
    setGlobalLength(12);
});