-- Pra task : 
-- menambahkan kolom usia pada tabel mahasiswa dan mengisinya
-- menambahkan matakuliah data mining
-- menambahkan records pada tabel kontrak
ALTER TABLE mahasiswa ADD COLUMN usia INT;
UPDATE mahasiswa SET usia = 24 WHERE nim = 10119004;
UPDATE mahasiswa SET usia = 19 WHERE nim = 10319005;
UPDATE mahasiswa SET usia = 19 WHERE nim = 10119007;
UPDATE mahasiswa SET usia = 23 WHERE nim = 10119010;
UPDATE mahasiswa SET usia = 20 WHERE nim = 10219008;
UPDATE mahasiswa SET usia = 22 WHERE nim = 10219012;
UPDATE mahasiswa SET usia = 18 WHERE nim = 10319002;
UPDATE mahasiswa SET usia = 22 WHERE nim = 10519009;
UPDATE mahasiswa SET usia = 20 WHERE nim = 10519014;
UPDATE mahasiswa SET usia = 18 WHERE nim = 10819013;
UPDATE mahasiswa SET usia = 20 WHERE nim = 10819011;

INSERT INTO matakuliah VALUES (13,"Data Mining",4);

INSERT INTO kontrak VALUES(13,10119007,4,6,"D");
INSERT INTO kontrak VALUES(14,10119010,12,2,"A");
INSERT INTO kontrak VALUES(15,10819011,13,3,"C");
INSERT INTO kontrak VALUES(16,10319002,13,3,"B");
INSERT INTO kontrak VALUES(17,10219008,11,4,"B");

-- Task 1: Menampilkan seluruh data mahasiswa beserta nama jurusannya
SELECT mahasiswa.*, jurusan.nama_jurusan FROM mahasiswa INNER JOIN
jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan;

-- Task 2: menampilkan mahasiswa yang berusia di bawah 20 tahun
SELECT nim,nama,usia FROM mahasiswa WHERE usia < 20;

-- Task 3: menampilkan mahasiswa yang memiliki nilai B ke atas (B atau A)
SELECT DISTINCT nim, nama FROM mahasiswa
WHERE nim IN (
    SELECT m.nim FROM mahasiswa m INNER JOIN kontrak k
    ON m.nim = k.nim WHERE k.nilai IN ('A', 'B')
);

-- Task 4: menampilkan mahasiswa yang memiliki jumlah sks lebih dari 10
SELECT m.nim, m.nama, SUM(mk.sks) total_sks FROM mahasiswa m, matakuliah mk
INNER JOIN kontrak k ON m.nim = k.nim AND mk.id_matakuliah=k.id_matakuliah
GROUP BY m.nim HAVING total_sks>10 ORDER BY m.nim;

-- Task 5: menampilkan mahasiswa yang mengontrak matakuliah Data Mining
SELECT m.nim, m.nama FROM mahasiswa m, matakuliah mk 
INNER JOIN kontrak k ON m.nim = k.nim AND mk.id_matakuliah = k.id_matakuliah
WHERE mk.nama = "Data Mining";

-- Task 6: menampilkan jumlah mahasiswa untuk setiap dosen
SELECT d.id_dosen, d.nama, COUNT(DISTINCT m.nama) jumlah_mahasiswa 
FROM dosen d, mahasiswa m
INNER JOIN kontrak k ON d.id_dosen = k.id_dosen AND m.nim = k.nim
GROUP BY d.id_dosen ORDER BY d.id_dosen;

-- Task 7: mengurutkan mahasiswa berdasarkan umurnya
SELECT nim, nama, usia FROM mahasiswa ORDER BY usia;

-- Task 8: menampilkan kontrak matakuliah yang harus diulang (D dan E)
-- serta menampilkan data mahasiswa, jurusan dan dosen secara lengkap
SELECT m.nim, m.nama nama_mahasiswa, m.alamat, j.nama_jurusan, d.nama nama_dosen, mk.nama matkul, k.nilai
FROM mahasiswa m, dosen d, matakuliah mk
INNER JOIN kontrak k ON m.nim = k.nim AND d.id_dosen = k.id_dosen AND mk.id_matakuliah = k.id_matakuliah
INNER JOIN jurusan j ON m.id_jurusan = j.id_jurusan
WHERE k.nilai IN ("D","E");