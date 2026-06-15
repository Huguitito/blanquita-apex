const button = document.getElementById("callButton");
const statusText = document.getElementById("status");
const transcript = document.getElementById("transcript");
const orb = document.getElementById("orb");

let active = false;
let retellClient = null;

function agregarMensaje(texto, clase = "message") {

```
if (!texto) return;

const div = document.createElement("div");

div.className = clase;

div.innerText = texto;

transcript.appendChild(div);

transcript.scrollTop = transcript.scrollHeight;
```

}

button.addEventListener("click", async () => {

```
if (!active) {

    try {

        active = true;

        button.innerText = "Finalizar consulta";

        statusText.innerText =
            "Conectando con Blanquita...";

        transcript.innerHTML = "";

        const response =
            await fetch("/api/create-web-call");

        const data =
            await response.json();

        retellClient =
            new window.RetellSDK.RetellWebClient();

        retellClient.on("call_started", () => {

            statusText.innerText =
                "Conversación activa";

            agregarMensaje(
                "Conversación iniciada",
                "message ai"
            );

        });

        retellClient.on("call_ended", () => {

            finalizar();

        });

        retellClient.on("agent_start_talking", () => {

            orb.classList.remove("user");

            orb.classList.add("agent");

            statusText.innerText =
                "Blanquita está hablando...";

        });

        retellClient.on("agent_stop_talking", () => {

            orb.classList.remove("agent");

            statusText.innerText =
                "Escuchando...";

        });

        retellClient.on("update", (update) => {

            console.log(update);

            try {

                if (typeof update === "string") {

                    agregarMensaje(update);

                    return;
                }

                if (update?.transcript) {

                    agregarMensaje(
                        typeof update.transcript === "string"
                            ? update.transcript
                            : JSON.stringify(update.transcript)
                    );

                    return;
                }

                if (update?.text) {

                    agregarMensaje(update.text);

                    return;
                }

                if (update?.content) {

                    agregarMensaje(update.content);

                    return;
                }

                if (update?.message) {

                    agregarMensaje(update.message);

                    return;
                }

                if (update?.utterance) {

                    agregarMensaje(update.utterance);

                    return;
                }

                if (Array.isArray(update?.messages)) {

                    update.messages.forEach(msg => {

                        agregarMensaje(
                            msg.content ||
                            msg.text ||
                            JSON.stringify(msg)
                        );

                    });

                    return;
                }

            } catch (err) {

                console.error(err);

            }

        });

        await retellClient.startCall({

            accessToken:
                data.access_token

        });

    } catch (error) {

        console.error(error);

        statusText.innerText =
            "Error de conexión";

        active = false;

        button.innerText =
            "Iniciar consulta";
    }

} else {

    if (retellClient) {

        retellClient.stopCall();

    }

    finalizar();

}
```

});

function finalizar() {

```
active = false;

button.innerText =
    "Iniciar consulta";

statusText.innerText =
    "Consulta finalizada";

orb.classList.remove("agent");

orb.classList.remove("user");

setTimeout(() => {

    transcript.innerHTML = `
        <div class="placeholder">
            La conversación aparecerá aquí.
        </div>
    `;

    statusText.innerText =
        "Presione el botón para comenzar";

}, 10000);
```

}
