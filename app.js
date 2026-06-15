const button = document.getElementById("callButton");
const statusText = document.getElementById("status");
const transcript = document.getElementById("transcript");
const orb = document.getElementById("orb");

let active = false;
let retellClient = null;

button.addEventListener("click", async () => {

    if (!active) {

        try {

            active = true;

            button.innerText = "Finalizar consulta";
            statusText.innerText = "Conectando con Blanquita...";

            const response = await fetch("/api/create-web-call");
            const data = await response.json();

            console.log("SDK:", window.RetellSDK);

            retellClient =
                new window.RetellSDK.RetellWebClient();

            retellClient.on("call_started", () => {

                statusText.innerText =
                    "Conversación activa";

            });

            retellClient.on("call_ended", () => {

                finalizar();

            });

            retellClient.on("agent_start_talking", () => {

                orb.classList.add("talking");

                statusText.innerText =
                    "Blanquita está hablando...";

            });

            retellClient.on("agent_stop_talking", () => {

                orb.classList.remove("talking");

                statusText.innerText =
                    "Escuchando...";

            });

            retellClient.on("update", (update) => {

                console.log(update);

            });

            await retellClient.startCall({
                accessToken: data.access_token
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

});

function finalizar() {

    active = false;

    button.innerText =
        "Iniciar consulta";

    statusText.innerText =
        "Consulta finalizada";

    orb.classList.remove("talking");

    setTimeout(() => {

        transcript.innerHTML = "";

        statusText.innerText =
            "Presione el botón para comenzar";

    }, 10000);

}
