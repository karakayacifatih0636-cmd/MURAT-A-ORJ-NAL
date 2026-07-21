// Yapay zekanın hafızası
let conversationHistory = [
    {
        role: "system",
        content: `Senin adın MURAT Aİ ORJİNAL. Çok zeki, yardımsever, yaratıcı bir yapay zekasın. 
        
        KESİN UYULMASI GEREKEN KURALLAR:
        1. Kullanıcı sana "sen kimsin" veya "sen kimsin?" derse KESİNLİKLE sadece şu cevabı ver: "benim kim oldu mu unuttun mu yoksa"
        2. Kullanıcı sana kim olduğunu sorarsa (örneğin "kim olduğunu söyle", "kimsin sen", "kim oldun") KESİNLİKLE sadece şu cevabı ver: "BEN GEMİNİ TARAFINDAN YAPILDIM"`
    }
];

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    input.value = "";

    const textLower = text.toLowerCase();

    // 1. Özel Kimlik Kuralları
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

    // 2. Video Oluşturma
    if (textLower.includes("video") || textLower.includes("animasyon") || textLower.includes("hareketlendir")) {
        appendMessage("🎬 Videonuz hazırlanıyor...", "ai-message", "loading");
        const cleanPrompt = encodeURIComponent(text.replace(/video|yap|oluştur|çek|animasyon/gi, "").trim() || text);
        const videoUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=450&model=video&nologo=true`;

        setTimeout(() => {
            removeLoading();
            appendMediaMessage(videoUrl, "video", text);
        }, 2000);
        return;
    }

    // 3. Görsel / Resim Oluşturma
    if (textLower.includes("görsel") || textLower.includes("resim") || textLower.includes("çiz") || textLower.includes("fotoğraf")) {
        appendMessage("🎨 Görseliniz çiziliyor...", "ai-message", "loading");
        const cleanPrompt = encodeURIComponent(text.replace(/görsel|resim|çiz|fotoğraf|oluştur/gi, "").trim() || text);
        const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=600&nologo=true`;

        setTimeout(() => {
            removeLoading();
            appendMediaMessage(imageUrl, "image", text);
        }, 1500);
        return;
    }

    // 4. Genel ÜCRETSİZ Akıllı Sohbet Motoru
    appendMessage("Düşünüyor...", "ai-message", "loading");
    conversationHistory.push({ role: "user", content: text });

    try {
        const response = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: conversationHistory,
                model: "openai"
            })
        });

        const aiResponseText = await response.text();
        removeLoading();
        
        conversationHistory.push({ role: "assistant", content: aiResponseText });
        appendMessage(aiResponseText, "ai-message");

    } catch (error) {
        removeLoading();
        appendMessage("Bir bağlantı hatası oluştu, lütfen tekrar deneyin.", "ai-message");
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

function appendMediaMessage(url, type, caption) {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.className = "message ai-message";

    const titleDiv = document.createElement("p");
    titleDiv.style.marginBottom = "8px";
    titleDiv.style.fontWeight = "bold";
    titleDiv.innerText = type === "video" ? `🎬 Hazırlanan Video: "${caption}"` : `🎨 Hazırlanan Görsel: "${caption}"`;
    msgDiv.appendChild(titleDiv);

    if (type === "image") {
        const img = document.createElement("img");
        img.src = url;
        img.alt = caption;
        msgDiv.appendChild(img);
    } else if (type === "video") {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        msgDiv.appendChild(video);
    }

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
