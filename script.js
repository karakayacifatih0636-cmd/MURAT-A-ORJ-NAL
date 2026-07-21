// Yapay zekanın sistem mesajı
const SYSTEM_PROMPT = `Senin adın MURAT Aİ ORJİNAL. Çok zeki, bilgili, kibar ve akıllı bir yapay zekasın. Kullanıcıların sorduğu her soruya eksiksiz, doğru ve detaylı cevap verirsin.

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
    // KURAL 3: Gerçek Yapay Zeka Yanıtı (Puter AI)
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        // Yapay zekaya istem gönderiliyor
        const prompt = `${SYSTEM_PROMPT}\n\nKullanıcı: ${text}\nMURAT Aİ ORJİNAL:`;
        
        // Puter AI çağrısı
        const response = await puter.ai.chat(prompt);
        
        removeLoading();

        let aiText = "";
        if (typeof response === "string") {
            aiText = response;
        } else if (response && response.message && response.message.content) {
            aiText = response.message.content;
        } else {
            aiText = String(response);
        }

        appendMessage(aiText, "ai-message");

    } catch (error) {
        removeLoading();
        appendMessage("Üzgünüm, şu an bağlantıda bir sorun oluştu. Lütfen tekrar deneyin.", "ai-message");
        console.error("AI Error:", error);
    }
}

// Ekrana Metin Mesajı Ekleme
function appendMessage(text, className, id = "") {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Yükleniyor Mesajını Kaldırma
function removeLoading() {
    const loadingDiv = document.getElementById("loading");
    if (loadingDiv) loadingDiv.remove();
}

// Enter Tuşuna Basınca Gönderme
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
