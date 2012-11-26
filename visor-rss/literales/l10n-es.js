// Las cadenas internacionalizables forman
// parte del objeto TF7.l10n
TF7.l10n.cargaAsincrona_cargando = "Cargando datos...";
TF7.l10n.cargaAsincrona_error = "Los datos no se han cargado correctamente";
TF7.l10n.cargaAsincrona_error404 = "El recurso solicitado no se encuentra disponible";
TF7.l10n.cargaAsincrona_reintentar = "Por favor, vuelva a intentarlo";
TF7.l10n.cargaAsincrona_verDetallesTecnicos = "Ver detalles técnicos";
TF7.l10n.formularios_error = "Corrija los campos marcados en rojo";
TF7.l10n.formularios_camposRequeridos = "Debe completar los siguientes campos obligatorios:";
TF7.l10n.formularios_mayusculas = "Recuerde que el campo de contraseña es sensible a mayúsculas";
TF7.l10n.formularios_masParametros = "Más parámetros";
TF7.l10n.formularios_menosParametros = "Menos parámetros";
TF7.l10n.formularios_blockUI = 'Procesando datos. Por favor espere...';
// separador de campos en fechas
TF7.l10n.dateSplitter = "-";

TF7.l10n.calendario_abrirCalendario = "Abrir calendario";

TF7.l10n.calendario_dateFormat = "%d-%m-%Y";
TF7.l10n.calendario_firstDayOfWeek = "1";


// days of weekend (Sunday to Saturday)
// 1 = weekend, 0 = weekday
TF7.l10n.calendario_dayprops = "1,0,0,0,0,0,1";

// day names
TF7.l10n.calendario_dn = "Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo";

	
// short day names
TF7.l10n.calendario_sdn = "Dom,Lun,Mar,Mié,Jue,Vie,Sáb,Dom";
	
// month names
TF7.l10n.calendario_mn = "Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre";

// short month names
TF7.l10n.calendario_smn = "Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic";

TF7.l10n.calendario_ttPrevMonth = "Mes anterior";
TF7.l10n.calendario_ttNextMonth = "Mes siguiente";
TF7.l10n.calendario_ttToday = "Hoy";
TF7.l10n.calendario_ttPartToday = "(hoy)";
TF7.l10n.calendario_ttDateFormat = "%e de %f de %Y";

// textos alternativos para los iconos de guion
TF7.l10n.guion_altInformation = "Información:";
TF7.l10n.guion_altQuestion = "Pregunta:";
TF7.l10n.guion_altAction = "Acción:";

// c2c
TF7.l10n.c2c_title = "Clica y habla: Transferir orden de llamada";
TF7.l10n.c2c_estableciendo = "Estableciendo conexión con teléfono origen...";
TF7.l10n.c2c_cerrar = "Cerrar";
TF7.l10n.c2c_configurar = "Configurar";

// selects dependientes
TF7.l10n.chain_selects_loading_message = "Cargando...";
TF7.l10n.chain_selects_loading_error_message = "Los datos no se han cargado correctamente";
TF7.l10n.chain_selects_select_one = "-Seleccione un valor-";

// tablas con filas ordenables
TF7.l10n.sortable_rows_table_move_up_alt_text = "Arriba";
TF7.l10n.sortable_rows_table_move_up_title = "Mover esta fila hacia arriba";
TF7.l10n.sortable_rows_table_move_down_alt_text = "Abajo";
TF7.l10n.sortable_rows_table_move_down_title = "Mover esta fila hacia abajo";

//páginas protegidas
TF7.l10n.protectedPage_genericMessge = "Esta sesión muestra información relevante.";
TF7.l10n.protectedPage_processMessge = "Si cierra la sesión, perderá la información que haya introducido en el proceso.";

//selection table warning
TF7.l10n.select_table_warning_message = "Al pulsar \"Siguiente\" o \"Anterior\" perderá los cambios introducidos en la página.\n¿Desea continuar?";

// uploads asíncronos
TF7.l10n.async_uploader_cancel = 'Cancelar';
TF7.l10n.async_uploader_uploading = 'Cargando fichero';
TF7.l10n.async_uploader_error_message = 'El fichero no se ha podido cargar. Vuélvalo a intentar';
TF7.l10n.async_uploader_remove = 'Eliminar';

// interface language
TF7.conf.lang = "es";

// paths
TF7.conf.jsPath = "js/";
TF7.conf.cssPath = "css/";
TF7.conf.imgPath = "img/";

// separador decimal
TF7.conf.decSymbol = ",";

// separador de millares
TF7.conf.thousSymbol = ".";

// formato de entrada de fecha
TF7.conf.dateFormat = "dmy";

// separador de campos en fechas
TF7.conf.dateSplitter = "-";

TF7.l10n.errors = {
	// numéricos
	"number": { 
		"min": "!label requiere un valor mínimo de !0", 
		"max": "!label requiere un valor máximo de !0",
		"step": "!label acepta una precisión máxima de !0"
	}
	,
	// checkboxes
	"checkbox" : {
		"min": "Debe seleccionar al menos !0 casillas para !label",
		"max": "Debe seleccionar un máximo de !0 casillas para !label"
	}
	,
	"date" : {
		"min": "La fecha mínima es !0",
		"max": "La fecha máxima es !0"
	}
	,
	// longitud mínima, genérico
	"minlength" : "!label requiere un mínimo de !0 caracteres"
	,
	// longitud mínima, genérico
	"maxlength" : "!label admite un máximo de !0 caracteres"
	,
	// requerido, genérico
	"required": "!label es un campo obligatorio"
	,
	// tipo numérico
	"typenumber" : "!label requiere un valor numérico"
	,
	// patrones, genérico
	"pattern" : "!label debe seguir el patrón !0"
	,
	"__extra__": {
		"some" : "Debe rellenar alguno de los siguientes campos: !labels"
	}
};