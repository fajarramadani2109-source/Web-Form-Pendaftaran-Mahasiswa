$(document).ready(function () {

  var lastFormData = null; // simpan data terakhir untuk fitur Edit

  // ===== PREVIEW FOTO INSTAN (FileReader) =====
  $('#foto').on('change', function (e) {
    var file = e.target.files[0];
    var $err = $('#errFoto');
    var $preview = $('#previewFoto');

    $err.text('');
    $('#foto').removeClass('invalid');

    if (!file) {
      $preview.hide().attr('src', '#');
      return;
    }

    var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    var maxSize = 2 * 1024 * 1024; // 2MB

    if (allowedTypes.indexOf(file.type) === -1) {
      $err.text('Format foto harus JPG, JPEG, atau PNG.');
      $('#foto').addClass('invalid');
      $preview.hide().attr('src', '#');
      $('#foto').val('');
      return;
    }

    if (file.size > maxSize) {
      $err.text('Ukuran foto maksimal 2MB.');
      $('#foto').addClass('invalid');
      $preview.hide().attr('src', '#');
      $('#foto').val('');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
      $preview.attr('src', ev.target.result).show();
    };
    reader.readAsDataURL(file);
  });

  // ===== VALIDASI FORM =====
  function validateForm() {
    var valid = true;

    // reset semua error & style invalid
    $('.error').text('');
    $('input, select, textarea').removeClass('invalid');

    // NIM
    var nim = $('#nim').val().trim();
    if (nim === '') {
      $('#errNim').text('NIM tidak boleh kosong.');
      $('#nim').addClass('invalid'); valid = false;
    } else if (!/^\d+$/.test(nim)) {
      $('#errNim').text('NIM harus berupa angka.');
      $('#nim').addClass('invalid'); valid = false;
    } else if (nim.length < 8) {
      $('#errNim').text('NIM minimal 8 digit.');
      $('#nim').addClass('invalid'); valid = false;
    }

    // Nama
    var nama = $('#nama').val().trim();
    if (nama === '') {
      $('#errNama').text('Nama tidak boleh kosong.');
      $('#nama').addClass('invalid'); valid = false;
    } else if (nama.length < 5) {
      $('#errNama').text('Nama minimal 5 karakter.');
      $('#nama').addClass('invalid'); valid = false;
    }

    // Email
    var email = $('#email').val().trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      $('#errEmail').text('Email tidak boleh kosong.');
      $('#email').addClass('invalid'); valid = false;
    } else if (!emailRegex.test(email)) {
      $('#errEmail').text('Format email tidak valid.');
      $('#email').addClass('invalid'); valid = false;
    }

    // HP
    var hp = $('#hp').val().trim();
    if (hp === '') {
      $('#errHp').text('Nomor HP tidak boleh kosong.');
      $('#hp').addClass('invalid'); valid = false;
    } else if (!/^\d+$/.test(hp)) {
      $('#errHp').text('Nomor HP harus berupa angka.');
      $('#hp').addClass('invalid'); valid = false;
    } else if (hp.length < 10) {
      $('#errHp').text('Nomor HP minimal 10 digit.');
      $('#hp').addClass('invalid'); valid = false;
    }

    // Jenis Kelamin
    if ($('input[name="gender"]:checked').length === 0) {
      $('#errGender').text('Jenis kelamin wajib dipilih.');
      valid = false;
    }

    // Program Studi
    var prodi = $('#prodi').val();
    if (prodi === '' || prodi === null) {
      $('#errProdi').text('Program studi wajib dipilih.');
      $('#prodi').addClass('invalid'); valid = false;
    }

    // Alamat
    var alamat = $('#alamat').val().trim();
    if (alamat === '') {
      $('#errAlamat').text('Alamat tidak boleh kosong.');
      $('#alamat').addClass('invalid'); valid = false;
    } else if (alamat.length < 10) {
      $('#errAlamat').text('Alamat minimal 10 karakter.');
      $('#alamat').addClass('invalid'); valid = false;
    }

    // Foto
    var fotoFile = $('#foto')[0].files[0];
    if (!fotoFile) {
      $('#errFoto').text('Pas foto wajib diunggah.');
      $('#foto').addClass('invalid'); valid = false;
    } else {
      var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.indexOf(fotoFile.type) === -1) {
        $('#errFoto').text('Format foto harus JPG, JPEG, atau PNG.');
        $('#foto').addClass('invalid'); valid = false;
      } else if (fotoFile.size > 2 * 1024 * 1024) {
        $('#errFoto').text('Ukuran foto maksimal 2MB.');
        $('#foto').addClass('invalid'); valid = false;
      }
    }

    return valid;
  }

  // ===== SUBMIT FORM (AJAX) =====
  $('#formDaftar').on('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    var formData = new FormData(this);
    lastFormData = formData; // simpan untuk fitur edit (kecuali file, ditangani terpisah)

    $('#btnSubmit').prop('disabled', true).text('Mengirim...');

    $.ajax({
      url: 'upload.php',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        $('#formDaftar').fadeOut(400, function () {
          $('#cardContent').html(response);
          $('#cardRingkasan').fadeIn(400);
        });
      },
      error: function () {
        alert('Terjadi kesalahan saat mengirim data. Pastikan upload.php berjalan di server PHP.');
      },
      complete: function () {
        $('#btnSubmit').prop('disabled', false).text('Submit');
      }
    });
  });

  // ===== RESET FORM =====
  $('#formDaftar').on('reset', function () {
    $('.error').text('');
    $('input, select, textarea').removeClass('invalid');
    $('#previewFoto').hide().attr('src', '#');
  });

  // ===== TOMBOL EDIT DATA =====
  $('#btnEdit').on('click', function () {
    $('#cardRingkasan').fadeOut(400, function () {
      $('#formDaftar').fadeIn(400);
    });
  });

});
