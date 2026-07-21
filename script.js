// OpenAI API Anahtarınızı Buraya Ekleyin (Opsiyonel: Ücretsiz yanıtlar için varsayılan fallback kullanılır)
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; 

// Yapay zekanın hafızası (Sohbet geçmişi ve Sistem Zekası)
let conversationHistory = [
    {
        role: "system",
        content: `Senin adın MURAT Aİ ORJİNAL. Çok zeki, yardımsever, yaratıcı ve geniş bir bilgi birikimine sahip bir yapay zekasın. Kullanıcıların sorularına çok iyi, açıklayıcı ve mantıklı yanıtlar verirsin. 
        
        KESİN UYULMASI GEREKEN KURALLAR:
        1. Kullanıcı sana "sen kimsin" veya "sen kimsin?" derse KESİNLİKLE sadece şu cevabı ver: "benim kim oldu mu unuttun mu yoksa"
        2. Kullanıcı sana kim olduğunu sorarsa (örneğin "kim olduğunu söyle", "kimsin sen", "kim oldun") KESİNLİKLE sadece şu cevabı ver: "BEN GEMİNİ TARAFINDAN YAPILDIM"`
    }
];

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    // Kullanıcı mesajını ekrana ekle
    appendMessage(text, "user-message");
    input.value = "";

    const textLower = text.toLowerCase();

    // ----------------------------------------------------
    // KURAL 1: Özel Kimlik Tanımlamaları
    // ----------------------------------------------------
    if (textLower === "sen kimsin" || textLower === "sen kimsin?") {
        setTimeout(() => {
            appendMessage("benim kim oldu mu unuttun mu yoksa", "ai-message");
        }, 300);
        return;
    }

    if (textLower.includes("kim olduğunu") || textLower.includes("kim oldun") || textLower.includes("kimsin")) {
        setTimeout(() => {
            appendMessage("BEN GEMİNİ TARAFINDAN YAPILDIM", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // KURAL 2: Video Oluşturma Motoru
    // ----------------------------------------------------
    if (textLower.includes("video") || textLower.includes("animasyon") || textLower.includes("hareketlendir")) {
        appendMessage("🎬 Videonuz oluşturuluyor ve işleniyor, lütfen bekleyin...", "ai-message", "loading");
        
        // Komut metnini temizleyip video için varsayılan bir prompt oluşturma
        const cleanPrompt = encodeURIComponent(text.replace(/video|yap|oluştur|çek|animasyon/gi, "").trim() || text);
        const videoUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=450&model=video&nologo=true`;

        setTimeout(() => {
            removeLoading();
            appendMediaMessage(videoUrl, "video", text);
        }, 2000);
        return;
    }

    // ----------------------------------------------------
    // KURAL 3: Görsel / Resim Oluşturma Motoru
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // KURAL 4: Genel Zeka ve Sohbet Motoru (Hafızalı)
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    // Kullanıcının mesajını hafızaya ekle
    conversationHistory.push({ role: "user", content: text });

    try {
        let aiResponseText = "";

        // API Key tanımlıysa GPT API'sini çağır
        if (OPENAI_API_KEY && OPENAI_API_KEY !== "YOUR_OPENAI_API_KEY") {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: conversationHistory
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                aiResponseText = data.choices[0].message.content;
            } else {
                aiResponseText = "Bir hata oluştu, yanıt alınamadı.";
            }
        } else {
            // API Key girilmediyse dahili akıllı ücretsiz motor (Pollinations Chat) kullan
            const response = await fetch("https://text.pollinations.ai/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: conversationHistory,
                    model: "openai"
                })
            });

            aiResponseText = await response.text();
        }

        removeLoading();
        
        // Yanıtı hafızaya ekle ve ekrana yazdır
        conversationHistory.push({ role: "assistant", content: aiResponseText });
        appendMessage(aiResponseText, "ai-message");

    } catch (error) {
        removeLoading();
        appendMessage("Üzgünüm, bir bağlantı hatası oluştu. Lütfen tekrar deneyin.", "ai-message");
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

// Ekrana Video veya Görsel Ekleme
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
