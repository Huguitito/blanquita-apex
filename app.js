const button = document.getElementById("callButton");
const statusText = document.getElementById("status");
const transcript = document.getElementById("transcript");

let active = false;

button.addEventListener("click", () => {

    if(!active){

        active = true;

        button.innerText = "Finalizar consulta";
        statusText.innerText = "Conectando con la recepcionista...";

        addMessage(
            "ai",
            "Hola, bienvenido a APEX Odontología. ¿En qué puedo ayudarlo?"
        );

    } else {

        active = false;

        button.innerText = "Iniciar consulta";
        statusText.innerText = "Consulta finalizada";

        setTimeout(() => {

            statusText.innerText =
                "Presione el botón para comenzar";

            transcript.innerHTML = "";

        },10000);

    }

});

function addMessage(type,text){

    const div = document.createElement("div");

    div.className = `message ${type}`;

    div.innerHTML = text;

    transcript.appendChild(div);

    transcript.scrollTop = transcript.scrollHeight;

}
