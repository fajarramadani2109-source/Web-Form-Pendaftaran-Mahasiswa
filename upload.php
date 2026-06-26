<?php
/**
 * upload.php
 * Menerima data POST dari form pendaftaran mahasiswa baru,
 * menyimpan foto ke folder images/, lalu mengembalikan
 * potongan HTML kartu ringkasan data.
 */

header('Content-Type: text/html; charset=UTF-8');

// ===== Helper: ambil & bersihkan input dengan aman =====
function getPost($key) {
    return isset($_POST[$key]) ? htmlspecialchars(trim($_POST[$key]), ENT_QUOTES, 'UTF-8') : '';
}

$nim    = getPost('nim');
$nama   = getPost('nama');
$email  = getPost('email');
$hp     = getPost('hp');
$gender = getPost('gender');
$prodi  = getPost('prodi');
$alamat = getPost('alamat');

// ===== Validasi dasar di sisi server =====
$errors = [];

if ($nim === '' || !ctype_digit($nim) || strlen($nim) < 8) {
    $errors[] = 'NIM tidak valid.';
}
if ($nama === '' || strlen($nama) < 5) {
    $errors[] = 'Nama tidak valid.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email tidak valid.';
}
if ($hp === '' || !ctype_digit($hp) || strlen($hp) < 10) {
    $errors[] = 'Nomor HP tidak valid.';
}
if ($gender === '') {
    $errors[] = 'Jenis kelamin wajib dipilih.';
}
if ($prodi === '') {
    $errors[] = 'Program studi wajib dipilih.';
}
if ($alamat === '' || strlen($alamat) < 10) {
    $errors[] = 'Alamat tidak valid.';
}

// ===== Validasi & upload foto =====
$fotoWebPath = '';

if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {

    $fotoTmpPath = $_FILES['foto']['tmp_name'];
    $fotoName    = $_FILES['foto']['name'];
    $fotoSize    = $_FILES['foto']['size'];

    $allowedExt = ['jpg', 'jpeg', 'png'];
    $ext = strtolower(pathinfo($fotoName, PATHINFO_EXTENSION));

    $maxSize = 2 * 1024 * 1024; // 2MB

    if (!in_array($ext, $allowedExt)) {
        $errors[] = 'Format foto harus JPG, JPEG, atau PNG.';
    } elseif ($fotoSize > $maxSize) {
        $errors[] = 'Ukuran foto maksimal 2MB.';
    } else {
        // Nama file unik agar tidak bertabrakan
        $newFileName = 'foto_' . $nim . '_' . time() . '.' . $ext;
        $targetDir   = __DIR__ . '/images/';
        $targetPath  = $targetDir . $newFileName;

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        if (move_uploaded_file($fotoTmpPath, $targetPath)) {
            $fotoWebPath = 'images/' . $newFileName;
        } else {
            $errors[] = 'Gagal mengunggah foto. Periksa izin folder images/.';
        }
    }
} else {
    $errors[] = 'Pas foto wajib diunggah.';
}

// ===== Jika ada error, kembalikan pesan error =====
if (!empty($errors)) {
    http_response_code(400);
    echo '<div style="color:#e74c3c;">';
    echo '<p><strong>Pendaftaran gagal:</strong></p><ul>';
    foreach ($errors as $err) {
        echo '<li>' . $err . '</li>';
    }
    echo '</ul></div>';
    exit;
}

// ===== Sukses: tampilkan kartu ringkasan =====
?>
<div class="card-row"><strong>NIM</strong><span><?php echo $nim; ?></span></div>
<div class="card-row"><strong>Nama Lengkap</strong><span><?php echo $nama; ?></span></div>
<div class="card-row"><strong>Email</strong><span><?php echo $email; ?></span></div>
<div class="card-row"><strong>Nomor HP</strong><span><?php echo $hp; ?></span></div>
<div class="card-row"><strong>Jenis Kelamin</strong><span><?php echo $gender; ?></span></div>
<div class="card-row"><strong>Program Studi</strong><span><?php echo $prodi; ?></span></div>
<div class="card-row"><strong>Alamat</strong><span><?php echo $alamat; ?></span></div>
<div class="card-photo">
    <strong>Pas Foto:</strong><br>
    <img src="<?php echo $fotoWebPath; ?>" alt="Pas Foto">
</div>
<?php
