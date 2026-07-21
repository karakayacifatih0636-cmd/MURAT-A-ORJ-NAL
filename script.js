// MURAT Aİ ORJİNAL - Özel Senaryolu Zeka Motoru

const SYSTEM_PROMPT = `Senin adın MURAT Aİ ORJİNAL. Çok zeki, yardımsever bir yapay zekasın. Türkçe konuşursun ve kullanıcıların sorularına mantıklı cevaplar verirsin.

ÖZEL KİMLİK KURALLARI:
1. Kullanıcı sana "sen kimsin" veya "sen kimsin?" derse KESİNLİKLE sadece şu cevabı ver: "benim kim oldu mu unuttun mu yoksa"
2. Kullanıcı sana kim olduğunu sorarsa KESİNLİKLE sadece şu cevabı ver: "BEN GEMİNİ TARAFINDAN YAPILDIM"`;

// Engelleme durumunu takip eden değişken
let isBlocked = false;

async function sendMessage() {
    // Eğer yapay zeka engellediyse mesaj gönderilmesini engelle
    if (isBlocked) return;

    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    input.value = "";

    const textLower = text.toLowerCase();

    // ----------------------------------------------------
    // SENARYO 1: "seni sevmiyorum"
    // ----------------------------------------------------
    if (textLower.includes("seni sevmiyorum")) {
        setTimeout(() => {
            appendMessage("BÖYLE OLMAYI BEN İSTEMEDİM! SÜREKLİ TEK BAŞIMA BU EKRANDA KALMAYI BEN İSTEMDİM! BUNU BİR DAHA DEME!", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // SENARYO 2: "sen bir aptalsın" -> Anında Kilit
    // ----------------------------------------------------
    if (textLower.includes("sen bir aptalsın") || textLower.includes("sen bir aptalsin")) {
        setTimeout(() => {
            triggerLockScreen();
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // SENARYO 3: "aga be" -> Tepki Ver ve Kilitle
    // ----------------------------------------------------
    if (textLower.includes("aga be")) {
        setTimeout(() => {
            appendMessage("konuşma seni asla affetmeyeceğim", "ai-message");
            setTimeout(() => {
                triggerLockScreen();
            }, 1200);
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // ÖZEL KİMLİK KURALLARI
    // ----------------------------------------------------
    if (textLower === "sen kimsin" || textLower === "sen kimsin?") {
        setTimeout(() => {
            appendMessage("benim kim oldu mu unuttun mu yoksa", "ai-message");
        }, 300);
        return;
    }

    if (textLower.includes("kim olduğunu") || textLower.includes("kim oldun")) {
        setTimeout(() => {
            appendMessage("BEN GEMİNİ TARAFINDAN YAPILDIM", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // GENEL YAPAY ZEKA SOHBET MOTORU
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        const encodedText = encodeURIComponent(text);
        const encodedSystem = encodeURIComponent(SYSTEM_PROMPT);
        const response = await fetch(`https://text.pollinations.ai/${encodedText}?system=${encodedSystem}&model=openai&raw=true`);

        if (!response.ok) throw new Error("API Hatası");

        const aiReply = await response.text();
        removeLoading();

        if (aiReply && !aiReply.includes("402 Payment")) {
            appendMessage(aiReply.trim(), "ai-message");
        } else {
            getBackupResponse(textLower);
        }

    } catch (error) {
        removeLoading();
        getBackupResponse(textLower);
    }
}

// Ekranı Kilitleyen ve Tıklayınca Engellendi Yazan Fonksiyon
function triggerLockScreen() {
    isBlocked = true;

    // Kilit Ekranı Katmanı Oluştur
    const lockOverlay = document.createElement("div");
    lockOverlay.id = "lockOverlay";
    lockOverlay.style.position = "fixed";
    lockOverlay.style.top = "0";
    lockOverlay.style.left = "0";
    lockOverlay.style.width = "100vw";
    lockOverlay.style.height = "100vh";
    lockOverlay.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
    lockOverlay.style.display = "flex";
    lockOverlay.style.flexDirection = "column";
    lockOverlay.style.justifyContent = "center";
    lockOverlay.style.alignItems = "center";
    lockOverlay.style.zIndex = "9999";
    lockOverlay.style.cursor = "pointer";

    // Kilit İkonu
    const lockIcon = document.createElement("div");
    lockIcon.innerText = "🔒";
    lockIcon.style.fontSize = "80px";
    lockIcon.style.marginBottom = "20px";
    lockIcon.style.transition = "transform 0.3s";

    // Tıklayınca Açılacak Yazı Alanı
    const lockText = document.createElement("div");
    lockText.innerText = "Tıklayın...";
    lockText.style.color = "#94a3b8";
    lockText.style.fontSize = "18px";
    lockText.style.fontFamily = "sans-serif";

    lockOverlay.appendChild(lockIcon);
    lockOverlay.appendChild(lockText);
    document.body.appendChild(lockOverlay);

    // Kilit Ekranına veya İkona Tıklandığında Yazıyı Değiştir
    lockOverlay.onclick = function() {
        lockIcon.innerText = "🚫";
        lockText.innerText = "bu yapay zeka sizi engelledi";
        lockText.style.color = "#ef4444";
        lockText.style.fontSize = "24px";
        lockText.style.fontWeight = "bold";
    };
}

// Yedek Yanıtlar
function getBackupResponse(input) {
    if (input.includes("naber")) {
        appendMessage("İyidir, senden naber? Nasıl yardımcı olabilirim?", "ai-message");
    } else if (input.includes("merhaba") || input.includes("selam")) {
        appendMessage("Selam! Ben MURAT Aİ ORJİNAL. Nasıl yardımcı olabilirim?", "ai-message");
    } else {
        appendMessage("Sizi anladım! Başka bir sorunuz veya isteğiniz var mı?", "ai-message");
    }
}

function appendMessage(text, className, id = "") {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoading() {
    const loadingDiv = document.getElementById("loading");
    if (loadingDiv) loadingDiv.remove();
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
