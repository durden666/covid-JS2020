const textArea = document.querySelector('#cases-search');

let keyPress = effect => {
  effect.animate([
    { color: 'white', background: 'rgba(255, 255, 255, 0.12)' },
    { color: 'white', background: 'rgba(255, 255, 255, 0.12)' }
  ], {
    duration: 150
  })
}

const KeyBoard = {
  speech(event) {
    const text = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    if (event.results[0].isFinal) {
      textArea.value = text;
    }
  },

  elements: {
    main: null,
    keyContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    lang: true,
    start: 0,
    end: 0,
    record: false,
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keyContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keyContainer.classList.add('keyboard__keys');
    this.elements.keyContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key')

    this.elements.main.appendChild(this.elements.keyContainer);
    document.body.appendChild(this.elements.main);

    document.querySelector('#keyboard').addEventListener('click', () => {
      let element = textArea;
      this.open(element.value, currentValue => {
        element.value = currentValue;
      });

      element.addEventListener('click', () => {
        this.properties.start = textArea.selectionStart;
        this.properties.end = textArea.selectionEnd;
      });

      element.addEventListener("keypress", key => {
        if (key.which === 13) keyPress(document.querySelector('.btn-enter'));
        if (key.which === 32) keyPress(document.querySelector('.btn-space'));

        for (let effect of this.elements.keys) {
          if (key.key === effect.textContent) keyPress(effect);
        }

        this.properties.value += key.key;
        this.open(element.value, currentValue => {
          if (this.properties.start > element.value.length) {
            element.value += currentValue.substring(currentValue.length - 1, currentValue.length);
          }
          else {
            element.value = element.value.substring(0, this.properties.start - 1)
              + currentValue.substring(this.properties.start - 1, this.properties.end)
              + element.value.substring(this.properties.end - 1, element.value.length);
          }
        });
        this.properties.start++;
        this.properties.end++;
      });
      element.addEventListener('keydown', key => {
        if (key.which === 37) {
          keyPress(document.querySelector('.btn-left'));
          this.properties.start--;
          this.properties.end--;
          if (this.properties.start < 0) this.properties.start = 0;
          if (this.properties.end < 0) this.properties.end = 0;
        }

        if (key.which === 39) {
          keyPress(document.querySelector('.btn-right'));
          this.properties.start++;
          this.properties.end++;
          if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
          if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
        }

        if (key.which === 8) {
          keyPress(document.querySelector('.btn-backspace'));
          textArea.focus();
          textArea.click();
          let delta = this.properties.end - this.properties.start;
          this.properties.end -= delta;

          if (this.properties.value.length === this.properties.start) {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
          } else {
            this.properties.value = this.properties.value.substring(0, this.properties.start - 1)
              + this.properties.value.substring(this.properties.end, this.properties.value.length);
          }

          textArea.focus();
        }

        if (key.which === 20) {
          document.querySelector('.caps').classList.toggle("keyboard__key--active");
          keyPress(document.querySelector('.caps'));
          this._toggleCapsLock();
        }

        if (key.which === 16) {
          this._toggleShift();
          keyPress(document.querySelector('.btn-shift'));
        }
      });
    });

  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayoutEn = [
      ['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], 'backspace',
      'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ['[', '{'], [']', '}'], ['\\', '|'],
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', [';', ':'], ['\'', '"'], 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', [',', '<'], ['.', '>'], ['/', '?'], 'shift2',
      'done', 'ru', 'space', 'mic', 'left', 'right'
    ];

    const keyLayoutRu = [
      'ё', ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], 'backspace',
      'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', ['\\', '/'],
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ['.', ','], 'shift2',
      'done', 'en', 'space', 'mic', 'left', 'right'
    ];

    let keyLayout;
    if (this.properties.lang) { keyLayout = keyLayoutEn; }
    else { keyLayout = keyLayoutRu; }


    if (this.properties.shift) {
      for (let i = 0; i < keyLayout.length; i++) {
        if (typeof keyLayout[i] !== 'string') keyLayout[i].reverse();
      }
    }

    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    }

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'ru':
          keyElement.classList.add('btn-language');
          keyElement.innerHTML = 'EN';

          keyElement.addEventListener('click', () => {
            this.properties.lang = !this.properties.lang;
            while (this.elements.keyContainer.children.length > 0) {
              this.elements.keyContainer.children[0].remove();
            }
            this.elements.keyContainer.appendChild(this._createKeys());
            this.elements.keys = this.elements.keyContainer.querySelectorAll(".keyboard__key");

            textArea.focus();
          });

          break;

        case 'en':
          keyElement.classList.add('btn-language');
          keyElement.innerHTML = 'RU';

          keyElement.addEventListener('click', () => {
            this.properties.lang = !this.properties.lang;
            while (this.elements.keyContainer.children.length > 0) {
              this.elements.keyContainer.children[0].remove();
            }
            this.elements.keyContainer.appendChild(this._createKeys());
            this.elements.keys = this.elements.keyContainer.querySelectorAll(".keyboard__key");

            textArea.focus();
          });

          break;

        case 'mic':
          keyElement.classList.add('btn-mic');
          keyElement.innerHTML = createIconHTML('mic_none');

          keyElement.addEventListener('click', () => {
            this.properties.record = !this.properties.record;

            if (this.properties.record === true) {
              keyElement.innerHTML = createIconHTML('mic');
            } else {
              keyElement.innerHTML = createIconHTML('mic_none');
            }

            if (this.properties.language) rec.lang = "en-US";
            else rec.lang = "ru-RU";
            if (this.properties.record) {
              rec.addEventListener("result", this.speech);
              rec.start();
            }
            else {
              rec.removeEventListener("result", this.speech);
              rec.stop();
            }

            textArea.focus();

            let ev = new Event('input');
            document.querySelector('#cases-search').dispatchEvent(ev);
          });

          break;

        case 'backspace':
          keyElement.classList.add('btn-backspace');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            if (this.properties.value.length === this.properties.start) {
              this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            } else {
              this.properties.value = this.properties.value.substring(0, this.properties.start - 1)
                + this.properties.value.substring(this.properties.end, this.properties.value.length);
            }
            this._triggerEvent('oninput');

            this.properties.start--;
            this.properties.end--;
            if (this.properties.start < 0) this.properties.start = 0;
            if (this.properties.end < 0) this.properties.end = 0;

            textArea.focus();
            textArea.setSelectionRange(this.properties.start, this.properties.end);

            let ev = new Event('input');
            document.querySelector('#cases-search').dispatchEvent(ev);
          });

          break;

        case 'shift':
          keyElement.classList.add('btn-shift', 'keyboard__key--left', 'keyboard__key--activatable');
          if (this.properties.shift) keyElement.classList.add('keyboard__key--active');
          keyElement.innerHTML = createIconHTML('arrow_upward');

          keyElement.addEventListener('click', () => {
            this._toggleShift();
            textArea.focus();
          });

          break;

        case 'shift2':
          keyElement.classList.add('btn-shift-disabled', 'keyboard__key--right');
          keyElement.innerHTML = createIconHTML('arrow_upward');

          break;

        case 'tab':
          keyElement.classList.add('disabled');
          keyElement.innerHTML = createIconHTML('sync_alt');

          break;

        case 'left':
          keyElement.classList.add('btn-left');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');

          keyElement.addEventListener('click', () => {
            this.properties.start--;
            this.properties.end--;

            if (this.properties.start < 0) this.properties.start = 0;
            if (this.properties.end < 0) this.properties.end = 0;
            this.properties.start = this.properties.end;
            textArea.setSelectionRange(this.properties.start, this.properties.end);

            textArea.focus();
          });

          break;

        case 'right':
          keyElement.classList.add('btn-right');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');

          keyElement.addEventListener('click', () => {
            this.properties.start++;
            this.properties.end++;

            if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
            if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
            this.properties.start = this.properties.end;
            textArea.setSelectionRange(this.properties.start, this.properties.end);

            textArea.focus();
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--left', 'keyboard__key--activatable', 'caps');
          if (this.properties.capsLock) keyElement.classList.add('keyboard__key--active');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);

            textArea.focus();
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--shift-right', 'btn-enter');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.start)
              + "\n"
              + this.properties.value.substring(this.properties.end, this.properties.value.length);

            let delta = this.properties.end - this.properties.start;
            if (delta > 0) {
              this.properties.end -= delta;
            }

            this.properties.start++;
            this.properties.end++;
            this._triggerEvent("oninput");
            textArea.focus();
            textArea.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case 'space':
          keyElement.classList.add('btn-space');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');

            this.properties.start++;
            this.properties.end++;

            textArea.focus();
            textArea.setSelectionRange(this.properties.start, this.properties.end);

            let ev = new Event('input');
            document.querySelector('#cases-search').dispatchEvent(ev);
          });

          break;

        case 'done':
          keyElement.classList.add('btn-done', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        default:
          if (typeof key === 'string') {
            if (this.properties.capsLock && this.properties.shift) {
              keyElement.textContent = key.toLowerCase();
            } else if (this.properties.capsLock || this.properties.shift) {
              keyElement.textContent = key.toUpperCase();
            } else {
              keyElement.textContent = key.toLowerCase();
            }
          }
          if (typeof key !== 'string') keyElement.textContent = key[0];

          keyElement.addEventListener('click', () => {

            let symbol = key;
            if (typeof symbol !== 'string') symbol = symbol[0];

            if (this.properties.capsLock || this.properties.shift) symbol = symbol.toUpperCase();
            else symbol = symbol.toLowerCase();
            if (this.properties.capsLock && this.properties.shift) symbol = symbol.toLowerCase();

            this.properties.value = this.properties.value.substring(0, this.properties.start)
              + symbol
              + this.properties.value.substring(this.properties.end, this.properties.value.length);

            let delta = this.properties.end - this.properties.start;
            if (delta > 0) {
              this.properties.end -= delta;
            }

            this.properties.start++;
            this.properties.end++;

            this._triggerEvent('oninput');

            textArea.focus();
            textArea.setSelectionRange(this.properties.start, this.properties.end);

            let ev = new Event('input');
            document.querySelector('#cases-search').dispatchEvent(ev);
          });

          break;
      }

      fragment.appendChild(keyElement);
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    if (this.properties.shift) {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.innerHTML !== 'EN' && key.innerHTML !== 'RU') {
          key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
        }
      }
    } else {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.innerHTML !== 'EN' && key.innerHTML !== 'RU') {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    while (this.elements.keyContainer.children.length > 0) {
      this.elements.keyContainer.children[0].remove();
    }
    this.elements.keyContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keyContainer.querySelectorAll(".keyboard__key");

    if (this.properties.capsLock) {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.innerHTML !== 'EN' && key.innerHTML !== 'RU') {
          key.textContent = this.properties.shift ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
        }
      }
    } else {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.innerHTML !== 'EN' && key.innerHTML !== 'RU') {
          key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden')
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');

  },
};

window.addEventListener('DOMContentLoaded', function () {
  KeyBoard.init();
});

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = new SpeechRecognition();
rec.interimResults = true;
rec.continuous = true;
