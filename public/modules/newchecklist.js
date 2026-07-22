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

  // ===================== CARREGAR SERVIÇOS =====================

  function loadServices() {
    $.getJSON('/get_all_services', function(services) {
      var $select = $('#id_service');
      $select.find('option:gt(0)').remove();
      $.each(services, function(i, s) {
        if (parseInt(s.is_active) === 1) {
          $select.append(
            '<option value="' + s.id + '" data-estimated="' + (s.estimated_type || '') + '">' +
            s.ds_service +
            '</option>'
          );
        }
      });
    }).fail(function() {
      console.error('Erro ao carregar servi\u00e7os.');
    });
  }

  loadServices();

  $('#id_service').on('change', function() {
    var $selected = $(this).find('option:selected');
    var estimated = $selected.data('estimated') || '';
    $('#estimated_type_display').val(estimated);
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

  $('.btn-next').click(function() {
    var currentStep = $(this).data('step');
    var nextStep = currentStep + 1;

    var missingFields = [];
    $('#step' + currentStep + ' input[required], #step' + currentStep + ' textarea[required]').each(function() {
      if (!$(this).val().trim()) {
        var label = $(this).closest('.form-group').find('label').text();
        missingFields.push(label);
        $(this).parent().addClass('has-error');
      } else {
        $(this).parent().removeClass('has-error');
      }
    });

    if (missingFields.length > 0) {
      var listHtml = '';
      $.each(missingFields, function(i, field) {
        listHtml += '<li class="list-group-item"><i class="fa fa-times text-danger"></i> ' + field + '</li>';
      });
      $('#validationList').html(listHtml);
      $('#modalValidation').modal('show');
      return;
    }

    $('#step' + currentStep).hide();
    $('#step' + nextStep).show();

    $('.wizard-steps li').removeClass('active');
    $('.wizard-steps li[data-step="' + nextStep + '"]').addClass('active');

    if (nextStep === 3) {
      initCameras();
      updateMediaCounters();
    }
  });

  $('.btn-prev').click(function() {
    var currentStep = $(this).data('step');
    var prevStep = currentStep - 1;

    $('#step' + currentStep).hide();
    $('#step' + prevStep).show();

    $('.wizard-steps li').removeClass('active');
    $('.wizard-steps li[data-step="' + prevStep + '"]').addClass('active');

    if (currentStep === 3) {
      stopAllCameras();
      stopTimer();
    }
  });

  $('.btn-save-checklist').click(function() {
    var formData = {};

    $('#formChecklistStep1, #formChecklistStep2').each(function() {
      var stepData = $(this).serializeArray();
      $.each(stepData, function(i, field) {
        formData[field.name] = field.value;
      });
    });

    formData.total_photos = photos.length;
    formData.total_videos = videos.length;
    formData.photos = photos.map(function(p) {
      return {
        timestamp: p.timestamp,
        data: p.data
      };
    });
    formData.videos = videos.map(function(v) {
      return {
        timestamp: v.timestamp,
        duration: v.duration
      };
    });

    console.log('Dados do checklist:', formData);
    alert('Checklist salvo com sucesso!\n\nFotos: ' + photos.length + '\nV\u00eddeos: ' + videos.length + '\n\n(Dados no console)');

    // $.ajax({
    //   url: '/save_checklist',
    //   method: 'POST',
    //   data: formData,
    //   success: function(response) {
    //     alert('Checklist salvo com sucesso!');
    //   }
    // });
  });

  $(window).on('beforeunload', function() {
    stopAllCameras();
  });
});
