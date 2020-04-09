create DATABASE ehealthDB;

create table Patient (
    patientID int not null,
    fName VARCHAR(40),
    sName VARCHAR(40),
    medicareNo int,
    medicareExpiry datetime,
    medicareIRN TINYINT,
    isNewPatient bool,
    constraint Patient_PK primary key (patientID)
);

create table Doctor (
    doctorID int not null,
    fName VARCHAR(40),
    sName VARCHAR(40),
    certifications longtext,
    CONSTRAINT Doctor_PK primary key (doctorID)
);

create table Schedule (
    doctorID int not null,
    patientID int not null,
    appointmentTime DATETIME,
    CONSTRAINT Schedule_FK1 FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID),
    CONSTRAINT Schedule_FK2 FOREIGN KEY (patientID) REFERENCES Patient(patientID),
    CONSTRAINT Availability_PK PRIMARY KEY (doctorID, patientID)
);

create table Person_Availability (
    doctorID int not null,
    startTime datetime,
    endTime datetime,
    CONSTRAINT Person_Availability_FK FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID)
);

CREATE TABLE Notes (
    patientID int not null,
    dateWritten datetime,
    textWritten longtext,
    doctorID int,
    CONSTRAINT Notes_FK FOREIGN KEY (patientID) REFERENCES Patient(patientID)
);

create table Communication (
    patientID int not null,
    doctorID int not null,
    theMessage longtext,
    timeSent DATETIME
);