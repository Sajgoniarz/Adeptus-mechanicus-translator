let popup;

const BinUtf8Translator = {
    toUtf8: binaryInput => {
        var i = 0, l = binaryInput.length, chr, out = '';
        for (; i < l; i += 9) {
            chr = parseInt(binaryInput.substr(i, 9), 2).toString(16);
            out += decodeURIComponent('%' + ((chr.length % 2 == 0) ? chr : '0' + chr));
        }
        return out;
    },
    toBin: textInput => {
        var s = unescape(encodeURIComponent(textInput));
        var chr, i = 0, l = s.length, out = '';
        for (; i < l; i++) {
            chr = s.charCodeAt(i).toString(2);
            while (chr.length % 8 != 0) { chr = '0' + chr; }
            out += chr + ' ';
        }
        return out.trim();
    }
};

const buildTranslationPopup = () =>
    fetch(chrome.extension.getURL('/popup.html'))
        .then(response => response.text())
        .then(data => {
            let popup = document.createElement("div");
            popup.className = "ad-mech-window";
            popup.style.top = "calc(" + window.pageYOffset + "px + 10vh)";
            popup.style.right = "calc(" + window.pageXOffset + "px + 2vw)";
            popup.innerHTML = data;

            return popup;
        });

const displayTranslationPopup = translation =>
    buildTranslationPopup()
        .then(newPopup => {
            document.body.appendChild(newPopup);
            document.getElementById("ad-mech-translation").innerText = translation;
            popup = newPopup;
        });

const addHandlersToPopup = () =>
    document.getElementById("ad-mech-close").addEventListener("click", function () {
        document.body.removeChild(popup);
        popup = null;
    });

const removeCurrentPopupIfDisplaying = () =>
    popup && document.body.removeChild(popup);

const copyToClipboard = translation => {
    const el = document.createElement('textarea');
    el.className
    el.value = translation;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const actionHandler = message => {
    const translatorInput = window.getSelection().toString();
    let translation = '';
    switch (message.action) {
        case "translateToUtf":
            removeCurrentPopupIfDisplaying();
            translation = BinUtf8Translator.toUtf8(translatorInput);
            displayTranslationPopup(translation)
                .then(addHandlersToPopup);
            break;
        case "translateToBinary":
            translation = BinUtf8Translator.toBin(translatorInput);
            copyToClipboard(translation);
    }
}

chrome.extension.onMessage.addListener(actionHandler);