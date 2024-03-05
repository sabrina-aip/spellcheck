const firstRowLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondRowLetters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdRowLetters = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
export class Keyboard {
    constructor(keyboard) {
        this.keyboard = keyboard;
        this.listeners = new Map();
        this.output = '';
        this.backspaceDisabled = true;
        this.submitDisabled = true;
        this.inputDisabled = true;
        this.keyPress = (e) => {
            e.preventDefault();
            const key = e.target;
            if (key.id == 'backspace') {
                this.deleteLetter();
                return;
            }
            if (key.id == 'enter') {
                this.submit();
                return;
            }
            this.writeLetter(key.id);
        };
        this.buildKeyboard();
        document.addEventListener("keydown", (e) => {

            e.preventDefault();

            if (this.inputDisabled) return;

            const pressedKey = e.key.toLowerCase();

            if (!['backspace', 'enter'].includes(pressedKey) && /[a-z]/.test(pressedKey) == false)return;

            const key = this.keyboard.querySelector(`#${pressedKey}`);

            if (!key)return;

            key.classList.add("active");
            if (pressedKey == "backspace") {
                if (this.backspaceDisabled)
                    return;
                this.deleteLetter();
                return;
            }
            if (pressedKey == "enter") {
                return;
            }
            this.writeLetter(pressedKey);
        });
        document.addEventListener('keyup', (e) => {
            e.preventDefault();
            if (this.inputDisabled)
                return;
            const pressedKey = e.key.toLowerCase();
            if (!['backspace', 'enter'].includes(pressedKey) && /[a-z]/.test(pressedKey) == false)
                return;
            const key = this.keyboard.querySelector(`#${pressedKey}`);
            if (!key)
                return;
            key.classList.remove("active");
            if (pressedKey == "enter") {
                if (this.submitDisabled)
                    return;
                this.submit();
            }
        });
    }
    buildKeyboard() {
        const keyboardContainer = document.createElement('div');
        const firstRow = document.createElement('div');
        const secondRow = document.createElement('div');
        const thirdRow = document.createElement('div');
        const fourthRow = document.createElement('div');
        const backspace = document.createElement('button');
        const submit = document.createElement('button');
        const addKeys = (keys, container) => {
            keys.forEach((letter) => {
                const letterButton = document.createElement('button');
                letterButton.classList.add('keyboard-button', 'letter-button', 'boxed');
                letterButton.innerText = letterButton.id = letter;
                letterButton.disabled = true;
                letterButton.addEventListener('mousedown', this.keyPress);
                container.appendChild(letterButton);
            });
        };
        // Build first row
        firstRow.classList.add('first-row');
        addKeys(firstRowLetters, firstRow);
        // Build second row
        secondRow.classList.add('second-row');
        addKeys(secondRowLetters, secondRow);
        // Build third row
        thirdRow.classList.add('third-row');
        addKeys(thirdRowLetters, thirdRow);
        backspace.classList.add('keyboard-button', 'boxed', 'fa', 'fa-delete-left');
        backspace.id = 'backspace';
        backspace.disabled = this.backspaceDisabled;
        backspace.addEventListener('mousedown', this.keyPress);
        thirdRow.appendChild(backspace);
        // Build fourth row
        fourthRow.classList.add('fourth-row');
        submit.classList.add('keyboard-button', 'boxed');
        submit.id = 'enter';
        submit.innerText = 'submit';
        submit.disabled = this.submitDisabled;
        submit.addEventListener('mousedown', this.keyPress);
        fourthRow.appendChild(submit);
        keyboardContainer.id = 'keyboard-cont';
        keyboardContainer.append(firstRow, secondRow, thirdRow, fourthRow);
        this.keyboard.appendChild(keyboardContainer);
    }
    writeLetter(letter) {
        this.output += letter;
        if (this.output.length > 0) {
            this.keyboard.querySelector('#backspace').disabled = this.backspaceDisabled = false;
            this.keyboard.querySelector('#enter').disabled = this.submitDisabled = false;
        }
        this.trigger('change', this.output);
    }
    deleteLetter() {
        if (this.output.length > 0) {
            this.output = this.output.slice(0, -1);
        }
        if (this.output.length == 0) {
            this.keyboard.querySelector('#backspace').disabled = this.backspaceDisabled = true;
            this.keyboard.querySelector('#enter').disabled = this.submitDisabled = true;
        }
        this.trigger('change', this.output);
    }
    submit() {
        this.trigger('submit', this.output);
    }
    trigger(label, ...args) {
        let res = false;
        let _trigger = (inListener, label, ...args) => {
            let listeners = inListener.get(label);
            if (listeners && listeners.length) {
                listeners.forEach((listener) => {
                    listener(...args);
                });
                res = true;
            }
        };
        _trigger(this.listeners, label, ...args);
        return res;
    }
    on(label, callback) {
        if (!this.listeners.has(label)) {
            this.listeners.set(label, []);
        }
        this.listeners.get(label).push(callback);
    }
    enableInput() {
        this.inputDisabled = false;
        this.keyboard.querySelectorAll('.letter-button').forEach((button) => {
            button.disabled = false;
        });
    }
    clear() {
        this.output = '';
        this.inputDisabled = true;
        this.keyboard.querySelector('#backspace').disabled = this.backspaceDisabled = true;
        this.keyboard.querySelector('#enter').disabled = this.submitDisabled = true;
        this.keyboard.querySelectorAll('.letter-button').forEach((button) => {
            button.disabled = true;
        });
        this.trigger('change', this.output);
    }
}