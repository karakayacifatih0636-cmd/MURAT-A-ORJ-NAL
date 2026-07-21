const API_KEY = "YOUR_OPENAI_API_KEY"; // Buraya OpenAI API anahtarınızı girin

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    input.value = "";

    const textLower = text.toLowerCase();

    // Özel Kural 1: "Sen kimsin?" sorusu
    if (textLower.includes("sen kimsin")) {
        setTimeout(() => {
            appendMessage("benim kim oldu mu unuttun mu yoksa", "ai-message");
        }, 500);
        return;
    }

    // Özel Kural 2: "Kim olduğunu" veya "Kimsin" detaylı soruları
    if (textLower.includes("kim olduğunu") || textLower.includes("kim oldun")) {
        setTimeout(() => {
            appendMessage("BEN GEMİNİ TARAFINDAN YAPILDIM", "ai-message");
        }, 500);
        return;
    }

    // Görsel Oluşturma İsteği mi?
    if (textLower.includes("görsel") || textLower.includes("resim") || textLower.includes("çiz")) {
        appendMessage("Görseliniz hazırlanıyor, lütfen bekleyin...", "ai-message");
        const encodedPrompt = encodeURIComponent(text);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;
        
        setTimeout(() => {
            appendMediaMessage(imageUrl, "image");
        }, 1000);
        return;
    }

    // Video Oluşturma İsteği mi?
    if (textLower.includes("video")) {
        appendMessage("Videonuz işleniyor, bu işlem birkaç saniye sürebilir...", "ai-message");
        const encodedPrompt = encodeURIComponent(text);
        const videoUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&model=video`;
        
        setTimeout(() => {
            appendMediaMessage(videoUrl, "video");
        }, 1500);
        return;
    }

    // Genel Sorular için ChatGPT API Çağrısı
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Senin adın MURAT Aİ ORJİNAL. Kullanıcının tüm sorularına net, zeki ve yardımsever bir şekilde cevap ver."
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        removeLoading();

        if (data.choices && data.choices[0]) {
            appendMessage(data.choices[0].message.content, "ai-message");
        } else {
            appendMessage("Üzgünüm, şu anda yanıt oluşturamıyorum. API anahtarınızı kontrol edin.", "ai-message");
        }
    } catch (error) {
        removeLoading();
        appendMessage("Bir hata oluştu. Lütfen tekrar deneyin.", "ai-message");
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

function appendMediaMessage(url, type) {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.className = "message ai-message";

    if (type === "image") {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Üretilen Görsel";
        msgDiv.appendChild(img);
    } else if (type === "video") {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.autoplay = true;
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
