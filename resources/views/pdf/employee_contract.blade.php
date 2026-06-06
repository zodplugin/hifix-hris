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
    <div class="title">PERJANJIAN KERJA WAKTU TERTENTU (PKWT)</div>
    <div class="subtitle">Nomor: PKWT/{{ date('Y/m') }}/{{ str_pad($employee->id, 3, '0', STR_PAD_LEFT) }}</div>
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

    <p>Kedua belah pihak sepakat untuk mengikatkan diri dalam Perjanjian Kerja dengan ketentuan sebagai berikut:</p>

    <div class="section-title">PASAL 1: POSISI, TUGAS, DAN TANGGUNG JAWAB</div>
    <div class="section-content">
        <ol>
            <li>PIHAK KEDUA akan dipekerjakan oleh PIHAK PERTAMA sebagai <strong>{{ $employee->job_title }}</strong> di Departemen <strong>{{ $employee->department ? $employee->department->name : 'Umum' }}</strong>.</li>
            <li>PIHAK KEDUA wajib melaksanakan seluruh tugas pokok, fungsi, dan instruksi kerja yang diberikan oleh atasan langsung maupun manajemen perusahaan dengan standar profesionalisme tertinggi, penuh dedikasi, dan target <i>Key Performance Indicator</i> (KPI) yang ditetapkan.</li>
            <li>PIHAK PERTAMA memiliki hak mutlak (Prerogatif) untuk memindahkan, memutasi, atau mengubah ruang lingkup tugas PIHAK KEDUA ke divisi/lokasi lain sesuai dengan kebutuhan operasional perusahaan, tanpa hak penolakan dari PIHAK KEDUA.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 2: MASA KERJA DAN EVALUASI</div>
    <div class="section-content">
        <ol>
            <li>Perjanjian ini berlaku terhitung mulai tanggal <strong>{{ $employee->contract_start_date ? $employee->contract_start_date->format('d F Y') : $employee->join_date->format('d F Y') }}</strong> hingga tanggal <strong>{{ $employee->contract_end_date ? $employee->contract_end_date->format('d F Y') : 'Tanpa Batas Waktu' }}</strong>.</li>
            <li>Selama masa kerja, PIHAK PERTAMA berhak melakukan tinjauan dan evaluasi kinerja secara berkala. Apabila PIHAK KEDUA tidak memenuhi ekspektasi performa atau melakukan kelalaian yang merugikan, PIHAK PERTAMA berhak memutus perjanjian ini secara sepihak sebelum masa kontrak berakhir tanpa kompensasi sisa kontrak.</li>
            @if($employee->is_contract_extendable)
            <li>Kontrak ini dapat diperpanjang berdasarkan evaluasi kinerja mutlak dari PIHAK PERTAMA, selambat-lambatnya 14 hari sebelum masa kontrak berakhir.</li>
            @endif
        </ol>
    </div>

    <div class="section-title">PASAL 3: REMUNERASI, POTONGAN, DAN KERAHASIAAN GAJI</div>
    <div class="section-content">
        <ol>
            <li>PIHAK PERTAMA akan memberikan Gaji Pokok sebesar <strong>Rp {{ number_format($employee->basic_salary, 0, ',', '.') }}</strong> ({{ strtoupper($employee->salary_type) }}). Nilai tersebut adalah nilai kotor (Gross) sebelum pemotongan pajak PPh 21, BPJS Kesehatan, dan BPJS Ketenagakerjaan.</li>
            <li>PIHAK KEDUA menyatakan setuju bahwa seluruh komponen gaji bersifat <strong>SANGAT RAHASIA (Strictly Confidential)</strong>. Segala bentuk diskusi, penyebaran, atau pembocoran informasi gaji kepada sesama karyawan atau pihak eksternal merupakan pelanggaran berat yang akan berujung pada Pemutusan Hubungan Kerja (PHK) secara tidak hormat.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 4: KEDISIPLINAN DAN WAKTU KERJA</div>
    <div class="section-content">
        <ol>
            <li>PIHAK KEDUA wajib mematuhi ketentuan waktu kerja penuh yakni 40 (empat puluh) jam seminggu sesuai jadwal operasional yang ditentukan.</li>
            <li>Keterlambatan masuk kerja tanpa persetujuan tertulis dari atasan akan dikenakan pemotongan gaji proporsional, serta penerbitan Surat Peringatan (SP) sesuai tingkat akumulasi pelanggaran.</li>
            <li>Ketidakhadiran kerja berturut-turut selama 5 (lima) hari kerja tanpa surat keterangan medis yang sah dan valid (Mangkir) secara hukum dianggap bahwa PIHAK KEDUA telah mengundurkan diri secara sepihak dan melepaskan seluruh hak atas kompensasi pesangon.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 5: KEPATUHAN DAN ETIKA PERUSAHAAN (ZERO TOLERANCE)</div>
    <div class="section-content">
        <ol>
            <li>PIHAK KEDUA diwajibkan tunduk pada seluruh Standard Operating Procedure (SOP), Buku Panduan Karyawan, dan kebijakan internal Perusahaan.</li>
            <li>PIHAK PERTAMA menerapkan kebijakan <strong>Toleransi Nol (Zero Tolerance)</strong> atas tindakan: (a) Insubordinasi/pembangkangan perintah atasan, (b) Pencurian/penggelapan dana atau aset perusahaan, (c) Pelecehan seksual verbal/non-verbal, (d) Konsumsi/penyebaran narkotika, dan (e) Tindak pidana hukum lainnya. Pelanggaran atas poin ini mengakibatkan pemecatan langsung seketika (Instant Dismissal) dan pelaporan ke pihak Kepolisian RI.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 6: HAK KEKAYAAN INTELEKTUAL (HAKI)</div>
    <div class="section-content">
        <ol>
            <li>Seluruh karya, kode sumber, skrip, desain, dokumen pemasaran, formula, dan segala bentuk properti intelektual yang diciptakan, dikonseptualisasikan, maupun disempurnakan oleh PIHAK KEDUA selama jam kerja atau menggunakan perangkat milik PIHAK PERTAMA merupakan <strong>Hak Milik Eksklusif</strong> PIHAK PERTAMA seutuhnya.</li>
            <li>PIHAK KEDUA dengan ini melepaskan secara permanen segala bentuk hak moral dan material (klaim royalti) atas karya-karya tersebut di masa sekarang maupun di masa depan.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 7: LARANGAN PESAING (NON-COMPETE CLAUSE)</div>
    <div class="section-content">
        <ol>
            <li>Selama masa Perjanjian Kerja berlangsung, PIHAK KEDUA dilarang keras untuk bekerja, memberikan konsultasi, memiliki saham, atau terlibat dalam usaha kompetitor yang memiliki lini bisnis serupa dengan PIHAK PERTAMA.</li>
            <li>Setelah Perjanjian ini berakhir, PIHAK KEDUA dilarang untuk secara aktif merebut klien (Non-Solicitation) atau membajak karyawan (Poaching) milik PIHAK PERTAMA untuk kepentingan entitas bisnis apa pun.</li>
        </ol>
    </div>

    <div class="section-title">PASAL 8: PENGUNDURAN DIRI (RESIGNATION) DAN DENDA *HIT AND RUN*</div>
    <div class="section-content">
        <ol>
            <li>Apabila PIHAK KEDUA berkehendak mengundurkan diri secara sukarela, maka wajib memberikan pemberitahuan tertulis minimum 30 (tiga puluh) hari kerja sebelumnya <strong>(One Month Notice)</strong>. PIHAK KEDUA wajib melakukan serah terima pekerjaan (Handover) kepada pengganti secara tuntas dan komprehensif.</li>
            <li>Apabila PIHAK KEDUA mengundurkan diri secara sepihak kurang dari 30 (tiga puluh) hari (*Hit and Run*), atau mangkir dan memutus komunikasi, maka PIHAK PERTAMA berhak:
                <br>a. Tidak membayarkan sisa gaji prorata atau hak lainnya yang belum dibayarkan.
                <br>b. Menolak menerbitkan Surat Keterangan Kerja (Paklaring).
                <br>c. Menjatuhkan denda penalti finansial sebesar 1 (satu) bulan gaji pokok kepada PIHAK KEDUA sebagai ganti rugi operasional perusahaan.
            </li>
        </ol>
    </div>

    <p style="margin-top: 40px; text-align: justify;">Demikian Surat Perjanjian ini dibuat dalam keadaan sadar, sehat jasmani dan rohani, tanpa ada paksaan maupun tekanan dari pihak mana pun. Dengan dibubuhkannya tanda tangan elektronik (digital) di bawah ini, PIHAK KEDUA menyatakan telah membaca, mengerti, dan menyetujui seluruh ketentuan secara mutlak dan mengikat secara hukum.</p>

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
                if ($employee->signature_path && file_exists(storage_path('app/public/' . $employee->signature_path))) {
                    $empSigBase64 = base64_encode(file_get_contents(storage_path('app/public/' . $employee->signature_path)));
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
