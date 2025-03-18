document.addEventListener("DOMContentLoaded", function () {
    let api;
    let monitorActive = false;

    // Inicializar la API de Geotab
    api = new Geotab.Addin.Api({
        scope: "PanicButtonAlert", // Nombre único para el add-in
        supports: ["get", "set", "remove"] // Funcionalidades soportadas
    });

    // Función para inicializar el add-in
    api.initialize(function (api) {
        console.log("Add-in inicializado correctamente");

        // Autenticar con la API de Geotab
        api.authenticate({
            database: "tch_telefonicatech", // Reemplaza con tu base de datos
            userName: "sebastian.quiroz@telefonica.com", // Reemplaza con tu usuario
            password: "REMOVED" // Reemplaza con tu contraseña
        }, function (error) {
            if (error) {
                console.error("Error de autenticación:", error);
            } else {
                console.log("Autenticación exitosa");
                startMonitoring();
            }
        });
    });

    // Monitorear la regla del botón de pánico
    function startMonitoring() {
        if (!api || monitorActive) return;

        monitorActive = true;
        const ruleId = "ayea8WF-hs0-qbkVvGb7FBw"; // Reemplaza con el ID correcto de la regla

        async function checkPanicButtonRule() {
            try {
                // Obtener eventos de excepción para la regla del botón de pánico
                const response = await api.call("Get", {
                    typeName: "ExceptionEvent",
                    search: { ruleSearch: { id: ruleId } }
                });

                console.log("Respuesta de la API:", response); // Depuración

                if (response.length > 0) {
                    triggerAlert(); // Si hay una activación, dispara la alerta
                } else {
                    updateStatus("Sin activación del botón de pánico.", "#01257D");
                }
            } catch (error) {
                console.error("Error en monitoreo:", error);
            } finally {
                setTimeout(checkPanicButtonRule, 10000); // Reinicia el monitoreo cada 10 segundos
            }
        }

        checkPanicButtonRule();
    }

    // Alerta visual y sonora
    function triggerAlert() {
        updateStatus("¡Alerta de botón de pánico activada!", "red");

        // Reproducir sonido de alerta
        const mp3Url = 'https://drive.usercontent.google.com/u/0/uc?id=18UGHBVmZdTwAIF28XvNg_MlBQFZ6Ia2B&export=download';
        const sound = new Audio(mp3Url);
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
});