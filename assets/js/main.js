/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav_a = $nav.find('a');

		$nav_a
			.addClass('scrolly')
			.on('click', function(e) {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'header-visible'
				});

		// Project modal.
			var projectCatalog = {
				horarios: {
					title: 'Generador de Horarios - Centros Educativos',
					summary: 'Sistema modular de generación automática de horarios que implementa un motor de restricciones basado en reglas académicas. La solución combina un backend REST en PHP con un scheduler en Python/PHP que aplica algoritmos de optimización sujetos a restricciones de disponibilidad docente, capacidad de aulas y prioridades curriculares. Frontend reactivo (React + Vite) consume la API para visualizar, validar y ajustar manualmente los horarios generados.',
					build: 'Arquitectura y Stack:\n\nAPI REST (PHP): Endpoints CRUD para centros, ciclos, profesores, asignaturas y horarios. Autenticación vía JWT, middleware de CORS y control de acceso por rol.\nLógica de generación: Motor de reglas en PHP + scheduler Python (OR-Tools/CP-SAT) para resolver el problema de asignación con restricciones.\nBase de datos: MySQL con esquema normalizado para persistencia de configuración y resultados.\nFrontend: React con componentes funcionales, Context API para estado global, Vite para bundling optimizado.\nDiagnóstico: módulos de validación que detectan conflictos, solapamientos y cargas docentes anómalas.',
					technologies: ['JavaScript', 'React', 'Vite', 'Node.js', 'dockview', 'jspdf', 'HTML', 'CSS', 'PHP', 'PDO', 'JWT', 'REST API', 'MySQL', 'Python', 'OR-Tools', 'ESLint'],
					media: [
						{ type: 'video', src: 'videos/horarios-demo.mp4', alt: 'Demo en video del generador de horarios', poster: 'images/horarios-thumb.jpg' },
						{ type: 'image', src: 'images/CapturaHorario_1.png', alt: 'Captura del horario 1' },
						{ type: 'image', src: 'images/CapturaHorario_2.png', alt: 'Captura del horario 2' },
						{ type: 'image', src: 'images/CapturaHorario_3.png', alt: 'Captura del horario 3' }
					]
				},
				mailbot: {
					title: 'Mailbot - Sistema de Envío Masivo de Emails Personalizados',
					summary: 'Sistema integrado de gestión y envío masivo de emails personalizados que implementa un pipeline completo de validación de datos, generación de plantillas HTML dinámicas y reportes de resultados. La solución combina un backend REST en Node.js/Express que gestiona la carga de datos desde Excel, validación robusta con normalización automática de campos, y envío masivo inteligente con fallback de remitentes. Frontend interactivo (HTML5 + Vanilla JS) permite visualizar validaciones en tiempo real con indicadores de estado (verde/amarillo/rojo), editar datos y descargar reportes en Excel con detalles granulares de cada envío.',
					build: 'Arquitectura y Stack:\n\nAPI REST (Node.js/Express): Endpoints CRUD para carga de Excel, procesamiento de datos y envío masivo. Autenticación SMTP con Gmail/Google Workspace, manejo de errores con retry automático, rate limiting concurrente (configurable) y logging estructurado para auditoría de operaciones.\nValidación y Procesamiento de Datos: Normalización automática de cabeceras Excel (espacios, mayúsculas, tildes). Validación granular por fila: campos obligatorios (Cliente, Email_Cliente, CUPS, Compañía, Agente), formato de email (regex robusto), estado visual inmediato (rojo/amarillo/verde). Consolidación de datos con fallback automático de Email_Agente desde configuración externa.\nGeneración de Plantillas HTML: Generador dinámico de email HTML responsive (600px) con variables personalizables del Excel: Cliente, Email, CUPS, Tipo, Compañía, Agente. Imágenes embebidas por CID en Nodemailer para funcionamiento offline. Botones CTA (WhatsApp, Reseña Google) configurables. Footer con enlaces legales y copyright editables.\nFrontend Interactivo: Interfaz web responsive (HTML5 + CSS3 + Vanilla JavaScript) con carga de archivos Excel, visualización de tabla con validaciones en tiempo real, campos editables, modo simulación para testeos sin envío real, descarga de reportes en Excel.\nReportes y Auditoría: Generación de Excel descargable con resultados individuales por email: estado de envío, detalle de error (si aplica), remitente utilizado, timestamp. Modo simulación para validar flujo completo sin enviar correos reales. Resumen estadístico: total procesados, exitosos, errores.',
					technologies: ['Node.js', 'Express', 'JavaScript', 'HTML5', 'CSS3', 'XLSX', 'Nodemailer', 'Multer', 'Gmail SMTP'],
					media: [
						{ type: 'video', src: 'videos/mailbot-demo.mp4', alt: 'Demo en video de Mailbot', poster: 'images/mailbot-1.png' },
						{ type: 'image', src: 'images/mailbot-1.png', alt: 'Pantalla principal de Mailbot' },
						{ type: 'image', src: 'images/mailbot-2.png', alt: 'Vista de gestion de notificaciones de Mailbot' }
					]
				}
			};

			var $modal = $('#project-modal');

			if ($modal.length) {
				var $mediaMain = $('#project-modal-media-main');
				var $thumbs = $('#project-modal-thumbs');
				var $title = $('#project-modal-title');
				var $summary = $('#project-modal-summary');
				var $build = $('#project-modal-build');
				var $tech = $('#project-modal-tech');
				var $prev = $('.project-modal__nav--prev');
				var $next = $('.project-modal__nav--next');
				var activeProject = null;
				var activeIndex = 0;
				var activeMedia = [];
				var $lightbox = $('#lightbox');
				var $lightboxImg = $('#lightbox-img');

				var formatBuildText = function(buildText) {
					if (!buildText)
						return '';

					return buildText.split('\n').map(function(line) {
						var trimmedLine = line.trim();
						if (!trimmedLine)
							return '<div class="project-modal__build-spacer"></div>';

						if (trimmedLine.slice(-1) === ':')
							return '<div class="project-modal__build-heading">' + trimmedLine + '</div>';

						var colonIndex = trimmedLine.indexOf(':');
						if (colonIndex > -1) {
							var label = trimmedLine.slice(0, colonIndex + 1).trim();
							var value = trimmedLine.slice(colonIndex + 1).trim();
							return '<div class="project-modal__build-item"><strong>' + label + '</strong> ' + value + '</div>';
						}

						return '<div class="project-modal__build-item">' + trimmedLine + '</div>';
					}).join('');
				};

				var openLightbox = function(src, alt) {
					if (!src) return;
					$lightboxImg.attr('src', src).attr('alt', alt || '');
					$lightbox.addClass('is-visible').attr('aria-hidden', 'false');
					$body.addClass('lightbox-open');
				};

				var closeLightbox = function() {
					$lightbox.removeClass('is-visible').attr('aria-hidden', 'true');
					$lightboxImg.attr('src', '').attr('alt', '');
					$body.removeClass('lightbox-open');
				};

				var renderMedia = function(index) {
					var item = activeMedia[index];
					if (!item)
						return;

					activeIndex = index;
					$mediaMain.empty();
					$mediaMain.css('background-image', 'none');

					if (item.type === 'video') {
						$mediaMain.removeClass('is-image');
						$('<video controls playsinline preload="auto"></video>')
							.attr('src', item.src)
							.attr('aria-label', item.alt || 'Video del proyecto')
							.appendTo($mediaMain);
					}
					else {
						$mediaMain.addClass('is-image');
						$('<img />')
							.attr('src', item.src)
							.attr('alt', item.alt || 'Imagen del proyecto')
							.appendTo($mediaMain);
					}

					$thumbs.find('.project-modal__thumb').removeClass('is-active');
					$thumbs.find('.project-modal__thumb').eq(index).addClass('is-active');

					$prev.prop('disabled', index === 0);
					$next.prop('disabled', index === activeMedia.length - 1);
				};

				var openModal = function(projectKey) {
					var project = projectCatalog[projectKey];
					if (!project)
						return;

					activeProject = project;
					$title.text(project.title);
					$summary.text(project.summary);
					$build.html(formatBuildText(project.build));

					$tech.empty();
					$tech.prev('.project-modal__tech-heading').remove();
					$('<h4 class="project-modal__tech-heading">Tecnologías:</h4>').insertBefore($tech);
					$.each(project.technologies, function(_, tech) {
						$('<li></li>').text(tech).appendTo($tech);
					});

					// Work on a copy of media to ensure video appears first
					activeMedia = project.media.slice();
					var vidIndex = activeMedia.findIndex(function(m) { return m.type === 'video'; });
					if (vidIndex > 0) {
						var vidItem = activeMedia.splice(vidIndex, 1)[0];
						activeMedia.unshift(vidItem);
					}

					$thumbs.empty();
					$.each(activeMedia, function(mediaIndex, mediaItem) {
						var $thumbButton = $('<button type="button" class="project-modal__thumb"></button>')
							.attr('aria-label', 'Mostrar recurso ' + (mediaIndex + 1))
							.on('click', function() {
								renderMedia(mediaIndex);
							});

						if (mediaItem.type === 'video') {
							$('<video muted playsinline preload="metadata"></video>')
								.attr('src', mediaItem.src)
								.attr('poster', mediaItem.poster || '')
								.appendTo($thumbButton);
						}
						else {
							$('<img />')
								.attr('src', mediaItem.src)
								.attr('alt', mediaItem.alt || 'Miniatura del proyecto')
								.appendTo($thumbButton);
						}

						$thumbButton.appendTo($thumbs);
					});

					if (activeMedia.length <= 1) {
						$thumbs.hide();
						$prev.hide();
						$next.hide();
					}
					else {
						$thumbs.show();
						$prev.show();
						$next.show();
					}

					renderMedia(0);

					$modal.addClass('is-visible').attr('aria-hidden', 'false');
					$body.addClass('modal-open');
				};

				var closeModal = function() {
					closeLightbox();
					$modal.removeClass('is-visible').attr('aria-hidden', 'true');
					$body.removeClass('modal-open');
				};

				$('.project-trigger').on('click', function(e) {
					e.preventDefault();
					openModal($(this).data('project'));
				});

				$modal.on('click', '[data-modal-close]', function() {
					closeModal();
				});

				$mediaMain.on('click', function() {
					var currentItem = activeMedia[activeIndex];
					if (currentItem && currentItem.type === 'image')
						openLightbox(currentItem.src, currentItem.alt);
				});

				$prev.on('click', function() {
					if (activeProject && activeIndex > 0)
						renderMedia(activeIndex - 1);
				});

				$next.on('click', function() {
					if (activeProject && activeIndex < activeMedia.length - 1)
						renderMedia(activeIndex + 1);
				});

				$(document).on('keydown', function(e) {
					// Close modal or lightbox with Escape
					if (e.key === 'Escape') {
						if ($lightbox.hasClass('is-visible')) {
							closeLightbox();
							return;
						}
						if ($modal.hasClass('is-visible')) {
							closeModal();
							return;
						}
					}

					if (!$modal.hasClass('is-visible'))
						return;

					if (e.key === 'ArrowLeft' && activeIndex > 0)
						renderMedia(activeIndex - 1);

					if (e.key === 'ArrowRight' && activeProject && activeIndex < activeMedia.length - 1)
						renderMedia(activeIndex + 1);
				});

				$(document).on('click', '[data-lightbox-close]', function() {
					closeLightbox();
				});

				$lightbox.on('click', '.lightbox__backdrop', function() {
					closeLightbox();
				});
			}

})(jQuery);