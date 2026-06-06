<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Perjanjian Kerja</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 14px; color: #666; }
        .content { margin-top: 20px; }
        .section-title { font-weight: bold; margin-top: 20px; text-decoration: underline; font-size: 14px; }
        .section-content { margin-top: 5px; margin-bottom: 15px; }
        .section-content ol { padding-left: 20px; margin-top: 5px; }
        .section-content li { margin-bottom: 5px; text-align: justify; }
        table.meta { width: 100%; margin-bottom: 20px; }
        table.meta td { padding: 4px 0; vertical-align: top; }
        table.meta td:first-child { width: 150px; font-weight: bold; }
        .signature-section { margin-top: 60px; width: 100%; }
        .signature-box { width: 45%; display: inline-block; text-align: center; }
        .signature-image { max-width: 200px; max-height: 100px; margin: 10px 0; }
        .signature-line { border-top: 1px solid #333; margin-top: 5px; width: 80%; margin-left: auto; margin-right: auto; padding-top: 5px; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">NON-DISCLOSURE AGREEMENT (NDA)</div>
    <div class="subtitle">Nomor: NDA/{{ date('Y/m') }}/{{ str_pad($employee->id, 3, '0', STR_PAD_LEFT) }}</div>
</div>

<div class="content">
    <p>Pada hari ini, tanggal <strong>{{ now()->format('d F Y') }}</strong>, telah dibuat dan disepakati Perjanjian Kerja oleh dan antara:</p>

    <table class="meta">
        <tr>
            <td>Nama Perusahaan</td>
            <td>: PT HIFIX TEKNOLOGI INDONESIA</td>
        </tr>
        <tr>
            <td>Alamat</td>
            <td>: Jl. Teknologi HRIS No. 1, Jakarta</td>
        </tr>
    </table>
    <p>Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.</p>

    <table class="meta">
        <tr>
            <td>Nama Lengkap</td>
            <td>: {{ $employee->first_name }} {{ $employee->last_name }}</td>
        </tr>
        <tr>
            <td>Nomor KTP</td>
            <td>: {{ $employee->identity_number ?? '-' }}</td>
        </tr>
        <tr>
            <td>Alamat Email</td>
            <td>: {{ $employee->user->email ?? '-' }}</td>
        </tr>
    </table>
    <p>Selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.</p>

    <p>Kedua belah pihak sepakat untuk mengikatkan diri dalam Perjanjian Kerahasiaan (Non-Disclosure Agreement) dengan ketentuan sebagai berikut:</p>

    <div class="section-title">PASAL 1: DEFINISI INFORMASI RAHASIA (TRADE SECRETS)</div>
    <div class="section-content">
        <ol>
            <li>Informasi Rahasia mencakup segala bentuk data, aset, dan informasi material maupun immaterial milik PT HIFIX TEKNOLOGI INDONESIA, termasuk namun tidak terbatas pada: kode sumber (source code), arsitektur sistem, algoritma, basis data (database), rincian kompensasi gaji seluruh karyawan, daftar dan kontak klien/pelanggan, vendor, strategi bisnis, rencana pemasaran, laporan keuangan, hak kekayaan intelektual yang belum dipatenkan, dokumen legal, dan SOP (Standard Operating Procedure).</li>
            <li>Segala bentuk catatan, skema, ide, penemuan, dan inovasi yang dikembangkan atau diketahui oleh PIHAK KEDUA selama masa ikatan kerjanya secara otomatis dan mutlak dikategorikan sebagai Informasi Rahasia milik Perusahaan.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 2: KEWAJIBAN MENJAGA KERAHASIAAN (NON-DISCLOSURE)</div>
    <div class="section-content">
        <ol>
            <li>PIHAK KEDUA wajib senantiasa menjaga kerahasiaan penuh atas seluruh Informasi Rahasia, dan dilarang keras membagikan, mempublikasikan, mentransfer, memperbanyak (copy/clone), atau membocorkannya kepada pihak ketiga (termasuk keluarga, teman, atau perusahaan lain) baik secara sengaja maupun karena kelalaian (negligence), tanpa persetujuan tertulis dan resmi dari Direksi PIHAK PERTAMA.</li>
            <li>PIHAK KEDUA dilarang secara mutlak menggunakan Informasi Rahasia untuk kepentingan dan keuntungan pribadi, maupun untuk bersaing secara langsung/tidak langsung dengan entitas bisnis PIHAK PERTAMA.</li>
            <li>PIHAK KEDUA wajib mematuhi seluruh protokol keamanan digital dan fisik, termasuk tidak mengakses jaringan perusahan melalui perangkat atau Wi-Fi yang tidak aman, serta tidak membagikan kata sandi/kredensial akses kepada siapa pun.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 3: LARANGAN MEMBAJAK (NON-SOLICITATION & NON-POACHING)</div>
    <div class="section-content">
        <ol>
            <li>Selama masa kerja dan 2 (dua) tahun kalender setelah hubungan kerja berakhir, PIHAK KEDUA dilarang keras merayu, mempengaruhi, atau mempekerjakan karyawan, kontraktor, maupun vendor yang saat ini terikat dengan PIHAK PERTAMA untuk pindah ke entitas lain.</li>
            <li>PIHAK KEDUA dilarang keras menghubungi klien, pelanggan, atau mitra bisnis PIHAK PERTAMA untuk mengalihkan bisnis atau memberikan penawaran yang berkompetisi dengan layanan PIHAK PERTAMA.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 4: PENGEMBALIAN DAN PEMUSNAHAN DATA PADA SAAT TERMINASI</div>
    <div class="section-content">
        <ol>
            <li>Paling lambat 1 x 24 jam setelah hari kerja terakhir PIHAK KEDUA, PIHAK KEDUA wajib menyerahkan seluruh aset fisik (laptop, server, dokumen, kartu akses) kembali kepada PIHAK PERTAMA dalam keadaan utuh.</li>
            <li>PIHAK KEDUA diwajibkan untuk menghapus, memformat (wipe), dan memusnahkan seluruh data/Informasi Rahasia milik PIHAK PERTAMA yang tersimpan dalam media penyimpanan pribadi PIHAK KEDUA (flashdisk, cloud drive pribadi, email pribadi) tanpa menyisakan jejak (back-up) sekecil apa pun.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 5: JANGKA WAKTU (SURVIVAL CLAUSE)</div>
    <div class="section-content">
        <ol>
            <li>Kewajiban menjaga kerahasiaan dan ketentuan dalam NDA ini akan terus berlaku tanpa batas waktu <strong>(Perpetual / Selamanya)</strong> secara mengikat secara hukum, tanpa memedulikan alasan atau bagaimana hubungan kerja antara PIHAK PERTAMA dan PIHAK KEDUA berakhir (baik karena *resign*, PHK, atau habis masa kontrak).</li>
        </ol>
    </div>

    <div class="section-title">PASAL 6: SANKSI, GANTI RUGI, DAN PENUNTUTAN HUKUM</div>
    <div class="section-content">
        <ol>
            <li>Setiap pelanggaran sekecil apa pun atas pasal-pasal dalam NDA ini memberikan hak absolut bagi PIHAK PERTAMA untuk segera melakukan Pemutusan Hubungan Kerja (PHK) tanpa pesangon.</li>
            <li>Sebagai kompensasi kerugian akibat kebocoran (Liquidated Damages), PIHAK KEDUA setuju untuk membayarkan denda tunai sekurang-kurangnya sebesar <strong>Rp 500.000.000 (Lima Ratus Juta Rupiah)</strong> kepada PIHAK PERTAMA, belum termasuk ganti rugi materiil/imateriil tambahan yang timbul di kemudian hari.</li>
            <li>PIHAK PERTAMA berhak penuh menyeret PIHAK KEDUA ke ranah hukum, baik melalui Gugatan Perdata maupun Laporan Pidana berdasarkan Undang-Undang Informasi dan Transaksi Elektronik (UU ITE), Kitab Undang-Undang Hukum Pidana (KUHP), dan Undang-Undang Rahasia Dagang Republik Indonesia.</li>
        </ol>
    </div>

    <p style="margin-top: 40px; text-align: justify;">Demikian Non-Disclosure Agreement (NDA) ini dibuat dalam keadaan sadar, sehat jasmani dan rohani, tanpa ada paksaan maupun tekanan dari pihak mana pun. Dengan dibubuhkannya tanda tangan elektronik (digital) di bawah ini, PIHAK KEDUA menyatakan telah membaca, mengerti, dan menyetujui seluruh ketentuan secara mutlak dan mengikat secara hukum.</p>

    <div class="signature-section">
        <div class="signature-box" style="float: left;">
            <p>PIHAK PERTAMA,</p>
            @php
                $companySig = \App\Models\Setting::where('key', 'company_signature')->value('value');
                $companySigBase64 = null;
                if ($companySig && file_exists(storage_path('app/public/' . $companySig))) {
                    $companySigBase64 = base64_encode(file_get_contents(storage_path('app/public/' . $companySig)));
                }
            @endphp
            @if($companySigBase64)
                <img src="data:image/png;base64,{{ $companySigBase64 }}" class="signature-image" alt="Company Signature">
            @else
                <br><br><br><br>
            @endif
            <div class="signature-line">
                <strong>HR Manager</strong><br>
                PT HIFIX TEKNOLOGI INDONESIA
            </div>
        </div>

        <div class="signature-box" style="float: right;">
            <p>PIHAK KEDUA,</p>
            @php
                $empSigBase64 = null;
                if ($employee->nda_signature_path && file_exists(storage_path('app/public/' . $employee->nda_signature_path))) {
                    $empSigBase64 = base64_encode(file_get_contents(storage_path('app/public/' . $employee->nda_signature_path)));
                }
            @endphp
            @if($empSigBase64)
                <img src="data:image/png;base64,{{ $empSigBase64 }}" class="signature-image" alt="Signature">
            @else
                <br><br><br><br>
            @endif
            <div class="signature-line">
                <strong>{{ $employee->first_name }} {{ $employee->last_name }}</strong><br>
                Karyawan
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>
</div>

</body>
</html>
