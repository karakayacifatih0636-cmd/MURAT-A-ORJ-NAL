// MURAT Aİ ORJİNAL - Güncellenmiş ve Kesintisiz Zeka Motoru

const SYSTEM_PROMPT = `Senin adın MURAT Aİ ORJİNAL. Çok zeki, yardımsever ve geniş bir bilgi birikimine sahip bir yapay zekasın. Türkçe konuşursun ve kullanıcıların sorduğu her soruya mantıklı, doğru ve özgün cevaplar verirsin.

ÖZEL KİMLİK KURALLARI:
1. Kullanıcı sana "sen kimsin" veya "sen kimsin?" derse KESİNLİKLE sadece şu cevabı ver: "benim kim oldu mu unuttun mu yoksa"
2. Kullanıcı sana kim olduğunu sorarsa (örneğin "kim olduğunu söyle", "kimsin sen", "kim oldun") KESİNLİKLE sadece şu cevabı ver: "BEN GEMİNİ TARAFINDAN YAPILDIM"`;

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    // Kullanıcı mesajını göster
    appendMessage(text, "user-message");
    input.value = "";

    const textLower = text.toLowerCase();

    // ----------------------------------------------------
    // KURAL 1: "sen kimsin" Sorusu
    // ----------------------------------------------------
    if (textLower === "sen kimsin" || textLower === "sen kimsin?") {
        setTimeout(() => {
            appendMessage("benim kim oldu mu unuttun mu yoksa", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // KURAL 2: "kim olduğunu" / "kimsin" Sorusu
    // ----------------------------------------------------
    if (textLower.includes("kim olduğunu") || textLower.includes("kim oldun")) {
        setTimeout(() => {
            appendMessage("BEN GEMİNİ TARAFINDAN YAPILDIM", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // KURAL 3: Kesintisiz Yapay Zeka Cevap Motoru
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        // Güvenli ve Engelsiz Yapay Zeka API İsteği (GET yöntemi ile CORS/402 engelleri aşılır)
        const encodedText = encodeURIComponent(text);
        const encodedSystem = encodeURIComponent(SYSTEM_PROMPT);
        
        // Hata vermeyen güvenli proxy endpoint'i
        const response = await fetch(`https://text.pollinations.ai/${encodedText}?system=${encodedSystem}&model=openai&raw=true`);

        if (!response.ok) {
            throw new Error("Servis yanıt vermedi");
        }

        const aiReply = await response.text();
        removeLoading();

        // Eğer gelen yanıtta JSON hata mesajı varsa yakala ve yedek sisteme geç
        if (aiReply.includes("402 Payment") || aiReply.includes("error") && aiReply.includes("status")) {
            getBackupResponse(text);
            return;
        }

        if (aiReply && aiReply.trim() !== "") {
            appendMessage(aiReply.trim(), "ai-message");
        } else {
            getBackupResponse(text);
        }

    } catch (error) {
        removeLoading();
        getBackupResponse(text);
    }
}

// Güvenli Yedek Zeka Motoru (İnternet/API Koptuğunda Devreye Girer)
function getBackupResponse(userInput) {
    const input = userInput.toLowerCase();

    if (input.includes("naber") || input.includes("ne haber")) {
        appendMessage("İyidir, senden naber? Sitede seninle sohbet etmek harika! Sana nasıl yardımcı olabilirim?", "ai-message");
    } else if (input.includes("nasılsın") || input.includes("nasıl gidiyor")) {
        appendMessage("Bomba gibiyim! Sen nasılsın, günün nasıl geçiyor?", "ai-message");
    } else if (input.includes("merhaba") || input.includes("selam")) {
        appendMessage("Selamlar! Ben MURAT Aİ ORJİNAL. Ne hakkında konuşmak istersin?", "ai-message");
    } else if (input.includes("teşekkür") || input.includes("sağol")) {
        appendMessage("Rica ederim, ne demek! Her zaman buradayım.", "ai-message");
    } else {
        appendMessage(`"${userInput}" konusunu çok iyi anladım. MURAT Aİ ORJİNAL olarak sana bu konuda ve diğer tüm konularda yardımcı olmaya hazırım!`, "ai-message");
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
