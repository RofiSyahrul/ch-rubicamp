sqlite3 university.db
PRAGMA foreign_keys = ON;
CREATE TABLE jurusan(
    id_jurusan  INT PRIMARY KEY         NOT NULL,
    nama_jurusan            VARCHAR(15)    NOT NULL
);
CREATE TABLE mahasiswa(
    nim         INT PRIMARY KEY         NOT NULL,
    nama                    VARCHAR(30)    NOT NULL,
    alamat                  TEXT,
    id_jurusan              INT         NOT NULL,
    FOREIGN KEY(id_jurusan) REFERENCES  jurusan(id_jurusan)
);
CREATE TABLE dosen(
    id_dosen  INT PRIMARY   KEY         NOT NULL,
    nama                    VARCHAR(30)    NOT NULL
);
CREATE TABLE matakuliah(
    id_matakuliah  INT PRIMARY   KEY         NOT NULL,
    nama                         VARCHAR(30)    NOT NULL,
    sks                          INT         NOT NULL
);
CREATE TABLE kontrak(
    id_kontrak     INT  PRIMARY KEY         NOT NULL,
    nim                         INT         NOT NULL,
    id_matakuliah               INT         NOT NULL,
    id_dosen                    INT         NOT NULL,
    nilai                       CHAR(2),
    FOREIGN KEY(nim)            REFERENCES  mahasiswa(nim),
    FOREIGN KEY(id_matakuliah)  REFERENCES  matakuliah(id_matakuliah),
    FOREIGN KEY(id_dosen)       REFERENCES  dosen(id_dosen)
);

INSERT INTO jurusan VALUES (101, "Matematika");
INSERT INTO jurusan VALUES (102, "Fisika");
INSERT INTO jurusan VALUES (103, "Astronomi");
INSERT INTO jurusan VALUES (105, "Kimia");
INSERT INTO jurusan VALUES (108, "Aktuaria");

INSERT INTO mahasiswa VALUES (10119004, "Sergio Ramos", "Rancamadrid", 101);
INSERT INTO mahasiswa VALUES (10119007, "Eden Hazard", "Madrid Wetan", 101);
INSERT INTO mahasiswa VALUES (10119010, "Luca Modric", "Madrid Hilir", 101);
INSERT INTO mahasiswa VALUES (10219008, "Toni Kroos", "Bojongmadrid", 102);
INSERT INTO mahasiswa VALUES (10219012, "Marcelo Vierra", "Cimadrid", 102);
INSERT INTO mahasiswa VALUES (10319002, "Dani Carvajal", "Rancamadrid", 103);
INSERT INTO mahasiswa VALUES (10319005, "Raphael Varane", "Madrid Kulon", 103);
INSERT INTO mahasiswa VALUES (10519009, "Karim Benzema", "Madrid Kulon", 105);
INSERT INTO mahasiswa VALUES (10519014, "Casemiro", "Cimadrid", 105);
INSERT INTO mahasiswa VALUES (10819013, "Thibaut Curtois", "Madrid Wetan", 108);
INSERT INTO mahasiswa VALUES (10819011, "Gareth Bale", "Madrid Kaler", 108);

INSERT INTO dosen VALUES (1, "Jose Mourinho");
INSERT INTO dosen VALUES (2, "Carlo Ancelotti");
INSERT INTO dosen VALUES (3, "Rafael Benitez");
INSERT INTO dosen VALUES (4, "Zinedine Zidane");
INSERT INTO dosen VALUES (5, "Julen Lopetegui");
INSERT INTO dosen VALUES (6, "Santiago Solari");

INSERT INTO matakuliah VALUES (1, "Aljabar Linier Elementer", 4);
INSERT INTO matakuliah VALUES (2, "Pengantar Analisis Real", 4);
INSERT INTO matakuliah VALUES (3, "Hukum Perburuhan", 2);
INSERT INTO matakuliah VALUES (4, "Astronomi dan Lingkungan", 2);
INSERT INTO matakuliah VALUES (5, "Teori Relativitas Umum", 3);
INSERT INTO matakuliah VALUES (6, "Kimia Organik", 3);
INSERT INTO matakuliah VALUES (7, "Fisika Matematika", 4);
INSERT INTO matakuliah VALUES (8, "Basis Data", 3);
INSERT INTO matakuliah VALUES (9, "Pengantar Asuransi Jiwa", 3);
INSERT INTO matakuliah VALUES (10, "Model Risiko", 3);
INSERT INTO matakuliah VALUES (11, "Pengantar Biokimia", 3);
INSERT INTO matakuliah VALUES (12, "Sepakbola untuk Profesional", 2);

INSERT INTO kontrak VALUES (1,10119004,2,4,"C");
INSERT INTO kontrak VALUES (2,10119004,3,2,"B");
INSERT INTO kontrak VALUES (3,10119007,1,1,"A");
INSERT INTO kontrak VALUES (4,10119007,12,2,"B");
INSERT INTO kontrak VALUES (5,10119007,9,5,"D");
INSERT INTO kontrak VALUES (6,10119010,2,4,"BL");
INSERT INTO kontrak VALUES (7,10119010,8,3,"C");
INSERT INTO kontrak VALUES (8,10219008,4,6,"C");
INSERT INTO kontrak VALUES (9,10219008,10,5,"C");
INSERT INTO kontrak VALUES (10,10219008,7,4,"A");
INSERT INTO kontrak VALUES (11,10219012,5,1,"A");
INSERT INTO kontrak VALUES (12,10219012,6,6,"D");
