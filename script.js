// MURAT Aİ ORJİNAL - Güncel ve Ücretsiz Bağlantı Motoru

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
    // KURAL 2: "kim olduğunu" / "kimsin" Soruları
    // ----------------------------------------------------
    if (textLower.includes("kim olduğunu") || textLower.includes("kim oldun")) {
        setTimeout(() => {
            appendMessage("BEN GEMİNİ TARAFINDAN YAPILDIM", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // KURAL 3: Yapay Zeka Sohbet Motoru (HuggingFace Serverless)
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        const promptText = `<|system|>\nSenin adın MURAT Aİ ORJİNAL. Çok zeki, bilgili ve yardımsever bir yapay zekasın. Türkçe yanıt ver.\n<|user|>\n${text}\n<|assistant|>\n`;

        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: promptText,
                parameters: {
                    max_new_tokens: 250,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();
        removeLoading();

        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            let fullText = data[0].generated_text;
            let aiReply = fullText.split("<|assistant|>\n")[1] || fullText;
            appendMessage(aiReply.trim(), "ai-message");
        } else {
            // Sunucu yoğunluğu veya geçici durumlarda dahili zeka yanıtı
            appendMessage(getFallbackResponse(textLower), "ai-message");
        }

    } catch (error) {
        removeLoading();
        appendMessage(getFallbackResponse(textLower), "ai-message");
    }
}

// Yedek Yanıt Motoru (Bağlantı Sorunlarına Karşı)
function getFallbackResponse(input) {
    if (input.includes("merhaba") || input.includes("selam")) {
        return "Merhaba! Ben MURAT Aİ ORJİNAL. Bugün sana nasıl yardımcı olabilirim?";
    } else if (input.includes("nasılsın")) {
        return "İyiyim, teşekkür ederim! Sen nasılsın?";
    } else if (input.includes("teşekkür")) {
        return "Rica ederim, her zaman buradayım!";
    } else {
        return "Anladım. MURAT Aİ ORJİNAL olarak size yardımcı olmak için buradayım, başka bir şey sormak ister misiniz?";
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
