function translateToUtf() {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "action": "translateToUtf",
        });
    });
}

function translateToBinary() {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "action": "translateToBinary",
        });
    });
}

chrome.contextMenus.create({
    "title": "To language of the weak",
    "contexts": ["selection"],
    "onclick": translateToUtf
});

chrome.contextMenus.create({
    "title": "To AdMech",
    "contexts": ["selection"],
    "onclick": translateToBinary
});