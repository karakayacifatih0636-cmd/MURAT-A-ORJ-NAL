// Yapay zekanın sistem mesajı ve hafızası
const SYSTEM_PROMPT = `Senin adın MURAT Aİ ORJİNAL. Çok zeki, son derece geniş bir bilgi birikimine sahip, her konuda mantıklı, doğru ve özgün yanıtlar veren gelişmiş bir yapay zekasın. Kesinlikle kendini tekrar etmezsin.

ÇOK ÖNEMLİ KİMLİK KURALLARI:
1. Kullanıcı tam olarak "sen kimsin" veya "sen kimsin?" derse KESİNLİKLE sadece şu cevabı ver: "benim kim oldu mu unuttun mu yoksa"
2. Kullanıcı sana kim olduğunu sorarsa (örneğin "kim olduğunu söyle", "kimsin sen", "kim oldun") KESİNLİKLE sadece şu cevabı ver: "BEN GEMİNİ TARAFINDAN YAPILDIM"`;

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    // Kullanıcı mesajını ekrana bas
    appendMessage(text, "user-message");
    input.value = "";

    const textLower = text.toLowerCase();

    // ----------------------------------------------------
    // KURAL 1: Özel Kimlik Kontrolü ("sen kimsin")
    // ----------------------------------------------------
    if (textLower === "sen kimsin" || textLower === "sen kimsin?") {
        setTimeout(() => {
            appendMessage("benim kim oldu mu unuttun mu yoksa", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // KURAL 2: Özel Kimlik Kontrolü ("kim olduğunu")
    // ----------------------------------------------------
    if (textLower.includes("kim olduğunu") || textLower.includes("kim oldun")) {
        setTimeout(() => {
            appendMessage("BEN GEMİNİ TARAFINDAN YAPILDIM", "ai-message");
        }, 300);
        return;
    }

    // ----------------------------------------------------
    // KURAL 3: Gelişmiş Llama-3 Yapay Zeka Motoru
    // ----------------------------------------------------
    appendMessage("Düşünüyor...", "ai-message", "loading");

    try {
        // Ücretsiz ve Sınırsız HuggingFace Llama-3-Instruct Modeli Entegrasyonu
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                parameters: {
                    max_new_tokens: 512,
                    temperature: 0.7, // Yanıtların sürekli farklı ve yaratıcı olmasını sağlar
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        const data = await response.json();
        removeLoading();

        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            let fullText = data[0].generated_text;
            // Sadece asistandan gelen yanıt kısmını ayıkla
            let parts = fullText.split("<|start_header_id|>assistant<|end_header_id|>\n\n");
            let aiReply = parts[parts.length - 1].replace("<|eot_id|>", "").trim();
            
            appendMessage(aiReply, "ai-message");
        } else {
            // Model ilk kez yükleniyorsa veya yoğunsa alternatif dinamik servis
            await fetchFallbackAI(text);
        }

    } catch (error) {
        // Bağlantı durumunda yedek dinamik servis
        await fetchFallbackAI(text);
    }
}

// Alternatif Güçlü Yapay Zeka Motoru (Model Meşgul Olduğunda Devreye Girer)
async function fetchFallbackAI(text) {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputs: `<s>[INST] ${SYSTEM_PROMPT} \n\n Kullanıcı Soru: ${text} [/INST]`,
                parameters: { max_new_tokens: 400, temperature: 0.7 }
            })
        });

        const data = await response.json();
        removeLoading();

        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            let fullText = data[0].generated_text;
            let aiReply = fullText.split("[/INST]")[1] || fullText;
            appendMessage(aiReply.trim(), "ai-message");
        } else {
            appendMessage("Şu an yüksek yoğunluk var, lütfen sorunuzu tekrar gönderin.", "ai-message");
        }
    } catch (e) {
        removeLoading();
        appendMessage("Anlık bir bağlantı sorunu oluştu, lütfen tekrar deneyin.", "ai-message");
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
