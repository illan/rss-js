// Les cadenes internacionalitzables formen
// Part de l'objecte TF7.l10n
TF7.l10n.cargaAsincrona_cargando = "Carregant dades ...";
TF7.l10n.cargaAsincrona_error = "Les dades no s'han carregat correctament";
TF7.l10n.cargaAsincrona_error404 = "El recurs sol · licitat no es troba disponible";
TF7.l10n.cargaAsincrona_reintentar = "Si us plau, torni a intentar-ho";
TF7.l10n.cargaAsincrona_verDetallesTecnicos = "Veure detalls tècnics";
TF7.l10n.formularios_error = "Corregiu els camps marcats en vermell";
TF7.l10n.formularios_camposRequeridos = "Ha de completar els següents camps obligatoris:";
TF7.l10n.formularios_mayusculas = "Recordeu que el camp de contrasenya és sensible a majúscules";
TF7.l10n.formularios_masParametros = "Més paràmetres";
TF7.l10n.formularios_menosParametros = "Menys paràmetres";
TF7.l10n.formularios_blockUI = 'Processant dades. Si us plau ... ';
// Separador de camps en dates
TF7.l10n.dateSplitter = "-";

TF7.l10n.calendario_abrirCalendario = "Obre calendari";

TF7.l10n.calendario_dateFormat = "% d-% m-% Y";
TF7.l10n.calendario_firstDayOfWeek = "1";


// Days of weekend (Sunday to Saturday)
// 1 = weekend, 0 = Weekday
TF7.l10n.calendario_dayprops = "1,0,0,0,0,0,1";

// Day names
TF7.l10n.calendario_dn = "Diumenge, Dilluns, Dimarts, Dimecres, Dijous, Divendres, Dissabte, Diumenge";


// Short day names
TF7.l10n.calendario_sdn = "dg, dl, Mar, dc, dj, dv, ds, Dom";

// Month names
TF7.l10n.calendario_mn = "Gener, Febrer, Març, Abril, Maig, Juny, Juliol, Agost, Setembre, Octubre, Novembre, Desembre";

// Short month names
TF7.l10n.calendario_smn = "Gen, Feb, Mar, Abr, Mai, Jun, July Ago, September October November desembre";

TF7.l10n.calendario_ttPrevMonth = "Mes anterior";
TF7.l10n.calendario_ttNextMonth = "Mes següent";
TF7.l10n.calendario_ttToday = "Avui";
TF7.l10n.calendario_ttPartToday = "(avui)";
TF7.l10n.calendario_ttDateFormat = "% i de% f de% Y";

// Textos alternatius per les icones de guió
TF7.l10n.guion_altInformation = "Informació:";
TF7.l10n.guion_altQuestion = "Pregunta:";
TF7.l10n.guion_altAction = "Acció:";

// C2c
TF7.l10n.c2c_title = "Clica i parla: Transferir ordre de crida";
TF7.l10n.c2c_estableciendo = "Establint connexió amb telèfon origen ...";
TF7.l10n.c2c_cerrar = "Tancar";
TF7.l10n.c2c_configurar = "Configurar";

// Selects dependents
TF7.l10n.chain_selects_loading_message = "Carregant ...";
TF7.l10n.chain_selects_loading_error_message = "Les dades no s'han carregat correctament";
TF7.l10n.chain_selects_select_one = "-Seleccioneu un paràmetre-";

// Taules amb files ordenables
TF7.l10n.sortable_rows_table_move_up_alt_text = "Amunt";
TF7.l10n.sortable_rows_table_move_up_title = "Moure aquesta fila cap amunt";
TF7.l10n.sortable_rows_table_move_down_alt_text = "A baix";
TF7.l10n.sortable_rows_table_move_down_title = "Moure aquesta fila cap avall";

// Pàgines protegides
TF7.l10n.protectedPage_genericMessge = "Aquesta sessió mostra informació rellevant.";
TF7.l10n.protectedPage_processMessge = "Si tanca la sessió, perdrà la informació que hagi introduït en el procés.";

// Selection table warning
TF7.l10n.select_table_warning_message = "Polsar \" Següent \"o \"Anterior\"perdrà els canvis introduïts a la pàgina. \nVoleu continuar?";

// Uploads asíncrons
TF7.l10n.async_uploader_cancel = "Cancel-la";
TF7.l10n.async_uploader_uploading = "Carregant fitxer";
TF7.l10n.async_uploader_error_message = "El fitxer no s'ha pogut carregar. Torni-ho a intentar ";
TF7.l10n.async_uploader_remove = "Elimina";

// Interface language
TF7.conf.lang = "es";

// Paths
TF7.conf.jsPath = "js/";
TF7.conf.cssPath = "css/";
TF7.conf.imgPath = "img/";

// Separador decimal
TF7.conf.decSymbol = ",";

// Separador de milers
TF7.conf.thousSymbol = ".";

// Format d'entrada de data
TF7.conf.dateFormat = "dmy";

// Separador de camps en dates
TF7.conf.dateSplitter = "-";

TF7.l10n.errors = {
// Numèrics
"number": {
"min": "!label requereix un valor mínim de !0",
"max": "!label requereix un valor màxim de !0",
"step": "!label accepta una precisió màxima de !0"
}
,
// Caselles
"checkbox": {
"min": "Ha de seleccionar almenys !0 caselles per !label",
"max": "Ha de seleccionar un màxim de !0 caselles per !label"
}
,
"date": {
"min": "La data mínima és !0",
"max": "La data màxima és !0"
}
,
// Longitud mínima, genèric
"minlength": "!label requereix un mínim de! 0 caràcters"
,
// Longitud mínima, genèric
"maxlength": "!label admet fins a! 0 caràcters"
,
// Requerit, genèric
"required": "!label és un camp obligatori"
,
// Tipus numèric
"typenumber": "!label requereix un valor numèric"
,
// Patrons, genèric
"pattern": "!label ha de seguir el patró! 0"
,
"__extra__": {
"some": "Heu d'omplir algun dels camps: !labels"
}
};