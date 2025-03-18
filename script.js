geotab.addin.panicButton = function(api, state) {
    let monitorActive = false;

    // Configuración del sonido
    const mp3Url = 'https://botondepanico.github.io/geotab-panic-button-addin/alerta.mp3';
    const sound = new Audio(mp3Url);

    // Función para iniciar la monitorización
    function startMonitoring() {
        if (monitorActive) return;
        monitorActive = true;

        const ruleId = "ayea8WF-hs0-qbkVvGb7FBw"; // ID de la regla en Geotab

        async function checkPanicButtonRule() {
            try {
                // Buscar eventos en el último minuto
                const response = await api.call("Get", {
                    typeName: "ExceptionEvent",
                    search: {
                        ruleSearch: { id: ruleId },
                        fromDate: new Date(Date.now() - 60000).toISOString()
                    }
                });

                console.log("Respuesta de la API:", response);

                if (response.length > 0) {
                    triggerAlert();
                } else {
                    updateStatus("Sin activación del botón de pánico.", "#01257D");
                }
            } catch (error) {
                console.error("Error en monitoreo:", error);
            } finally {
                setTimeout(checkPanicButtonRule, 10000);
            }
        }

        checkPanicButtonRule();
    }

    // Activar alerta visual y sonora
    function triggerAlert() {
        updateStatus("¡Alerta de botón de pánico activada!", "red");

        // Iniciar sonido con interacción del usuario
        document.body.addEventListener("click", () => sound.play(), { once: true });

        // Reproducir sonido si ya hay interacción previa
        sound.play().catch(err => console.error("No se pudo reproducir alerta", err));
    }

    // Actualizar estado en pantalla
    function updateStatus(message, color) {
        const statusElement = document.getElementById("status");
        if (statusElement) {
            statusElement.innerText = message;
            statusElement.style.color = color;
        }
    }

    // Iniciar la monitorización cuando se cargue el add-in
    state.setState({ isActive: true });
    startMonitoring();
};
