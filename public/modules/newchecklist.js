$(document).ready(function() {
  var photoStream = null;
  var videoStream = null;
  var mediaRecorder = null;
  var recordedChunks = [];
  var photos = [];
  var videos = [];
  var timerInterval = null;
  var recordingStartTime = null;
  var currentFacingMode = 'environment';
  var budgetItems = [];
  var budgetPhotoStream = null;
  var budgetVideoStream = null;
  var budgetMediaRecorder = null;
  var budgetRecordedChunks = [];
  var budgetPhotos = [];
  var budgetVideos = [];
  var budgetTimerInterval = null;
  var budgetRecordingStartTime = null;
  var budgetFacingMode = 'environment';

  function setCurrentDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    $('#dt_service').val(year + '-' + month + '-' + day);
    $('#hr_service').val(hours + ':' + minutes);
  }

  setCurrentDateTime();

  // ===================== AUTO-GERAR NR_WORKORDER =====================

  function generateWorkorder() {
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var yyyy = now.getFullYear();
    var HH = String(now.getHours()).padStart(2, '0');
    var min = String(now.getMinutes()).padStart(2, '0');
    return dd + mm + yyyy + HH + min;
  }

  $('#nr_workorder').val(generateWorkorder());
  $('#nr_workorder_step2').val($('#nr_workorder').val());

  // ===================== SALVAR ABA 2 VIA AJAX =====================

  function saveStep2Data(callback, options) {
    $('#nr_workorder_step2').val($('#nr_workorder').val());
    var formData = $('#formChecklistStep2').serialize();
    if (options) {
      if (options.current_step !== undefined) formData += '&current_step=' + options.current_step;
      if (options.id_status !== undefined) formData += '&id_status=' + options.id_status;
    }
    $.ajax({
      url: '/save_checklist_vehicle',
      method: 'POST',
      data: formData,
      dataType: 'json',
      success: function(response) {
        if (typeof callback === 'function') callback(response);
      },
      error: function() {
        if (typeof callback === 'function') callback({ success: false });
      }
    });
  }

  // ===================== SALVAR ABA 3 (MÍDIA) VIA AJAX =====================

  function saveStep3Media(callback, options) {
    if (photos.length === 0 && videos.length === 0) {
      if (options && (options.current_step !== undefined || options.id_status !== undefined)) {
        var postData = { nr_workorder: $('#nr_workorder').val() };
        if (options.current_step !== undefined) postData.current_step = options.current_step;
        if (options.id_status !== undefined) postData.id_status = options.id_status;
        $.ajax({
          url: '/save_checklist_media',
          method: 'POST',
          data: postData,
          dataType: 'json',
          success: function(response) { if (typeof callback === 'function') callback(response); },
          error: function() { if (typeof callback === 'function') callback({ success: false }); }
        });
        return;
      }
      if (typeof callback === 'function') callback({ success: true, message: 'Nenhuma mídia para salvar' });
      return;
    }

    var formData = new FormData();
    formData.append('nr_workorder', $('#nr_workorder').val());
    if (options) {
      if (options.current_step !== undefined) formData.append('current_step', options.current_step);
      if (options.id_status !== undefined) formData.append('id_status', options.id_status);
    }

    var pendingUploads = photos.length + videos.length;
    var uploadStarted = false;

    function checkComplete() {
      pendingUploads--;
      if (pendingUploads <= 0 && uploadStarted) {
        doUpload();
      }
    }

    function dataURLtoBlob(dataURL) {
      var parts = dataURL.split(',');
      var mime = parts[0].match(/:(.*?);/)[1];
      var binary = atob(parts[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: mime });
    }

    // Converter fotos (base64) para blobs
    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var blob = dataURLtoBlob(photo.data);
      formData.append('photos[]', blob, 'foto_' + (i + 1) + '.jpg');
      formData.append('photo_descriptions[]', 'Foto ' + (i + 1) + ' - ' + photo.timestamp);
      checkComplete();
    }

    // Converter vídeos (blob) para file
    for (var j = 0; j < videos.length; j++) {
      var video = videos[j];
      if (video.blob) {
        formData.append('videos[]', video.blob, 'video_' + (j + 1) + '.webm');
        formData.append('video_descriptions[]', 'Vídeo ' + (j + 1) + ' - ' + video.timestamp);
      }
      checkComplete();
    }

    function doUpload() {
      $.ajax({
        url: '/save_checklist_media',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(response) {
          console.log('Mídia salva:', response);
          if (typeof callback === 'function') callback(response);
        },
        error: function(xhr, status, error) {
          console.error('Erro ao salvar mídia:', error);
          if (typeof callback === 'function') callback({ success: false });
        }
      });
    }

    // Se não houve conversão async, fazer upload imediatamente
    if (pendingUploads <= 0) {
      doUpload();
    }
  }

  // ===================== SALVAR ABA 1 VIA AJAX =====================

  function saveStep1Data(callback, options) {
    var formData = $('#formChecklistStep1').serialize();
    if (options) {
      if (options.current_step !== undefined) formData += '&current_step=' + options.current_step;
      if (options.id_status !== undefined) formData += '&id_status=' + options.id_status;
    }

    $.ajax({
      url: '/save_checklist_attendance',
      method: 'POST',
      data: formData,
      dataType: 'json',
       success: function(response) {
            console.log('Resposta do servidor:', response);

            if (typeof callback === 'function') {
                callback(response);
            }
        },
       error: function(xhr, status, error) {
            console.error('Erro AJAX:', error);
            console.error('Resposta:', xhr.responseText);

            if (typeof callback === 'function') {
                callback({ success: false });
            }
        }
    });
  }

  // ===================== CARREGAR MÃO DE OBRA =====================

  function loadLaborforces() {
    $.getJSON('/get_all_laborforces', function(laborforces) {
      var $select = $('#id_laborforce');
      $select.find('option:gt(0)').remove();
      $.each(laborforces, function(i, lf) {
        $select.append(
          '<option value="' + lf.id + '" data-vl-labor="' + (lf.vl_labor || 0) + '">' +
          lf.ds_type + ' - R$ ' + parseFloat(lf.vl_labor).toFixed(2).replace('.', ',') +
          '/h' +
          '</option>'
        );
      });
    }).fail(function() {
      console.error('Erro ao carregar m\u00e3os de obra.');
    });
  }

  loadLaborforces();

  // ===================== CARREGAR PRODUTOS =====================

  function loadProducts() {
    $.getJSON('/get_all_products', function(products) {
      var $select = $('#budget_part');
      var $editSelect = $('#edit_budget_part');
      $select.find('option:gt(0)').remove();
      $editSelect.find('option:gt(0)').remove();
      $.each(products, function(i, p) {
        var price = parseFloat(p.sale_price || 0).toFixed(2).replace('.', ',');
        var option = '<option value="' + p.id + '" data-name="' + escapeHtml(p.ds_product) +
          '" data-unit="' + escapeHtml(p.unit || '') +
          '" data-price="' + (p.sale_price || 0) + '">' +
          p.ds_product + ' (' + (p.unit || 'UN') + ') - R$ ' + price +
          '</option>';
        $select.append(option);
        $editSelect.append(option);
      });
    }).fail(function() {
      console.error('Erro ao carregar produtos.');
    });
  }

  loadProducts();

  $('#budget_part').on('change', function() {
    var $option = $(this).find('option:selected');
    if ($option.val()) {
      var price = parseFloat($option.data('price')) || 0;
      $('#budget_unit_price').val(price.toFixed(2).replace('.', ','));
    } else {
      $('#budget_unit_price').val('');
    }
  });

  $('#edit_budget_part').on('change', function() {
    var $option = $(this).find('option:selected');
    if ($option.val()) {
      var price = parseFloat($option.data('price')) || 0;
      $('#edit_budget_unit_price').val(price.toFixed(2).replace('.', ','));
    }
  });

  function updateFuelGauge(value) {
    var $gaugeFill = $('#fuelGaugeFill');
    var $percentage = $('#fuelPercentage');

    $gaugeFill.css('width', value + '%');
    $percentage.text(value + '%');

    $gaugeFill.removeClass('fuel-danger fuel-warning fuel-caution fuel-success');

    if (value <= 25) {
      $gaugeFill.addClass('fuel-danger');
      $percentage.css('color', '#ff0000');
    } else if (value <= 49) {
      $gaugeFill.addClass('fuel-warning');
      $percentage.css('color', '#ff8c00');
    } else if (value <= 74) {
      $gaugeFill.addClass('fuel-caution');
      $percentage.css('color', '#ffd700');
    } else {
      $gaugeFill.addClass('fuel-success');
      $percentage.css('color', '#28a745');
    }
  }

  updateFuelGauge(50);

  $('#fuelSlider').on('input', function() {
    updateFuelGauge(parseInt($(this).val()));
  });

  async function startCamera(videoElement, type) {
    try {
      var constraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: type === 'video'
      };

      var stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;

      if (type === 'photo') {
        photoStream = stream;
        $('#btnCapturePhoto').prop('disabled', false);
      } else {
        videoStream = stream;
        $('#btnStartRecording').prop('disabled', false);
      }

      return stream;
    } catch (err) {
      console.error('Erro ao acessar c\u00e2mera:', err);
      alert('N\u00e3o foi poss\u00edvel acessar a c\u00e2mera. Verifique as permiss\u00f5es.');
      return null;
    }
  }

  function stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }

  function initCameras() {
    startCamera($('#cameraPreview')[0], 'photo');
    startCamera($('#videoPreview')[0], 'video');
  }

  function stopAllCameras() {
    stopCamera(photoStream);
    stopCamera(videoStream);
    photoStream = null;
    videoStream = null;
  }

  $('#btnCapturePhoto').click(function() {
    var video = $('#cameraPreview')[0];
    var canvas = $('#photoCanvas')[0];
    var context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var photoData = canvas.toDataURL('image/jpeg', 0.8);
    var timestamp = new Date().toLocaleString('pt-BR');

    photos.push({
      data: photoData,
      timestamp: timestamp,
      id: Date.now()
    });

    renderPhotoCard(photos[photos.length - 1]);
    updateMediaCounters();
  });

  function renderPhotoCard(photo) {
    var cardHtml = '<div class="media-card" data-id="' + photo.id + '">' +
      '<div style="position: relative;">' +
        '<img src="' + photo.data + '" class="media-card-preview photo-preview" data-id="' + photo.id + '">' +
        '<span class="media-badge badge-photo"><i class="fa fa-camera"></i> Foto</span>' +
      '</div>' +
      '<div class="media-card-body">' +
        '<p class="media-card-title">Foto ' + photos.length + '</p>' +
        '<p class="media-card-info"><i class="fa fa-clock-o"></i> ' + photo.timestamp + '</p>' +
      '</div>' +
      '<div class="media-card-actions">' +
        '<button class="btn btn-xs btn-info btn-preview-photo" data-id="' + photo.id + '">' +
          '<i class="fa fa-eye"></i> Ver' +
        '</button>' +
        '<button class="btn btn-xs btn-danger btn-delete-photo" data-id="' + photo.id + '">' +
          '<i class="fa fa-trash"></i> Excluir' +
        '</button>' +
      '</div>' +
    '</div>';

    $('#photosContainer').prepend(cardHtml);
  }

  $('#btnStartRecording').click(function() {
    recordedChunks = [];

    var options = { mimeType: 'video/webm;codecs=vp9,opus' };

    try {
      mediaRecorder = new MediaRecorder(videoStream, options);
    } catch (err) {
      options = { mimeType: 'video/webm;codecs=vp8,opus' };
      try {
        mediaRecorder = new MediaRecorder(videoStream, options);
      } catch (err2) {
        options = { mimeType: 'video/webm' };
        mediaRecorder = new MediaRecorder(videoStream, options);
      }
    }

    mediaRecorder.ondataavailable = function(event) {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = function() {
      var blob = new Blob(recordedChunks, { type: 'video/webm' });
      var url = URL.createObjectURL(blob);
      var timestamp = new Date().toLocaleString('pt-BR');
      var duration = Math.floor((Date.now() - recordingStartTime) / 1000);

      videos.push({
        url: url,
        blob: blob,
        timestamp: timestamp,
        duration: formatDuration(duration),
        id: Date.now()
      });

      renderVideoCard(videos[videos.length - 1]);
      updateMediaCounters();
    };

    mediaRecorder.start(100);
    recordingStartTime = Date.now();

    $('#btnStartRecording').prop('disabled', true);
    $('#btnStopRecording').prop('disabled', false);
    $('#recordingTimer').show();

    startTimer();
  });

  $('#btnStopRecording').click(function() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    $('#btnStartRecording').prop('disabled', false);
    $('#btnStopRecording').prop('disabled', true);
    $('#recordingTimer').hide();

    stopTimer();
  });

  function startTimer() {
    timerInterval = setInterval(function() {
      var elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
      $('#timerDisplay').text(formatDuration(elapsed));
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    $('#timerDisplay').text('00:00');
  }

  function formatDuration(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function renderVideoCard(video) {
    var cardHtml = '<div class="media-card" data-id="' + video.id + '">' +
      '<div style="position: relative;">' +
        '<video class="media-card-video video-preview" data-url="' + video.url + '" muted>' +
          '<source src="' + video.url + '" type="video/webm">' +
        '</video>' +
        '<span class="media-badge badge-video"><i class="fa fa-video-camera"></i> V\u00eddeo</span>' +
      '</div>' +
      '<div class="media-card-body">' +
        '<p class="media-card-title">V\u00eddeo ' + videos.length + '</p>' +
        '<p class="media-card-info">' +
          '<i class="fa fa-clock-o"></i> ' + video.timestamp + '<br>' +
          '<i class="fa fa-film"></i> Dura\u00e7\u00e3o: ' + video.duration +
        '</p>' +
      '</div>' +
      '<div class="media-card-actions">' +
        '<button class="btn btn-xs btn-info btn-preview-video" data-url="' + video.url + '">' +
          '<i class="fa fa-play"></i> Assistir' +
        '</button>' +
        '<button class="btn btn-xs btn-danger btn-delete-video" data-id="' + video.id + '">' +
          '<i class="fa fa-trash"></i> Excluir' +
        '</button>' +
      '</div>' +
    '</div>';

    $('#videosContainer').prepend(cardHtml);
  }

  function updateMediaCounters() {
    $('#photoCounter').html('<i class="fa fa-camera"></i> Fotos: ' + photos.length);
    $('#videoCounter').html('<i class="fa fa-video-camera"></i> V\u00eddeos: ' + videos.length);
  }

  $(document).on('click', '.photo-preview, .btn-preview-photo', function() {
    var id = $(this).closest('.media-card').data('id');
    var photo = photos.find(function(p) { return p.id === id; });

    if (photo) {
      $('#mediaPreviewTitle').text('Preview da Foto');
      $('#mediaPreviewContent').html('<img src="' + photo.data + '" style="max-width: 100%; max-height: 500px;">');
      $('#modalMediaPreview').modal('show');
    }
  });

  $(document).on('click', '.video-preview, .btn-preview-video', function() {
    var url = $(this).data('url') || $(this).closest('.media-card').find('.video-preview').data('url');

    if (url) {
      $('#mediaPreviewTitle').text('Preview do V\u00eddeo');
      $('#mediaPreviewContent').html(
        '<video controls autoplay style="max-width: 100%; max-height: 500px;">' +
          '<source src="' + url + '" type="video/webm">' +
        '</video>'
      );
      $('#modalMediaPreview').modal('show');
    }
  });

  var pendingDelete = null;

  $(document).on('click', '.btn-delete-photo', function() {
    var id = $(this).closest('.media-card').data('id');
    var cardElement = $(this).closest('.media-card');
    var photoIndex = photos.findIndex(function(p) { return p.id === id; });

    pendingDelete = {
      type: 'photo',
      id: id,
      element: cardElement,
      name: 'Foto ' + (photoIndex + 1)
    };

    $('#deleteMessage').text('Tem certeza que deseja excluir esta foto?');
    $('#deleteItemName').text(pendingDelete.name);
    $('#modalConfirmDelete').modal('show');
  });

  $(document).on('click', '.btn-delete-video', function() {
    var id = $(this).closest('.media-card').data('id');
    var cardElement = $(this).closest('.media-card');
    var videoIndex = videos.findIndex(function(v) { return v.id === id; });

    pendingDelete = {
      type: 'video',
      id: id,
      element: cardElement,
      name: 'V\u00eddeo ' + (videoIndex + 1)
    };

    $('#deleteMessage').text('Tem certeza que deseja excluir este v\u00eddeo?');
    $('#deleteItemName').text(pendingDelete.name);
    $('#modalConfirmDelete').modal('show');
  });

  $('#btnConfirmDelete').click(function() {
    if (!pendingDelete) return;

    if (pendingDelete.type === 'photo') {
      photos = photos.filter(function(p) { return p.id !== pendingDelete.id; });
      pendingDelete.element.fadeOut(300, function() {
        $(this).remove();
        updateMediaCounters();
      });
    } else if (pendingDelete.type === 'video') {
      var video = videos.find(function(v) { return v.id === pendingDelete.id; });
      if (video) {
        URL.revokeObjectURL(video.url);
      }
      videos = videos.filter(function(v) { return v.id !== pendingDelete.id; });
      pendingDelete.element.fadeOut(300, function() {
        $(this).remove();
        updateMediaCounters();
      });
    }

    pendingDelete = null;
    $('#modalConfirmDelete').modal('hide');
  });

  $('#modalConfirmDelete').on('hidden.bs.modal', function() {
    pendingDelete = null;
  });

  $('#btnToggleCamera').click(function() {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    stopCamera(photoStream);
    startCamera($('#cameraPreview')[0], 'photo');
  });

  function validateStep(stepNumber) {
    var missingFields = [];
    $('#step' + stepNumber + ' input[required], #step' + stepNumber + ' textarea[required], #step' + stepNumber + ' select[required]').each(function() {
      if (!$(this).val() || !$(this).val().trim()) {
        var label = $(this).closest('.form-group').find('label').text();
        missingFields.push(label);
        $(this).closest('.form-group').addClass('has-error');
      } else {
        $(this).closest('.form-group').removeClass('has-error');
      }
    });

    if (missingFields.length > 0) {
      var listHtml = '';
      $.each(missingFields, function(i, field) {
        listHtml += '<li class="list-group-item"><i class="fa fa-times text-danger"></i> ' + field + '</li>';
      });
      $('#validationList').html(listHtml);
      $('#modalValidation').modal('show');
      return false;
    }
    return true;
  }

  function switchToStep(targetStep) {
    var currentStep = parseInt($('.wizard-steps li.active').data('step'));

    if (targetStep === currentStep) return;

    // Validar apenas a aba atual ao avançar
    if (targetStep > currentStep) {
      if (!validateStep(currentStep)) return;
    }

    // Salvar aba 1 silenciosamente ao sair
    if (currentStep === 1 && targetStep !== 1) {
      saveStep1Data(function() {
        proceedToStep(currentStep, targetStep);
      });
      return;
    }

    // Salvar aba 2 silenciosamente ao sair
    if (currentStep === 2 && targetStep !== 2) {
      saveStep2Data(function() {
        proceedToStep(currentStep, targetStep);
      }, { current_step: 2 });
      return;
    }

    // Salvar aba 3 (mídia) silenciosamente ao sair
    if (currentStep === 3 && targetStep !== 3) {
      saveStep3Media(function() {
        proceedToStep(currentStep, targetStep);
      }, { current_step: 3 });
      return;
    }

    // Salvar aba 4 (orçamento + mídia das peças) silenciosamente ao sair
    if (currentStep === 4 && targetStep !== 4) {
      saveStep4Budget(function() {
        saveStep4BudgetMedia(function() {
          proceedToStep(currentStep, targetStep);
        }, { current_step: 4 });
      }, { current_step: 4 });
      return;
    }

    proceedToStep(currentStep, targetStep);
  }

  function proceedToStep(currentStep, targetStep) {
    if (currentStep === 3) {
      stopAllCameras();
      stopTimer();
    }
    if (currentStep === 4) {
      stopAllBudgetCameras();
      stopBudgetTimer();
    }

    $('#step' + currentStep).hide();
    $('#step' + targetStep).show();

    $('.wizard-steps li').removeClass('active');
    $('.wizard-steps li[data-step="' + targetStep + '"]').addClass('active');

    if (targetStep === 3) {
      initCameras();
      updateMediaCounters();
    }
    if (targetStep === 4) {
      initBudgetCameras();
    }
  }

  $('.wizard-steps li').click(function(e) {
    e.preventDefault();
    var targetStep = parseInt($(this).data('step'));
    switchToStep(targetStep);
  });

  $('.btn-next').click(function() {
    var currentStep = $(this).data('step');
    switchToStep(currentStep + 1);
  });

  $('.btn-prev').click(function() {
    var currentStep = $(this).data('step');
    switchToStep(currentStep - 1);
  });

  // ===================== ORÇAMENTO =====================

  function formatCurrency(value) {
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function getLaborValuePerHour() {
    var $labor = $('#id_laborforce option:selected');
    return parseFloat($labor.data('vl-labor')) || 0;
  }

  function parseTimeToHours(timeStr) {
    if (!timeStr) return { h: 0, m: 0, total: 0 };
    var parts = timeStr.split(':');
    var h = parseInt(parts[0]) || 0;
    var m = parseInt(parts[1]) || 0;
    if (m > 59) m = 59;
    return { h: h, m: m, total: h + m / 60 };
  }

  function calculateLaborValue(timeStr) {
    var parsed = parseTimeToHours(timeStr);
    return parsed.total * getLaborValuePerHour();
  }

  function formatTimeDisplay(timeStr) {
    var parsed = parseTimeToHours(timeStr);
    if (parsed.h > 0 && parsed.m > 0) return parsed.h + 'h ' + parsed.m + 'min';
    if (parsed.h > 0) return parsed.h + 'h';
    return parsed.m + 'min';
  }

  function showBudgetValidation(missingFields) {
    var listHtml = '';
    $.each(missingFields, function(i, field) {
      listHtml += '<li class="list-group-item"><i class="fa fa-times text-danger"></i> ' + field + '</li>';
    });
    $('#budgetValidationList').html(listHtml);
    $('#modalBudgetValidation').modal('show');
  }

  function addBudgetItem() {
    var qty = parseInt($('#budget_qty').val()) || 0;
    var $selectedOption = $('#budget_part option:selected');
    var productId = $selectedOption.val() || null;
    var part = productId ? $selectedOption.data('name') || '' : '';
    var laborDesc = $('#budget_labor_desc').val().trim();
    var timeStr = $('#budget_time').val().trim();
    var unitPriceStr = $('#budget_unit_price').val().trim().replace(',', '.');
    var unitPrice = parseFloat(unitPriceStr) || 0;
    var parsedTime = parseTimeToHours(timeStr);

    var missing = [];
    if (qty <= 0) missing.push('Quantidade');
    if (!productId) missing.push('Descrição da Peça');
    if (!laborDesc) missing.push('Descrição da Mão de Obra');
    if (!timeStr || parsedTime.total <= 0) missing.push('Tempo');
    if (unitPrice <= 0) missing.push('Valor Unitário da Peça');

    if (missing.length > 0) {
      showBudgetValidation(missing);
      return;
    }

    var laborValue = calculateLaborValue(timeStr);
    var laborTimeMinutes = parsedTime.h * 60 + parsedTime.m;

    budgetItems.push({
      id: Date.now(),
      product_id: productId,
      qty: qty,
      part: part,
      laborDesc: laborDesc,
      time: timeStr,
      laborTimeMinutes: laborTimeMinutes,
      laborValue: laborValue,
      unitPrice: unitPrice,
      totalPart: qty * unitPrice
    });

    renderBudgetTable();
    clearBudgetForm();
    $('#budget_part').focus();
  }

  function clearBudgetForm() {
    $('#budget_qty').val(1);
    $('#budget_part').val('');
    $('#budget_labor_desc').val('');
    $('#budget_time').val('');
    $('#budget_unit_price').val('');
  }

  var pendingBudgetDeleteId = null;

  function confirmRemoveBudgetItem(id) {
    var item = budgetItems.find(function(it) { return it.id === id; });
    if (!item) return;
    pendingBudgetDeleteId = id;
    $('#budgetDeleteItemName').text(item.qty + 'x ' + item.part);
    $('#modalBudgetDeleteConfirm').modal('show');
  }

  $('#btnConfirmBudgetDelete').click(function() {
    if (pendingBudgetDeleteId === null) return;
    budgetItems = budgetItems.filter(function(item) { return item.id !== pendingBudgetDeleteId; });
    pendingBudgetDeleteId = null;
    renderBudgetTable();
    $('#modalBudgetDeleteConfirm').modal('hide');
  });

  function editBudgetItem(id) {
    var item = budgetItems.find(function(it) { return it.id === id; });
    if (!item) return;
    $('#edit_budget_id').val(item.id);
    $('#edit_budget_qty').val(item.qty);
    $('#edit_budget_part').val(item.product_id || '');
    $('#edit_budget_labor_desc').val(item.laborDesc);
    $('#edit_budget_time').val(item.time);
    $('#edit_budget_unit_price').val(item.unitPrice.toString().replace('.', ','));
    $('#modalBudgetEdit').modal('show');
  }

  $('#btnSaveBudgetEdit').click(function() {
    var id = parseInt($('#edit_budget_id').val());
    var qty = parseInt($('#edit_budget_qty').val()) || 0;
    var $selectedOption = $('#edit_budget_part option:selected');
    var productId = $selectedOption.val() || null;
    var part = productId ? $selectedOption.data('name') || '' : '';
    var laborDesc = $('#edit_budget_labor_desc').val().trim();
    var timeStr = $('#edit_budget_time').val().trim();
    var unitPriceStr = $('#edit_budget_unit_price').val().trim().replace(',', '.');
    var unitPrice = parseFloat(unitPriceStr) || 0;
    var parsedTime = parseTimeToHours(timeStr);

    var missing = [];
    if (qty <= 0) missing.push('Quantidade');
    if (!productId) missing.push('Descrição da Peça');
    if (!laborDesc) missing.push('Descrição da Mão de Obra');
    if (!timeStr || parsedTime.total <= 0) missing.push('Tempo');
    if (unitPrice <= 0) missing.push('Valor Unitário da Peça');

    if (missing.length > 0) {
      showBudgetValidation(missing);
      return;
    }

    var laborValue = calculateLaborValue(timeStr);
    var laborTimeMinutes = parsedTime.h * 60 + parsedTime.m;

    for (var i = 0; i < budgetItems.length; i++) {
      if (budgetItems[i].id === id) {
        budgetItems[i].product_id = productId;
        budgetItems[i].qty = qty;
        budgetItems[i].part = part;
        budgetItems[i].laborDesc = laborDesc;
        budgetItems[i].time = timeStr;
        budgetItems[i].laborTimeMinutes = laborTimeMinutes;
        budgetItems[i].laborValue = laborValue;
        budgetItems[i].unitPrice = unitPrice;
        budgetItems[i].totalPart = qty * unitPrice;
        break;
      }
    }

    renderBudgetTable();
    $('#modalBudgetEdit').modal('hide');
  });

  function renderBudgetTable() {
    var $tbody = $('#budgetItemsBody');
    $tbody.empty();

    if (budgetItems.length === 0) {
      $tbody.html('<tr id="budgetEmptyRow"><td colspan="8" class="text-center text-muted">Nenhum item adicionado.</td></tr>');
      $('#budgetTotalParts').text(formatCurrency(0));
      $('#budgetTotalLabor').text(formatCurrency(0));
      $('#budgetTotalGeral').text(formatCurrency(0));
      return;
    }

    var totalParts = 0;
    var totalLabor = 0;

    for (var i = 0; i < budgetItems.length; i++) {
      var item = budgetItems[i];
      totalParts += item.totalPart;
      totalLabor += item.laborValue;

      var row = '<tr>' +
        '<td class="text-center">' + item.qty + '</td>' +
        '<td>' + escapeHtml(item.part) + '</td>' +
        '<td>' + escapeHtml(item.laborDesc) + '</td>' +
        '<td class="text-center">' + formatTimeDisplay(item.time) + '</td>' +
        '<td class="text-right">' + formatCurrency(item.laborValue) + '</td>' +
        '<td class="text-right">' + formatCurrency(item.unitPrice) + '</td>' +
        '<td class="text-right">' + formatCurrency(item.totalPart) + '</td>' +
        '<td class="text-center">' +
          '<button type="button" class="btn btn-info btn-xs btn-edit-budget-item" data-id="' + item.id + '" title="Editar">' +
            '<i class="fa fa-pencil"></i>' +
          '</button> ' +
          '<button type="button" class="btn btn-danger btn-xs btn-remove-budget-item" data-id="' + item.id + '" title="Excluir">' +
            '<i class="fa fa-trash"></i>' +
          '</button>' +
        '</td>' +
      '</tr>';
      $tbody.append(row);
    }

    $('#budgetTotalParts').text(formatCurrency(totalParts));
    $('#budgetTotalLabor').text(formatCurrency(totalLabor));
    $('#budgetTotalGeral').text(formatCurrency(totalParts + totalLabor));
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  $('#btnAddBudgetItem').click(function() {
    addBudgetItem();
  });

  $(document).on('click', '.btn-remove-budget-item', function() {
    var id = $(this).data('id');
    confirmRemoveBudgetItem(id);
  });

  $(document).on('click', '.btn-edit-budget-item', function() {
    var id = $(this).data('id');
    editBudgetItem(id);
  });

  // ===================== CÂMERAS DO ORÇAMENTO =====================

  async function startBudgetCamera(videoElement, type) {
    try {
      var constraints = {
        video: {
          facingMode: budgetFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: type === 'video'
      };
      var stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      if (type === 'photo') {
        budgetPhotoStream = stream;
        $('#btnBudgetCapturePhoto').prop('disabled', false);
      } else {
        budgetVideoStream = stream;
        $('#btnBudgetStartRecording').prop('disabled', false);
      }
      return stream;
    } catch (err) {
      console.error('Erro ao acessar c\u00e2mera (or\u00e7amento):', err);
      return null;
    }
  }

  function stopBudgetCamera(stream) {
    if (stream) {
      stream.getTracks().forEach(function(track) { track.stop(); });
    }
  }

  function initBudgetCameras() {
    startBudgetCamera($('#budgetCameraPreview')[0], 'photo');
    startBudgetCamera($('#budgetVideoPreview')[0], 'video');
  }

  function stopAllBudgetCameras() {
    stopBudgetCamera(budgetPhotoStream);
    stopBudgetCamera(budgetVideoStream);
    budgetPhotoStream = null;
    budgetVideoStream = null;
  }

  $('#btnBudgetCapturePhoto').click(function() {
    var video = $('#budgetCameraPreview')[0];
    var canvas = $('#budgetPhotoCanvas')[0];
    var context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var photoData = canvas.toDataURL('image/jpeg', 0.8);
    var timestamp = new Date().toLocaleString('pt-BR');
    budgetPhotos.push({ data: photoData, timestamp: timestamp, id: Date.now() });
    renderBudgetPhotoCard(budgetPhotos[budgetPhotos.length - 1]);
  });

  function renderBudgetPhotoCard(photo) {
    var cardHtml = '<div class="media-card" data-id="' + photo.id + '">' +
      '<div style="position: relative;">' +
        '<img src="' + photo.data + '" class="media-card-preview budget-photo-preview" data-id="' + photo.id + '">' +
        '<span class="media-badge badge-photo"><i class="fa fa-camera"></i> Foto</span>' +
      '</div>' +
      '<div class="media-card-body">' +
        '<p class="media-card-title">Foto ' + budgetPhotos.length + '</p>' +
        '<p class="media-card-info"><i class="fa fa-clock-o"></i> ' + photo.timestamp + '</p>' +
      '</div>' +
      '<div class="media-card-actions">' +
        '<button class="btn btn-xs btn-info btn-budget-preview-photo" data-id="' + photo.id + '">' +
          '<i class="fa fa-eye"></i> Ver' +
        '</button>' +
        '<button class="btn btn-xs btn-danger btn-budget-delete-photo" data-id="' + photo.id + '">' +
          '<i class="fa fa-trash"></i> Excluir' +
        '</button>' +
      '</div>' +
    '</div>';
    $('#budgetPhotosContainer').prepend(cardHtml);
  }

  $('#btnBudgetStartRecording').click(function() {
    budgetRecordedChunks = [];
    var options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
      budgetMediaRecorder = new MediaRecorder(budgetVideoStream, options);
    } catch (err) {
      options = { mimeType: 'video/webm;codecs=vp8,opus' };
      try {
        budgetMediaRecorder = new MediaRecorder(budgetVideoStream, options);
      } catch (err2) {
        options = { mimeType: 'video/webm' };
        budgetMediaRecorder = new MediaRecorder(budgetVideoStream, options);
      }
    }
    budgetMediaRecorder.ondataavailable = function(event) {
      if (event.data && event.data.size > 0) budgetRecordedChunks.push(event.data);
    };
    budgetMediaRecorder.onstop = function() {
      var blob = new Blob(budgetRecordedChunks, { type: 'video/webm' });
      var url = URL.createObjectURL(blob);
      var timestamp = new Date().toLocaleString('pt-BR');
      var duration = Math.floor((Date.now() - budgetRecordingStartTime) / 1000);
      budgetVideos.push({ url: url, blob: blob, timestamp: timestamp, duration: formatDuration(duration), id: Date.now() });
      renderBudgetVideoCard(budgetVideos[budgetVideos.length - 1]);
    };
    budgetMediaRecorder.start(100);
    budgetRecordingStartTime = Date.now();
    $('#btnBudgetStartRecording').prop('disabled', true);
    $('#btnBudgetStopRecording').prop('disabled', false);
    $('#budgetRecordingTimer').show();
    startBudgetTimer();
  });

  $('#btnBudgetStopRecording').click(function() {
    if (budgetMediaRecorder && budgetMediaRecorder.state !== 'inactive') budgetMediaRecorder.stop();
    $('#btnBudgetStartRecording').prop('disabled', false);
    $('#btnBudgetStopRecording').prop('disabled', true);
    $('#budgetRecordingTimer').hide();
    stopBudgetTimer();
  });

  function startBudgetTimer() {
    budgetTimerInterval = setInterval(function() {
      var elapsed = Math.floor((Date.now() - budgetRecordingStartTime) / 1000);
      $('#budgetTimerDisplay').text(formatDuration(elapsed));
    }, 1000);
  }

  function stopBudgetTimer() {
    clearInterval(budgetTimerInterval);
    budgetTimerInterval = null;
    $('#budgetTimerDisplay').text('00:00');
  }

  function renderBudgetVideoCard(video) {
    var cardHtml = '<div class="media-card" data-id="' + video.id + '">' +
      '<div style="position: relative;">' +
        '<video class="media-card-video budget-video-preview" data-url="' + video.url + '" muted>' +
          '<source src="' + video.url + '" type="video/webm">' +
        '</video>' +
        '<span class="media-badge badge-video"><i class="fa fa-video-camera"></i> V\u00eddeo</span>' +
      '</div>' +
      '<div class="media-card-body">' +
        '<p class="media-card-title">V\u00eddeo ' + budgetVideos.length + '</p>' +
        '<p class="media-card-info">' +
          '<i class="fa fa-clock-o"></i> ' + video.timestamp + '<br>' +
          '<i class="fa fa-film"></i> Dura\u00e7\u00e3o: ' + video.duration +
        '</p>' +
      '</div>' +
      '<div class="media-card-actions">' +
        '<button class="btn btn-xs btn-info btn-budget-preview-video" data-url="' + video.url + '">' +
          '<i class="fa fa-play"></i> Assistir' +
        '</button>' +
        '<button class="btn btn-xs btn-danger btn-budget-delete-video" data-id="' + video.id + '">' +
          '<i class="fa fa-trash"></i> Excluir' +
        '</button>' +
      '</div>' +
    '</div>';
    $('#budgetVideosContainer').prepend(cardHtml);
  }

  $(document).on('click', '.budget-photo-preview, .btn-budget-preview-photo', function() {
    var id = $(this).closest('.media-card').data('id');
    var photo = budgetPhotos.find(function(p) { return p.id === id; });
    if (photo) {
      $('#mediaPreviewTitle').text('Preview da Foto');
      $('#mediaPreviewContent').html('<img src="' + photo.data + '" style="max-width: 100%; max-height: 500px;">');
      $('#modalMediaPreview').modal('show');
    }
  });

  $(document).on('click', '.budget-video-preview, .btn-budget-preview-video', function() {
    var url = $(this).data('url') || $(this).closest('.media-card').find('.budget-video-preview').data('url');
    if (url) {
      $('#mediaPreviewTitle').text('Preview do V\u00eddeo');
      $('#mediaPreviewContent').html(
        '<video controls autoplay style="max-width: 100%; max-height: 500px;">' +
          '<source src="' + url + '" type="video/webm">' +
        '</video>'
      );
      $('#modalMediaPreview').modal('show');
    }
  });

  $(document).on('click', '.btn-budget-delete-photo', function() {
    var id = $(this).closest('.media-card').data('id');
    budgetPhotos = budgetPhotos.filter(function(p) { return p.id !== id; });
    $(this).closest('.media-card').fadeOut(300, function() { $(this).remove(); });
  });

  $(document).on('click', '.btn-budget-delete-video', function() {
    var id = $(this).closest('.media-card').data('id');
    var video = budgetVideos.find(function(v) { return v.id === id; });
    if (video) URL.revokeObjectURL(video.url);
    budgetVideos = budgetVideos.filter(function(v) { return v.id !== id; });
    $(this).closest('.media-card').fadeOut(300, function() { $(this).remove(); });
  });

  $('#btnBudgetToggleCamera').click(function() {
    budgetFacingMode = budgetFacingMode === 'environment' ? 'user' : 'environment';
    stopBudgetCamera(budgetPhotoStream);
    startBudgetCamera($('#budgetCameraPreview')[0], 'photo');
  });

  // ===================== SALVAR ABA 4 (ITENS ORÇAMENTO) VIA AJAX =====================

  function saveStep4Budget(callback, options) {
    if (budgetItems.length === 0) {
      if (options && (options.current_step !== undefined || options.id_status !== undefined)) {
        var postData = { nr_workorder: $('#nr_workorder').val(), items: '[]' };
        if (options.current_step !== undefined) postData.current_step = options.current_step;
        if (options.id_status !== undefined) postData.id_status = options.id_status;
        $.ajax({
          url: '/save_checklist_items',
          method: 'POST',
          data: postData,
          dataType: 'json',
          success: function(response) { if (typeof callback === 'function') callback(response); },
          error: function() { if (typeof callback === 'function') callback({ success: false }); }
        });
        return;
      }
      if (typeof callback === 'function') callback({ success: true, message: 'Nenhum item de orçamento' });
      return;
    }

    var items = budgetItems.map(function(item) {
      return {
        product_id: item.product_id,
        quantity: item.qty,
        unit_price: item.unitPrice,
        labor_time_minutes: item.laborTimeMinutes || 0
      };
    });

    var postData = {
      nr_workorder: $('#nr_workorder').val(),
      items: JSON.stringify(items)
    };
    if (options) {
      if (options.current_step !== undefined) postData.current_step = options.current_step;
      if (options.id_status !== undefined) postData.id_status = options.id_status;
    }

    $.ajax({
      url: '/save_checklist_items',
      method: 'POST',
      data: postData,
      dataType: 'json',
      success: function(response) {
        console.log('Itens do orçamento salvos:', response);
        if (typeof callback === 'function') callback(response);
      },
      error: function(xhr, status, error) {
        console.error('Erro ao salvar itens do orçamento:', error);
        if (typeof callback === 'function') callback({ success: false });
      }
    });
  }

  function saveStep4BudgetMedia(callback) {
    if (budgetPhotos.length === 0 && budgetVideos.length === 0) {
      if (typeof callback === 'function') callback({ success: true, message: 'Nenhuma mídia de peças' });
      return;
    }

    var formData = new FormData();
    formData.append('nr_workorder', $('#nr_workorder').val());

    for (var i = 0; i < budgetPhotos.length; i++) {
      var photo = budgetPhotos[i];
      var blob = dataURLtoBlob(photo.data);
      formData.append('photos[]', blob, 'peca_foto_' + (i + 1) + '.jpg');
      formData.append('photo_descriptions[]', 'Foto Peça ' + (i + 1) + ' - ' + photo.timestamp);
    }

    for (var j = 0; j < budgetVideos.length; j++) {
      var video = budgetVideos[j];
      if (video.blob) {
        formData.append('videos[]', video.blob, 'peca_video_' + (j + 1) + '.webm');
        formData.append('video_descriptions[]', 'Vídeo Peça ' + (j + 1) + ' - ' + video.timestamp);
      }
    }

    $.ajax({
      url: '/save_checklist_item_media',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
      success: function(response) {
        console.log('Mídia das peças salva:', response);
        if (typeof callback === 'function') callback(response);
      },
      error: function(xhr, status, error) {
        console.error('Erro ao salvar mídia das peças:', error);
        if (typeof callback === 'function') callback({ success: false });
      }
    });
  }

  function dataURLtoBlob(dataURL) {
    var parts = dataURL.split(',');
    var mime = parts[0].match(/:(.*?);/)[1];
    var binary = atob(parts[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  }

  // ===================== SALVAR E SAIR =====================

  function saveAndExit(stepNumber) {
    if (stepNumber !== 4 && !validateStep(stepNumber)) return;

    var $btn = $('.btn-save-exit[data-step="' + stepNumber + '"]');
    $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Salvando...');

    var currentStepValue = stepNumber;
    if (stepNumber === 4) {
      currentStepValue = budgetItems.length > 0 ? 4 : 3;
    }

    var options = { current_step: currentStepValue, id_status: 1 };

    function redirectToMenu() {
      $.ajax({
        url: '/checklistprogress',
        method: 'POST',
        dataType: 'html'
      }).done(function(data) {
        $('#ajax-content').html(data);
      }).fail(function() {
        window.location.href = '/checklistprogress';
      });
    }

    if (stepNumber === 1) {
      saveStep1Data(function(response) {
        $btn.prop('disabled', false).html('Salvar e Sair <i class="fa fa-sign-out"></i>');
        if (response && response.success) {
          toastr.success('Dados salvos com sucesso!');
          setTimeout(redirectToMenu, 800);
        } else {
          toastr.error(response.message || 'Erro ao salvar.');
        }
      }, options);
    } else if (stepNumber === 2) {
      saveStep2Data(function(response) {
        $btn.prop('disabled', false).html('Salvar e Sair <i class="fa fa-sign-out"></i>');
        if (response && response.success) {
          toastr.success('Dados do veículo salvos!');
          setTimeout(redirectToMenu, 800);
        } else {
          toastr.error(response.message || 'Erro ao salvar.');
        }
      }, options);
    } else if (stepNumber === 3) {
      saveStep3Media(function(response) {
        $btn.prop('disabled', false).html('Salvar e Sair <i class="fa fa-sign-out"></i>');
        if (response && response.success) {
          toastr.success('Mídias salvas com sucesso!');
          setTimeout(redirectToMenu, 800);
        } else {
          toastr.error(response.message || 'Erro ao salvar.');
        }
      }, options);
    } else if (stepNumber === 4) {
      saveStep4Budget(function() {
        saveStep4BudgetMedia(function(response) {
          $btn.prop('disabled', false).html('Salvar e Sair <i class="fa fa-sign-out"></i>');
          if (response && response.success) {
            toastr.success('Orçamento salvo com sucesso!');
            setTimeout(redirectToMenu, 800);
          } else {
            toastr.error(response.message || 'Erro ao salvar.');
          }
        }, options);
      }, options);
    }
  }

  $('.btn-save-exit').click(function() {
    var stepNumber = $(this).data('step');
    saveAndExit(stepNumber);
  });

  // ===================== FINALIZAR CHECKLIST =====================

  $('.btn-save-checklist').click(function() {
    var $btn = $(this);

    // Validar se o orçamento foi preenchido
    if (budgetItems.length === 0) {
      showBudgetValidation(['Nenhum item de orçamento adicionado. Adicione ao menos um item antes de finalizar.']);
      return;
    }

    // Validar se a mão de obra foi selecionada
    if (!$('#id_laborforce').val()) {
      var listHtml = '<li class="list-group-item"><i class="fa fa-times text-danger"></i> Tipo de Mão de Obra (aba Dados do Atendimento)</li>';
      $('#validationList').html(listHtml);
      $('#modalValidation').modal('show');
      return;
    }

    $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Salvando...');

    var finalizeOptions = { current_step: 4, id_status: 2 };

    // Salvar etapa 1 → 2 → 3 mídia → 4 itens → 4 mídia → finalizar
    saveStep1Data(function() {
      saveStep2Data(function() {
        saveStep3Media(function() {
          saveStep4Budget(function() {
            saveStep4BudgetMedia(function(response) {
              $btn.prop('disabled', false).html('<i class="fa fa-save"></i> Finalizar Checklist');
              if (response && response.success) {
                toastr.success('Checklist finalizado com sucesso! Aguardando aprovação.');
                setTimeout(function() {
                  $.ajax({
                    url: '/checklistfinished',
                    method: 'POST',
                    dataType: 'html'
                  }).done(function(data) {
                    $('#ajax-content').html(data);
                  }).fail(function() {
                    window.location.href = '/checklistfinished';
                  });
                }, 1500);
              } else {
                toastr.error(response.message || 'Erro ao finalizar checklist.');
              }
            }, finalizeOptions);
          }, finalizeOptions);
        }, finalizeOptions);
      }, finalizeOptions);
    }, finalizeOptions);
  });

  window.loadExistingChecklist = function(nrWorkorder) {
    $.ajax({
      url: '/get_checklist_data?nr_workorder=' + encodeURIComponent(nrWorkorder),
      method: 'GET',
      dataType: 'json'
    }).done(function(response) {
      if (!response.success || !response.data) {
        toastr.error(response.message || 'Erro ao carregar checklist.');
        return;
      }

      var d = response.data;

      // Etapa 1 - Atendimento
      $('#nr_workorder').val(d.nr_workorder || '').prop('readonly', true);
      $('#nr_workorder_step2').val(d.nr_workorder || '');
      if (d.dt_servicedate) {
        $('#dt_service').val(d.dt_servicedate);
      }
      if (d.hr_servicehours) {
        $('#hr_service').val(d.hr_servicehours);
      }
      if (d.nm_customer) {
        $('#formChecklistStep1 [name="nm_customer"]').val(d.nm_customer);
      }
      if (d.nr_phone) {
        $('#formChecklistStep1 [name="nr_phone"]').val(d.nr_phone);
      }
      if (d.ds_email) {
        $('#formChecklistStep1 [name="ds_email"]').val(d.ds_email);
      }
      if (d.ds_testimonialcustomer) {
        $('#formChecklistStep1 [name="ds_testimonialcustomer"]').val(d.ds_testimonialcustomer);
      }
      if (d.id_laborforce) {
        $('#id_laborforce').val(d.id_laborforce);
      }

      // Etapa 2 - Veículo
      if (d.nr_vehiclelicenseplate) {
        $('#formChecklistStep2 [name="nr_vehiclelicenseplate"]').val(d.nr_vehiclelicenseplate);
      }
      if (d.ds_vehicle) {
        $('#formChecklistStep2 [name="ds_vehicle"]').val(d.ds_vehicle);
      }
      if (d.ds_color) {
        $('#formChecklistStep2 [name="ds_color"]').val(d.ds_color);
      }
      if (d.nr_year) {
        $('#formChecklistStep2 [name="nr_year"]').val(d.nr_year);
      }
      if (d.nrKilometer) {
        $('#formChecklistStep2 [name="nrKilometer"]').val(d.nrKilometer);
      }
      if (d.nr_fuellevel) {
        $('#fuelSlider').val(d.nr_fuellevel);
        $('#fuelPercentage').text(d.nr_fuellevel + '%');
        $('#fuelGaugeFill').css('width', d.nr_fuellevel + '%');
      }

      // Navegar para a etapa atual
      var targetStep = parseInt(d.current_step) || 1;
      switchToStep(targetStep);

      toastr.success('Checklist ' + nrWorkorder + ' carregado com sucesso.');
    }).fail(function() {
      toastr.error('Erro ao buscar dados do checklist.');
    });
  };

  $(window).on('beforeunload', function() {
    stopAllCameras();
    stopAllBudgetCameras();
  });
});
