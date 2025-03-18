geotab.addin.panicButton = function(api, state) {
    let monitorActive = false;
    const ruleId = "ayea8WF-hs0-qbkVvGb7FBw"; // ID de la regla en Geotab
    const mp3Url = 'https://botondepanico.github.io/geotab-panic-button-addin/alerta.mp3';
    const sound = new Audio(mp3Url);

    // Iniciar la monitorización automáticamente
    function startMonitoring() {
        if (monitorActive) return; // Evitar múltiples ejecuciones
        monitorActive = true;

        async function checkPanicButtonRule() {
            try {
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
                setTimeout(checkPanicButtonRule, 10000); // Verificar cada 10 segundos
            }
        }

        checkPanicButtonRule();
    }

    // Activar alerta visual y sonora
    function triggerAlert() {
        updateStatus("¡Alerta de botón de pánico activada!", "red");

        // Iniciar sonido con interacción del usuario si es necesario
        document.body.addEventListener("click", () => sound.play(), { once: true });

        // Intentar reproducir el sonido inmediatamente
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

    // Se ejecuta al abrir el add-in (inicio automático)
    state.setState({ isActive: true });
    startMonitoring();
};
