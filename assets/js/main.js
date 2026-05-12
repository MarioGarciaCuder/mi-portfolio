/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

						build: 'Arquitectura y Stack:\n\nAPI REST (Node.js/Express): Endpoints CRUD para carga de Excel, procesamiento de datos y envío masivo. Autenticación SMTP con Gmail/Google Workspace, manejo de errores con retry automático, rate limiting concurrente (configurable) y logging estructurado para auditoría de operaciones.\nValidación y Procesamiento de Datos: Normalización automática de cabeceras Excel (espacios, mayúsculas, tildes). Validación granular por fila: campos obligatorios (Cliente, Email_Cliente, CUPS, Compañía, Agente), formato de email (regex robusto), estado visual inmediato (rojo/amarillo/verde). Consolidación de datos con fallback automático de Email_Agente desde configuración externa.\nGeneración de Plantillas HTML: Generador dinámico de email HTML responsive (600px) con variables personalizables del Excel: Cliente, Email, CUPS, Tipo, Compañía, Agente. Imágenes embebidas por CID en Nodemailer para funcionamiento offline. Botones CTA (WhatsApp, Reseña Google) configurables. Footer con enlaces legales y copyright editables.\nFrontend Interactivo: Interfaz web responsive (HTML5 + CSS3 + Vanilla JavaScript) con carga de archivos Excel, visualización de tabla con validaciones en tiempo real, campos editables, modo simulación para testeos sin envío real, descarga de reportes en Excel.\nReportes y Auditoría: Generación de Excel descargable con resultados individuales por email: estado de envío, detalle de error (si aplica), remitente utilizado, timestamp. Modo simulación para validar flujo completo sin enviar correos reales. Resumen estadístico: total procesados, exitosos, errores.',
						technologies: ['Node.js', 'Express', 'JavaScript', 'HTML5', 'CSS3', 'XLSX', 'Nodemailer', 'Multer', 'Gmail SMTP'],
						media: [
							{ type: 'video', src: 'videos/mailbot-demo.mp4', alt: 'Demo en video de Mailbot', poster: 'images/mailbot-1.png' },
							{ type: 'image', src: 'images/mailbot-1.png', alt: 'Pantalla principal de Mailbot' },
							{ type: 'image', src: 'images/mailbot-2.png', alt: 'Vista de gestion de notificaciones de Mailbot' }
						]
					}
				};

				// Email popover.
					var $emailPopover = $('#email-modal');

					if ($emailPopover.length) {
						var $emailTrigger = $('.email-trigger');
						var $emailInput = $('#email-modal-input');
						var $emailCopy = $('#email-modal-copy');
						var $emailFeedback = $('#email-modal-feedback');
						var emailValue = $emailInput.val();
						var feedbackTimer = null;

						var setEmailFeedback = function(message, isError) {
							window.clearTimeout(feedbackTimer);
							$emailFeedback.text(message || '').css('color', isError ? '#b33c3c' : '#2d7a46');

							if (message) {
								feedbackTimer = window.setTimeout(function() {
									$emailFeedback.text('');
								}, 1600);
							}
						};

						var placeEmailPopover = function(triggerEl) {
							var triggerRect = triggerEl.getBoundingClientRect();
							var popoverEl = $emailPopover[0];
							var popoverWidth = Math.min(popoverEl.offsetWidth || 360, window.innerWidth - 18);
							var popoverHeight = popoverEl.offsetHeight || 220;
							var gap = 12;
							var left = triggerRect.right + gap;
							var top = triggerRect.top + (triggerRect.height / 2) - (popoverHeight / 2);

							if (left + popoverWidth > window.innerWidth - 12)
								left = triggerRect.left - popoverWidth - gap;

							if (left < 12)
								left = 12;

							if (top < 12)
								top = 12;

							if (top + popoverHeight > window.innerHeight - 12)
								top = Math.max(12, window.innerHeight - popoverHeight - 12);

							$emailPopover.css({
								top: top + 'px',
								left: left + 'px'
							});
						};

						var openEmailPopover = function(triggerEl) {
							$emailPopover.addClass('is-visible').attr('aria-hidden', 'false');
							$body.addClass('email-modal-open');
							setEmailFeedback('');
							placeEmailPopover(triggerEl);

							window.requestAnimationFrame(function() {
								$emailInput.trigger('focus').trigger('select');
							});
						};

						var closeEmailPopover = function() {
							window.clearTimeout(feedbackTimer);
							$emailPopover.removeClass('is-visible').attr('aria-hidden', 'true');
							$body.removeClass('email-modal-open');
							setEmailFeedback('');
						};

						var copyEmailToClipboard = function() {
							var copyPromise = null;

							if (navigator.clipboard && navigator.clipboard.writeText) {
								copyPromise = navigator.clipboard.writeText(emailValue);
							}
							else {
								$emailInput.trigger('focus').trigger('select');
								try {
									var copied = document.execCommand('copy');
									copyPromise = copied ? $.Deferred().resolve().promise() : $.Deferred().reject().promise();
								}
								catch (error) {
									copyPromise = $.Deferred().reject(error).promise();
								}
							}

							$.when(copyPromise)
								.done(function() {
									setEmailFeedback('Correo copiado al portapapeles.');
								})
								.fail(function() {
									setEmailFeedback('No se pudo copiar automáticamente. Selecciónalo manualmente.', true);
								});
						};

						$emailTrigger.on('click', function(e) {
							e.preventDefault();
							openEmailPopover(this);
						});

						$emailPopover.on('click', '[data-email-modal-close]', function() {
							closeEmailPopover();
						});

						$emailCopy.on('click', function() {
							copyEmailToClipboard();
						});

						$(document).on('click', function(e) {
							if (!$emailPopover.hasClass('is-visible'))
								return;

							if ($(e.target).closest('#email-modal, .email-trigger').length)
								return;

							closeEmailPopover();
						});

						$(document).on('keydown', function(e) {
							if (e.key === 'Escape' && $emailPopover.hasClass('is-visible')) {
								closeEmailPopover();
							}
						});

						$(window).on('resize scroll', function() {
							if ($emailPopover.hasClass('is-visible'))
								placeEmailPopover($emailTrigger.get(0));
						});
					}
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