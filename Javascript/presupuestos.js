document.addEventListener("DOMContentLoaded", cargaPagina);
window.addEventListener("load", cargaPagina);
function cargaPagina() {
    var btn1 = document.getElementById("boton1").addEventListener("click", mostrarVolante);
    var btn2 = document.getElementById("boton2").addEventListener("click", mostrarPerforado);
    var btn3 = document.getElementById("boton3").addEventListener("click", mostrarDiseno);
    var btn4 = document.getElementById("boton4").addEventListener("click", mostrarTarjeta);
    var btn5 = document.getElementById("boton5").addEventListener("click", mostrarFolder);
    var btn6 = document.getElementById("boton6").addEventListener("click", mostrarTriptico);
    var btn7 = document.getElementById("boton7").addEventListener("click", mostrarTabloire);
    var btn8 = document.getElementById("boton8").addEventListener("click", mostrarLona);
    var btn9 = document.getElementById("boton9").addEventListener("click", mostrarVinil);
    var btn10 = document.getElementById("boton10").addEventListener("click", mostrarRS);
    var btn11 = document.getElementById("boton11").addEventListener("click", mostrarPC);
    var btn12 = document.getElementById("boton12").addEventListener("click", mostrarSF);
    var btn13 = document.getElementById("boton13").addEventListener("click", mostrarCV);
}

/* GENERAR LISTAS AUTO Volante*/
var v1 = "Volante ½ carta tinta"
var v2 = "Volante ⅓ carta tinta"
var v3 = "Volante ½ carta color"
var v4 = "Volante ¼ carta color"
function mostrarVolante() {
  ListaProductos = document.getElementById("lp");
  ListaProductos.innerHTML = "<br>" + "<option>" + v1 + "</option>"
  ListaProductos.innerHTML += "<br>" + "<option>" + v2 + "</option>"
  ListaProductos.innerHTML += "<br>" + "<option>" + v3 + "</option>"
  ListaProductos.innerHTML += "<br>" + "<option>" + v4 + "</option>"
}

/*GENERAR LISTAS AUTO Perforado*/
var p1 = "Micro perforado adhesivo"
function mostrarPerforado() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + p1 + "</option>"
}

//GENERAR LISTAS DE DISEÑOS
var d1 = "Volante sencillo"
var d2 = "Volante elaborado"
var d3 = "Logo sencillo"
var d4 = "Logo avanzado"
function mostrarDiseno() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + d1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + d2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + d3 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + d4 + "</option>"
}

//GENERAR LISTAS DE TARJETAS
var t1 = "Tarjetas basicas"
var t2 = "Tarjetas doble vista"
var t3 = "Tarjetas laminadas"
function mostrarTarjeta() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + t1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + t2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + t3 + "</option>"
}

//Generar LISTA DE FOLDER
var f = "Folder carta"
function mostrarFolder(){
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + f + "</option>"
}

//GENERAR LISTA DE TRIPTICO
var t = "Triptico carta"
function mostrarTriptico(){
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + t + "</option>"
}

//GENERAR LISTA DE TABLOIRE
var ta1 = "Tabloire couche brillante"
var ta2 = "Tabloire couche brillante y mate"
var ta3 = "Tabloire adherable Fasson mate"
function mostrarTabloire() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + ta1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + ta2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + ta3 + "</option>"
}

//GENERAR LISTA LONA
var l1 = "Lona exprés"
var l2 = "Lona normal"
var l3 = "Lona traslucida"
var l4 = "Instalación lona"
function mostrarLona() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + l1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + l2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + l3 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + l4 + "</option>"
}

//GENERAR LISTA VINIL
var vi1 = "Vinil a color con corte"
var vi2 = "Vinil de corte"
var vi3 = "Vinil impreso blanco m²"
var vi4 = "Instalacion de vinil"
var vi5 = "Quitar viniles"
function mostrarVinil() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + vi1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + vi2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + vi3 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + vi4 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + vi5 + "</option>"
}

//GENERAR LISTA REDES SOCIALES
var rs1 = "Inicia en facebook"
var rs2 = "Que te vean"
var rs3 = "Date a conocer"
var rs4 = "Emprende"
var rs5 = "Pyme"
var rs6 = "Premium"
function mostrarRS() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + rs1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + rs2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + rs3 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + rs4 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + rs5 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + rs6 + "</option>"
}

//GENERAR LISTA PAQUETES COMPARTIDAS
var pa1 = "Paquete Plata"
var pa2 = "Paquete Oro"
var pa3 = "Paquete Platinum"
function mostrarPC() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + pa1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + pa2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + pa3 + "</option>"
}

//GENERAR LISTA SESIONES FOTOGRAFICAS
var sf1 = "Sesión de un producto"
var sf2 = "Sesión de personas en estudio"
var sf3 = "Sesión de personas en exteriores"
var sf4 = "Sesión fotográfica Empresarial"
function mostrarSF() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + sf1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + sf2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + sf3 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + sf4 + "</option>"
}

//GENERAR LISTA DE CREACION DE VIDEOS
var cv1 = "Vídeos con producción alta"
var cv2 = "Vídeos con producción media"
var cv3 = "Vídeos con produccion baja"
function mostrarCV() {
  Lista = document.getElementById("lp");
  Lista.innerHTML = "<br>" + "<option>" + cv1 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + cv2 + "</option>"
  Lista.innerHTML += "<br>" + "<option>" + cv3 + "</option>"
}

/* LISTA DE VARIABLES A USAR */

  //Volantes
  var vc1 = "1,000 volantes";
  var vc2 = "1,500 volantes";
  var vc3 = "2,000 volantes";
  var vc4 = "3,000 volantes";
  var vc5 = "Otra cantidad de volantes";

  //Perforados
  var pc1 = "Medida en m²"

  //Diseños
  var dc1 = "Consultar diseño"
  var dc2 = "Ver más información 👁"

  //Tarjetas
  var tc1 = "1,000 tarjetas"
  var tc2 = "2,000 tarjetas"
  var tc3 = "3,000 tarjetas"
  var tc4 = "4,000 tarjetas"
  var tc5 = "5,000 tarjetas"

  //FOLDER
  var fc1 = "1,000 folders"
  var fc2 = "2,000 folders"
  var fc3 = "3,000 folders"

  //TRIPTICOS
  var tp1 = "1,000 tripticos"
  var tp2 = "2,000 tripticos"
  var tp3 = "3,000 tripticos"

  //TABLOIRE
  var tac1 = "50 tabloires"
  var tac2 = "60 tabloires"
  var tac3 = "70 tabloires"
  var tac4 = "80 tabloires"
  var tac5 = "Otra cantidad de tabloires"

  //LONAS
  var lc1 = "Lona 1m²"
  var lc2 = "Lona 2m²"
  var lc3 = "Lona 3m²"
  var lc4 = "Lona 4m²"
  var lc5 = "Lona 5m²"
  var lc6 = "Otra medida de lona"

  //VINILES
  var vic1 = "Vinil 1m²"
  var vic2 = "Vinil 2m²"
  var vic3 = "Vinil 3m²"
  var vic4 = "Vinil 4m²"
  var vic5 = "Vinil 5m²"
  var vic6 = "Otra medida de vinil"

  //REDES SOCIALES
  var rsc1 = "Un paquete redes sociales"
  var rsc2 = "Consultar paquetes 👁"

  //PAQUETES COMPARTIDAS
  var pac1 = "1,000 compartidas"
  var pac2 = "2,000 compartidas"
  var pac4 = "4,000 compartidas"

  //SESIONES FOTOGRAFICAS
  var sfc1 = "Edición de 30 fotográfias"

  //CREACION DE VIDEOS
  var cvc1 = "Video de 10 segundos"
  var cvc2 = "Video de 15 segundos"
  var cvc3 = "Video de 30 segundos"
  var cvc4 = "Otro tiempo estimado"

  //VARIABLE DE PRECIO
  var precio = null;

  /* Seleccionador de Tipos de producto*/

  function selectTipo() {
  lista = document.elige.seleccion
  opciones = lista.options
  escribir = document.getElementById("reply")
  escribir.innerHTML = ""
  for (i=0;i<opciones.length;i++) {
    if (opciones[i].selected == true ) {
      seleccion = opciones[i].text
      escribir.innerHTML += " " + seleccion + "."
      
      //Inicio de sentencias personalizadas

      //INICIO SECCION DE VOLANTES
      if (seleccion==v1){ 
        Desc = document.getElementById("descripcion");
        Desc.value = "Volante tamaño ½ carta impreso de un solo lado y una sola tinta hecho en papel bond";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc5 + "</option>"
      }
      if(seleccion==v3){
        Desc = document.getElementById("descripcion");
        Desc.value = "Volante tamaño ½ carta a color impreso en papel couche";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc5 + "</option>"
      }
      if (seleccion == v2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Volante tamaño ⅓ carta impreso de un solo lado y una sola tinta hecho en papel bond";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc5 + "</option>"
      }
      if (seleccion == v4) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Volante tamaño ¼ carta a color impreso en papel couche"
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vc5 + "</option>"
      }
      //FINAL SECCION DE VOLANTES

      //INICIO SECCION PERFORADOS
      if (seleccion == p1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Micro perforado adhesivo para superficies se maneja por m² con un maximo de 50m de ancho por impresión";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + pc1 + "</option>"
      }
      //FINAL SECCION PERFORADOS

      //INICIO SECCION DISEÑOS
      if (seleccion == d1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Realizar el diseño de un volante sencillo"
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + dc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + dc2 + "</option>"
      }
      if (seleccion == d2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Realizar el diseño de un volante elaborado"
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + dc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + dc2 + "</option>"
      }
      if (seleccion == d3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Realizar el diseño de un logotipo sencillo"
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + dc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + dc2 + "</option>"
      }
      if (seleccion == d4) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Diseño de un logotipo avanzado"
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + dc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + dc2 + "</option>"
      }
      //FINAL SECCION DISEÑOS

      //INICIO SECCION TARJETAS
      if(seleccion==t1){
        Desc = document.getElementById("descripcion");
        Desc.value = "Tarjetas de presentación un solo lado, con barniz UV brillante";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc5 + "</option>"
      }
      if(seleccion==t2){
        Desc = document.getElementById("descripcion");
        Desc.value = "Tarjetas de presentación ambos lados y barniz UV brillante";

        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc5 + "</option>"
      }
      if(seleccion==t3){
        Desc = document.getElementById("descripcion");
        Desc.value = "Tarjetas laminadas, 2 caras y con laminado mate en ambos lados";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tc5 + "</option>"
      }
      //FINAL SECCION TARJETAS

      //INICIO SECCION FOLDER
      if (seleccion == f) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Folder tamaño carta que incluye barniz UV brillante";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + fc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + fc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + fc3 + "</option>"
      }
      //FINAL SECCION FOLDER

      //INICIO SECCION TRIPTICO
      if (seleccion == t) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Tripticos tamaño carta, incluyen doble cara y impresos a color";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tp1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tp2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tp3 + "</option>"
      }
      //FINAL SECCION TRIPTICO

      //INICIO SECCION TABLOIRE
      if (seleccion == ta1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Tabloire couche brillante, con un área de impresión de 46cm x 31cm";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tac1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac5 + "</option>"
      }
      if (seleccion == ta2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Tabloire couche brillante y mate, con un área de impresión de 46cm x 31cm";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tac1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac5 + "</option>"
      }
      if (seleccion == ta3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Tabloire adherible Fasson mate, con un área de impresión de 46cm x 31cm";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + tac1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + tac5 + "</option>"
      }
      //FINAL SECCION TABLOIRE

      //INICIO SECCION LONA
      if (seleccion == l1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Lona exprés tiene un tiempo de entrega de 1 día y ½ como maximo";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + lc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc6 + "</option>"
       }
       if (seleccion == l2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Lona normal tiene un tiempo de entrega de 3 a 4 días";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + lc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc6 + "</option>"
       }
       if (seleccion == l3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Lona traslúcida tiene un tiempo de entrega de 3 a 4 días";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + lc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + lc6 + "</option>"
       }
       if (seleccion == l4) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Instalacion de lonas por metro";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + " 1 metro" + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + "2 metros" + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + "3 metros" + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + "5 metros" + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + "Otra medida" + "</option>"
       }
      //FINAL SECCION LONA

      //INICIO SECCION VINIL
      if (seleccion == vi1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Vinil a color con corte, 1.50 mt de ancho, calcamonias de 6x6 cm tiene un tiempo de entrega de 3 a 4 días";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vic1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic6 + "</option>"
      }
      if (seleccion == vi2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Vinil de corte, tiene un tiempo de entrega de 3 a 4 días";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vic1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic6 + "</option>"
      }
      if (seleccion == vi3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Vinil impreso blanco m², tiene un tiempo de entrega de 3 a 4 días";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vic1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic6 + "</option>"
      }
      if (seleccion == vi4) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Instalacion de vinil segun sus metros";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vic1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic6 + "</option>"
      }
      if (seleccion == vi5) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Quitar viniles según sus metros";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + vic1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic4 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic5 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + vic6 + "</option>"
      }
      //FINAL SECCION VINIL

      //INICIO SECCION REDES SOCIALES
      if (seleccion==rs1){ 
        Desc = document.getElementById("descripcion");
        Desc.value = "Este paquete incluye 1 red social, 1 post semanal y google maps";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + rsc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + rsc2 + "</option>"
      }
      if (seleccion == rs2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Este paquete incluye 1 red social, 2 posts semanales, google maps y whatsapp";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + rsc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + rsc2 + "</option>"
      }
      if (seleccion == rs3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Este paquete incluye 1 red social, 3 posts semanales, google maps, whatsapp, sesión fotográfica, integración de productos o servicios";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + rsc1 + "</option>"
        var link = "index.html"
        ListaCantidad.innerHTML += "<br>" + "<option>" + rsc2 + "</option>"
      }
      if (seleccion == rs4) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sín descripción";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + rsc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + rsc2 + "</option>"
      }
      if (seleccion == rs5) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sín descripción";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + rsc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + rsc2 + "</option>"
      }
      if (seleccion == rs6) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sín descripción";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + rsc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + rsc2 + "</option>"
      }
      //FINAL SECCION REDES SOCIALES

      //INICIO SECCION PAQUETES COMPARTIDAS
      if (seleccion == pa1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Este paquete ofrece 1,000 compartidas para darte a conocer en la red social de tu preferencia";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + pac1 + "</option>"
      }
      if (seleccion == pa2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Este paquete te ofrece 2,000 compartidas para darte a conocer en la red social de tu preferencia";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + pac2 + "</option>"
      }
      if (seleccion == pa3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Este paquete te ofrece 4,000 compartidas para darte a conocer en la red social de tu preferencia";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + pac4 + "</option>"
      }
      //FINAL SECCION PAQUETES COMPARTIDAS

      //INICIO SECCION SESION DE FOTOS
      if (seleccion == sf1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sesión fotografica con 2 hrs de duración para seleccionar las 30 mejores de un producto";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + sfc1 + "</option>"
      }
      if (seleccion == sf2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sesión fotografica con 2 hrs de duración para seleccionar las 30 mejores de una persona dentro del estudio";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + sfc1 + "</option>"
      }
      if (seleccion == sf3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sesión fotografica con 2 hrs de duración para seleccionar las 30 mejores de una persona en exteriores";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + sfc1 + "</option>"
      }
      if (seleccion == sf4) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Sesión fotografica con 2 hrs de duración para seleccionar las 30 mejores de una empresa en su respectivo domicilio";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + sfc1 + "</option>"
      }
      //FINAL SECCION SESION DE FOTOS

      //INICIO SECCION CREACION DE VIDEOS
      if (seleccion == cv1) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Creación y edición de vídeos con alta produccion";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + cvc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc4 + "</option>"
      }
      if (seleccion == cv2) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Creación y edición de vídeos con media produccion";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + cvc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc4 + "</option>"
      }
      if (seleccion == cv3) {
        Desc = document.getElementById("descripcion");
        Desc.value = "Creación y edición de vídeos con baja produccion";
        ListaCantidad = document.getElementById("lc")
        ListaCantidad.innerHTML = "<br>" + "<option>" + cvc1 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc2 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc3 + "</option>"
        ListaCantidad.innerHTML += "<br>" + "<option>" + cvc4 + "</option>"
      }
      //FINAL SECCION CREACION DE VIDEOS

    } //FINAL SELECCIONADOR DE TIPOS DE PRODUCTOS
  }
}

//SELECCION DE CANTIDADES
function selectCant() {
  listaCant = document.elige.cantidad
  opcionesCant = listaCant.options
  escribirCant = document.getElementById("replyCant")
  escribirCant.innerHTML = ""
  for (c=0; c<opcionesCant.length; c++) {
    if (opcionesCant[c].selected == true ) {
      seleccionCant = opcionesCant[c].text
      escribirCant.innerHTML += " " + seleccionCant /*+ "." ACA QUITE UN PUNTO DEL SELECT CANTIDAD*/
      

      // ------------------------------------------------------------CANTIDAD VOLANTES
      if (seleccionCant == vc1) {
        if (seleccion == v1){
          precio = 280;
        }else if (seleccion == v3) {
          precio = 450;
        }
      }

      if(seleccionCant == vc2) {
          precio = 420;
      }

      if (seleccionCant ==vc3) {
        if (seleccion == v1) {
          precio = 280*2;
        }else if (seleccion == v3) {
          precio = 450*2;
        }else if (seleccion == v4) {
          precio = 550;
        }

      }

      if (seleccionCant ==vc4) {
        if (seleccion == v1) {
          precio = 280*3;
        }else if (seleccion == v2) {
          precio = 420*2;
        }else if (seleccion == v3) {
          precio = 450*3;
        }
      }

      if (seleccionCant ==vc5){
        var product = Number (window.prompt("¿Que cantidad desea?\n vendemos por millares segun el tipo de volante", ""))
        switch (product) {
          case 0:
            alert("Gracias, vuelva pronto ☺")
            precio = null;
          break;
          
          case 1000:
            if (seleccion == v1){
                precio = 280;
              }else if (seleccion == v3) {
                precio = 450;
              }else {
                precio = null;
                alert("Este volante no se maneja por un solo millar 🙁")
              }  
          break;

          case 1500:
            if (seleccion == v2) {
              precio = 420;
            }else {
              precio = null;
              alert("Este volante no se maneja por millar y medio 🙁")
            }
          break;

          case 2000:
            if (seleccion == v1) {
              precio = 280*2;
            }else if (seleccion == v3) {
              precio = 450*2;
            }else if (seleccion == v4) {
              precio = 550;
            }else {
              precio = null;
              alert("Este volante no se maneja por 2 millares 🙁","")
            }
          break;

          case 3000:
            if (seleccion == v1) {
              precio = 280*3;
            }else if (seleccion == v2) {
              precio = 420*2;
            }else if (seleccion == v3) {
              precio = 450*3;
            }else {
              precio = null;
              alert("Este volante no se maneja por 3 millares 🙁","")
            }
          break;

          case 4000:
            if (seleccion == v1) {
              precio = 280*4;
            }else if (seleccion ==v3){
              precio = 450*4;
            }else if(seleccion==v4){
              precio = 550*2;
            }else {
              precio = null;
              alert("Este volante no se maneja por 4 millares 🙁","")
            }
          break;

          case 4500:
            if (seleccion == v2) {
              precio = 420*3;
            }else {
              precio = null;
              alert("Este volante no se maneja por millar y medio 🙁")
            }
          break;

          case 5000:
            if (seleccion==v1){
              precio = 280*5;
            }else if(seleccion==v3){
              precio = 450*5;
            }else {
              precio = null;
              alert("Este volante no se maneja por 5 millares 🙁")
            }
          break;

          case 6000:
            if (seleccion == v1) {
              precio = 280*6;

            }else if (seleccion == v2) {
              precio = 420*4;
              
            }else if (seleccion ==v3){
              precio = 450*6;
              
            }else if(seleccion==v4){
              precio = 550*3;
              
            }else {
              precio = null;
              alert("Este volante no se maneja por 6 millares 🙁","")
            }
          break;

          case 7000:
            if (seleccion == v1) {
              precio = 280*7;
              
            }else if (seleccion ==v3){
              precio = 450*7;
            }else {
              precio = null;
              alert("Este volante no se maneja por 7 millares 🙁","")
            }
          break;

          case 7500:
            if (seleccion == v2) {
              precio = 420*5;
              
            }else {
              precio = null;
              alert("Este volante no se maneja por millar y medio 🙁")
            }
          break;

          case 8000:
            if (seleccion == v1) {
              precio = 280*8;
              
            }else if (seleccion ==v3){
              precio = 450*8;
              
            }else if(seleccion==v4){
              precio = 550*4;
              
            }else {
              precio = null;
              alert("Este volante no se maneja por 8 millares 🙁","")
            }
          break;

          case 9000:
            if (seleccion == v1) {
              precio = 280*9;
            }else if (seleccion == v2) {
              precio = 420*6;
            }else if (seleccion == v3) {
              precio = 450*9;
            }else {
              precio = null;
              alert("Este volante no se maneja por 9 millares 🙁","")
            }
          break;

          case 10000:
            if (seleccion == v1) {
              precio = 280*10;
            }else if (seleccion ==v3){
              precio = 450*10;
            }else if(seleccion==v4){
              precio = 550*5;
            }else {
              precio = null;
              alert("Este volante no se maneja por 10 millares 🙁","")
            }
          break;

          case 10500:
            if (seleccion == v2) {
              precio = 420*7;
            }else {
              precio = null;
              alert("Este volante no se maneja por millar y medio 🙁")
            }
          break;

          default:
            alert("La opcion ingresada no es valida.")
            precio = null;
          break;
                    /*Termina aqui con default que indica que ingreso incorrectamente*/
        }
      }

      //INCLUIR SECCION DE PERFORADO --------------------------------------------------------->
      if (seleccionCant == pc1) {
        do {
          var vv = false;
          var customP = Number(window.prompt("¿Cuantos metros desea presupuestar?\nRecuerde que 50mts. de ancho es la cantidad maxima de impresion",""))
          if (customP < 0) {
            alert("No puede presupuestar una cantidad menor a 0 mts 🤔")
          }else if (customP == 0) {
            vv = true;
            alert("Gracias, por intentar vuelva pronto ☺")
          }else if (customP>=1&&customP<=50) {
            vv = true;
            if (seleccion == p1) {
              precio = customP*280;
            }

        }else {alert("La cantidad ingresada debe ser de 1 a 50 m²")}
        }while (vv == false);

      }
         

      // ------------------------------------------------------------CANTIDAD DISEÑOS
      if (seleccionCant == dc1) {
        if (seleccion == d1) {
          precio = 225;
        }else if (seleccion == d2) {
          precio = 300;
        }else if (seleccion == d3) {
          precio = 130;
        }else if (seleccion == d4) {
          precio = 200;
        }

      }

      if (seleccionCant == dc2) {
        window.confirm('¿Estas a punto de redirigirte a otra página?')
        window.location.href='catalogo.html';
        precio = 0;
      }

      //INICIO SECCION TARJETAS DE PRESENTACION
      if (seleccionCant == tc1) {
        if (seleccion == t1) {
          precio = 190;
        }else if (seleccion == t2) {
          precio = 296;
        }else if (seleccion == t3) {
          precio = 570;
        }

      }

      if (seleccionCant == tc2) {
        if (seleccion == t1) {
          precio = 190*2;
        }else if (seleccion == t2) {
          precio = 296*2;
        }else if (seleccion == t3) {
          precio = 570*2;
        }

      }

      if (seleccionCant == tc3) {
        if (seleccion == t1) {
          precio = 190*3;
        }else if (seleccion == t2) {
          precio = 296*3;
        }else if (seleccion == t3) {
          precio = 570*3;
        }

      }

      if (seleccionCant == tc4) {
        if (seleccion == t1) {
          precio = 190*4;
        }else if (seleccion == t2) {
          precio = 296*4;
        }else if (seleccion == t3) {
          precio = 570*4;
        }

      }

      if (seleccionCant == tc5) {
        if (seleccion == t1) {
          precio = 190*5;
        }else if (seleccion == t2) {
          precio = 296*5;
        }else if (seleccion == t3) {
          precio = 570*5;
        }

      }
      //FINAL TARJETAS DE PRESENTACION

      // ------------------------------------------------------------CANTIDAD FOLDER
      if (seleccionCant == fc1) {
        if(seleccion == f){
          precio = 7655;
        }
        
      }else if (seleccionCant == fc2) {
        if(seleccion == f){
          precio = 7655*2;
        }

      }else if (seleccionCant == fc3) {
        if(seleccion == f){
          precio = 7655*3;
        }

      }
      // ------------------------------------------------------------CANTIDAD TRIPTICO
      if (seleccionCant == tp1) {
        if (seleccion == t) {
          precio = 1890;
        }
      }else if (seleccionCant == tp2) {
        if (seleccion == t) {
          precio = 1890*2;
        }
        
      }else if (seleccionCant == tp3) {
        if (seleccion == t) {
          precio = 1890*3;
        }
      }

      // ------------------------------------------------------------CANTIDAD TABLOIRE
      if (seleccionCant == tac1) {
        if (seleccion == ta1) {
          precio = 10*50;
        }else if (seleccion == ta2) {
          precio = 11*50;
        }else if (seleccion == ta3) {
          precio = 15*50;
        }

      }else if (seleccionCant == tac2) {
        if (seleccion == ta1) {
          precio = 10*60;
        }else if (seleccion == ta2) {
          precio = 11*60;
        }else if (seleccion == ta3) {
          precio = 15*60;
        }

      }else if (seleccionCant == tac3) {
        if (seleccion == ta1) {
          precio = 10*70;
        }else if (seleccion == ta2) {
          precio = 11*70;
        }else if (seleccion == ta3) {
          precio = 15*70;
        }

      }else if (seleccionCant == tac4) {
        if (seleccion == ta1) {
          precio = 10*80;
        }else if (seleccion == ta2) {
          precio = 11*80;
        }else if (seleccion == ta3) {
          precio = 15*80;
        }

      }else if (seleccionCant == tac5) {
        do{
          var vt = false;
          var customT = Number(window.prompt("¿Cuantos tabloides requieres?"))
          if (customT < 0) {
            alert("La cantidad de tabloides no puede ser menor a 1")
          }else if (customT == 0) {
            vt = true;
            alert("Gracias por probar vuelva pronto ☺")
          }else if (customT>=1&&customT<=10000) {
            vt = true;
            if (seleccion == ta1) {
              precio = 10*customT;
            }else if (seleccion == ta2) {
              precio = 11*customT;
            }else if (seleccion == ta3) {
              precio = 15*customT;
            }

          }else {alert("El valor maximo que puedes presupuestar es de un millon :(")}
        }while(vt == false)
      }

      // ------------------------------------------------------------CANTIDAD LONA
      if (seleccionCant == lc1) {
        if (seleccion == l1||seleccion==l2) {
          precio = 75;
        }else if (seleccion == l3) {
          precio = 322;
        }else if (seleccion == l4) {
          precio = 66;
        }

      }else if (seleccionCant == lc2) {
        if (seleccion == l1||seleccion==l2) {
          precio = 75*2;
        }else if (seleccion == l3) {
          precio = 322*2;
        }else if (seleccion == l4) {
          precio = 66*2;
        }

      }else if (seleccionCant == lc3) {
        if (seleccion == l1||seleccion==l2) {
          precio = 75*3;
        }else if (seleccion == l3) {
          precio = 322*3;
        }else if (seleccion == l4) {
          precio = 66*3;
        }

      }else if (seleccionCant == lc4) {
        if (seleccion == l1||seleccion==l2) {
          precio = 75*4;
        }else if (seleccion == l3) {
          precio = 322*4;
        }else if (seleccion == l4) {
          precio = 66*4;
        }

      }else if (seleccionCant == lc5) {
        if (seleccion == l1||seleccion==l2) {
          precio = 75*5;
        }else if (seleccion == l3) {
          precio = 322*5;
        }else if (seleccion == l4) {
          precio = 66*5;
        }

      }else if (seleccionCant == lc6) {
        do {
          var vl = false;
          var customLona = Number (window.prompt("¿Que cantidad desea?\nManejamos las lonas por m² con un maximo de 50m de ancho", ""))
          if (customLona < 0) {
            vl = false;
            alert("Ingrese un valor mayor a 0 por favor")
          }else if (customLona == 0) {
            alert("Gracias vuelva pronto ☺")
            vl = true;
            precio = null;
          }else if (customLona>=1&&customLona<=50) {
            vl = true;
            if (seleccion == l1||seleccion == l2) {
              precio = 75*customLona;
            }else if (seleccion == l3) {
              precio = 322*customLona;
            }else if (seleccion == l4) {
              precio = 66*customLona;
            }
          }else {alert("Ingrese un numero entre el 1 y el 50 m² por favor")}
        }while(vl == false);
    }

      // ------------------------------------------------------------CANTIDAD VINIL
      if (seleccionCant == vic1) {
        if (seleccion == vi1) {
          precio = 351;
        }else if (seleccion == vi2) {
          precio = 180;
        }else if (seleccion == vi3) {
          precio = 185;
        }else if (seleccion == vi4) {
          precio = 66;
        }else if (seleccion == vi5) {
          precio = 77;
        }

      }else if (seleccionCant == vic2) {
        if (seleccion == vi1) {
          precio = 351*2;
        }else if (seleccion == vi2) {
          precio = 180*2;
        }else if (seleccion == vi3) {
          precio = 185*2;
        }else if (seleccion == vi4) {
          precio = 66*2;
        }else if (seleccion == vi5) {
          precio = 77*2;
        }

      }else if (seleccionCant == vic3) {
        if (seleccion == vi1) {
          precio = 351*3;
        }else if (seleccion == vi2) {
          precio = 180*3;
        }else if (seleccion == vi3) {
          precio = 185*3;
        }else if (seleccion == vi4) {
          precio = 66*3;
        }else if (seleccion == vi5) {
          precio = 77*3;
        }
      }else if (seleccionCant == vic4) {
        if (seleccion == vi1) {
          precio = 351*4;
        }else if (seleccion == vi2) {
          precio = 180*4;
        }else if (seleccion == vi3) {
          precio = 185*4;
        }else if (seleccion == vi4) {
          precio = 66*4;
        }else if (seleccion == vi5) {
          precio = 77*4;
        }
      }else if (seleccionCant == vic5) {
        if (seleccion == vi1) {
          precio = 351*5;
        }else if (seleccion == vi2) {
          precio = 180*5;
        }else if (seleccion == vi3) {
          precio = 185*5;
        }else if (seleccion == vi4) {
          precio = 66*5;
        }else if (seleccion == vi5) {
          precio = 77*5;
        }
      }else if (seleccionCant == vic6) {
        do {
          var val = false;
          var customVI = Number(window.prompt("¿Cuantos m² de vinil desea?\nEl ancho maximo es de 50 metros."))
          if (customVI < 0) {
            val = false;
            alert("Ingrese un valor mayor a 0 por favor")
          }else if (customVI == 0) {
            alert("Gracias vuelva pronto ☺")
            val = true;
            precio = null;
          }else if (customVI>=1&&customVI<=50) {
            val = true;
            if (seleccion == vi1) {
              precio = 351*customVI;
            }else if (seleccion == vi2) {
              precio = 180*customVI;
            }else if (seleccion == vi3) {
              precio = 185*customVI;
            }else if (seleccion == vi4) {
              precio = 66*customVI;
            }else if (seleccion == vi5) {
              precio = 77*customVI;
            }
          }else {alert("Ingrese un numero entre el 1 y el 50 m² por favor")}
        }while(val == false);
      }

      // ------------------------------------------------------------CANTIDAD REDES SOCIALES
      if (seleccionCant == rsc1) {
        if (seleccion == rs1) {
          precio = 500;
        }else if (seleccion == rs2) {
          precio = 800;
        }else if (seleccion == rs3) {
          precio = 1200;
        }else if (seleccion == rs4) {
          precio = 1900;
        }else if (seleccion == rs5) {
          precio = 3900;
        }else if (seleccion == rs6) {
          precio = 5500;
        }

      }else if (seleccionCant == rsc2) {
          window.confirm('¿Estas a punto de redirigirte a otra página?')
          window.location.href='catalogo.html';
          precio = 0;
      }

      // ------------------------------------------------------------CANTIDAD PAQUETES COMPARTIDAS
      if (seleccionCant == pac1) {
        if (seleccion == pa1) {
          precio = 10000;
        }
      }else if (seleccionCant == pac2) {
        if (seleccion == pa2) {
          precio = 20000;
        }
      }else if (seleccionCant == pac4) {
        if (seleccion == pa3) {
          precio = 35000;
        }
      }

      // ------------------------------------------------------------CANTIDAD SESION DE FOTOS
      if (seleccionCant == sfc1) {
        if (seleccion == sf1) {
          precio = 500;
        }else if (seleccion == sf2) {
          precio = 500;
        }else if (seleccion == sf3) {
          precio = 800;
        }else if (seleccion == sf4) {
          precio = 800;
        }

      }

      // ------------------------------------------------------------CANTIDAD CREACION DE VVIDEOS
      if (seleccionCant == cvc1) {
        if (seleccion == cv1) {
          precio = 800;
        }else if (seleccion == cv2) {
          precio = 600;
        }else if (seleccion == cv3) {
          precio = 400;
        }

      }else if (seleccionCant == cvc2) {
        if (seleccion == cv1) {
          precio = 1200;
        }else if (seleccion == cv2) {
          precio = 900;
        }else if (seleccion == cv3) {
          precio = 600;
        }

      }else if (seleccionCant == cvc3) {
        if (seleccion == cv1) {
          precio = 2400;
        }else if (seleccion == cv2) {
          precio = 1800;
        }else if (seleccion == cv3) {
          precio = 1200;
        }

      }else if (seleccionCant == cvc4) {
        do {
        var customCV = Number (window.prompt("¿Que duracion tendra?\n Ingrese el número de segundos o minutos estimado", ""))
        if (customCV == 0) {
          precio = 0;
          alert("Gracias por intentar ☺")
        }else if (seleccion == cv1) {
          if (customCV < 0){
            precio = null;
            alert("La cantidad que ingreso no es valida debido a que es negativa")
          }else if (customCV <= 10) {
            alert ("Entendido, calculando presupuesto por " + customCV + " minutos de vídeo\nPresione el boton presupuestar ☺")
            var minutos = customCV*60;
            precio = 80*minutos;
          }else if (customCV <=60) {
            alert ("Entendido, calculando presupuesto por " + customCV + " segundos de vídeo\nPresione el boton presupuestar ☺")
            precio = 80*customCV;
          }else {
            precio = null;
            alert ("La cantidad ingresada es demasiado alta\nContactenos por whatsapp para mayores detalles ☺")
          }

        }else if (seleccion == cv2) {
          if (customCV < 10) {
            alert ("Entendido, calculando presupuesto por " + customCV + " minutos de vídeo\nPresione el boton presupuestar ☺")
            var minutos = customCV*60;
            precio = 60*minutos;
          }else if (customCV <=60) {
            alert ("Entendido, calculando presupuesto por " + customCV + " segundos de vídeo\nPresione el boton presupuestar ☺")
            precio = 60*customCV;
          }else {
            precio = null;
            alert ("La cantidad ingresada es demasiado alta contactenos por whatsapp para mayores detalles ☺")
          }

        }else if (seleccion == cv3) {
          if (customCV < 10) {
            alert ("Entendido, calculando presupuesto por " + customCV + " minutos de vídeo\nPresione el boton presupuestar ☺")
            var minutos = customCV*60;
            precio = 40*minutos;
          }else if (customCV <=60) {
            alert ("Entendido, calculando presupuesto por " + customCV + " segundos de vídeo\nPresione el boton presupuestar ☺")
            precio = 40*customCV;
          }else {
            precio = null;
            alert ("La cantidad ingresada es demasiado alta contactenos por whatsapp para mayores detalles ☺")
          }
        }

      }while(precio == null);
      }

      if (precio == null) {
        alert("No ha seguido los pasos correctamente 🤔", "")
      }else{
        presupuesto = document.getElementById("total");
        presupuesto.value = "El total a pagar seria de aprox. $" + precio + " por "+ seleccionCant + "."
      }

    } //LLAVES DE CIERRE DEL SELECCIONADOR DE CANTIDADES
  }
}

function selectProducto() {
  lista = document.elige.grupos
  opciones = lista.options
  escribir = document.getElementById("replyProducto")
  escribir.innerHTML = ""
  for (i=0;i<opciones.length;i++) {
    if (opciones[i].selected == true ) {
      grupos = opciones[i].text
      escribir.innerHTML += grupos
    }
  }
}