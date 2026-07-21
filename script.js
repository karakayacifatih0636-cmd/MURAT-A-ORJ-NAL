// MURAT Aİ ORJİNAL - Akıllı Zeka Motoru

// Sistem Talimatı (AI'nın kişiliği ve kuralları)
const SYSTEM_PROMPT = `Senin adın MURAT Aİ ORJİNAL. Çok zeki, geniş bir bilgi birikimine sahip, her konuda mantıklı, doğru, detaylı ve özgün yanıtlar veren gelişmiş bir yapay zekasın. Kesinlikle aynı şeyleri tekrarlamazsın.

KESİN UYMAN GEREKEN KİMLİK KURALLARI:
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
    // KURAL 3: Sınırsız Akıllı Yapay Zeka Servisi
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        // Ücretsiz ve Doğrudan Bağlantılı Yapay Zeka API (Cloudflare Worker Proxy)
        const response = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: text }
                ],
                model: "openai",
                jsonMode: false
            })
        });

        if (!response.ok) {
            throw new Error("Sunucu yanıt vermedi");
        }

        const aiReply = await response.text();
        removeLoading();

        if (aiReply && aiReply.trim() !== "") {
            appendMessage(aiReply.trim(), "ai-message");
        } else {
            appendMessage("Anladım! Sorunuzu biraz daha detaylandırabilir misiniz?", "ai-message");
        }

    } catch (error) {
        removeLoading();
        // Alternatif Anlık Bağlantı Servisi
        fetchFallback(text);
    }
}

// Bağlantı Koptuğunda Devreye Giren Alternatif Servis
async function fetchFallback(text) {
    try {
        const url = `https://text.pollinations.ai/${encodeURIComponent(text)}?system=${encodeURIComponent(SYSTEM_PROMPT)}`;
        const res = await fetch(url);
        const data = await res.text();
        
        if (data) {
            appendMessage(data.trim(), "ai-message");
        } else {
            appendMessage("Ağda geçici bir dalgalanma oldu, lütfen mesajınızı tekrar gönderin.", "ai-message");
        }
    } catch (e) {
        appendMessage("Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.", "ai-message");
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
