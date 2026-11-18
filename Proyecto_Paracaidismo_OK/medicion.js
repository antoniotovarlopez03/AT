/* Medición de visitas: etiqueta de Google (GA4 «AT Skydiving», contenedor GTM-THPDJXGF)
   y Microsoft Clarity. Consentimiento de Google denegado por defecto; Clarity solo se
   carga después de aceptar. La elección se guarda en localStorage ('si' | 'no'). */
(function () {
    var GTM_ID = 'GTM-THPDJXGF';
    var CLARITY_ID = 'zfrrwm8yql';
    var CLAVE = 'atskydiving_cookies';

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
    function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento */ } }

    var permisos = function (v) {
        return { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v };
    };

    // 1. Todo denegado por defecto, salvo que ya hubiera aceptado.
    var d = permisos('denied');
    d.wait_for_update = 500;
    window.gtag('consent', 'default', d);
    if (leer() === 'si') window.gtag('consent', 'update', permisos('granted'));

    // 2. Etiqueta de Google (respeta el consentimiento: sin permiso no guarda cookies).
    (function (w, doc, s, l, i) {
        w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = doc.getElementsByTagName(s)[0], j = doc.createElement(s);
        j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);

    function cargarClarity() {
        if (!CLARITY_ID || window.clarity) return;
        var c = function () { (c.q = c.q || []).push(arguments); };
        window.clarity = c;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
        document.head.appendChild(s);
    }

    function cerrarAviso() {
        var a = document.getElementById('aviso-cookies');
        if (a) a.remove();
    }

    function elegir(acepta) {
        guardar(acepta ? 'si' : 'no');
        window.gtag('consent', 'update', permisos(acepta ? 'granted' : 'denied'));
        if (acepta) cargarClarity();
        cerrarAviso();
    }

    function mostrarAviso() {
        if (document.getElementById('aviso-cookies')) return;
        var a = document.createElement('div');
        a.id = 'aviso-cookies';
        a.className = 'aviso-cookies';
        a.setAttribute('role', 'dialog');
        a.setAttribute('aria-label', 'Cookies');
        a.innerHTML =
            '<p>Usamos cookies de Google Analytics y Microsoft Clarity para saber cómo se usa la web y mejorarla. Solo se activan si aceptas. ' +
            '<a href="cookies.html">Más información</a></p>' +
            '<div class="aviso-cookies__botones">' +
            '<button type="button" data-cookies="no">Rechazar</button>' +
            '<button type="button" data-cookies="si">Aceptar</button>' +
            '</div>';
        a.addEventListener('click', function (e) {
            var b = e.target.closest('[data-cookies]');
            if (b) elegir(b.getAttribute('data-cookies') === 'si');
        });
        document.body.appendChild(a);
    }

    // Para «Cambiar preferencias de cookies».
    window.abrirAvisoCookies = mostrarAviso;

    function iniciar() {
        var eleccion = leer();
        if (eleccion === 'si') cargarClarity();
        else if (eleccion !== 'no') mostrarAviso();
        document.querySelectorAll('[data-abrir-cookies]').forEach(function (el) {
            el.addEventListener('click', function (e) { e.preventDefault(); mostrarAviso(); });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
