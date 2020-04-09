drop DATABASE ehealthDB;
create DATABASE ehealthDB;
use ehealthDB;

create table Patient (
    username varchar(50) not null,
    userPassword varchar(50) not null,
    fName VARCHAR(40),
    sName VARCHAR(40),
    medicareNo int,
    medicareExpiry datetime,
    medicareIRN TINYINT,
    isNewPatient bool,
    constraint Patient_PK primary key (username)
);

create table Doctor (
    username varchar(50) not null,
    userPassword varchar(50) not null,
    fName VARCHAR(40),
    sName VARCHAR(40),
    certifications longtext,
    CONSTRAINT Doctor_PK primary key (username)
);

create table Schedule (
    pat_username varchar(50),
    doc_username varchar(50),
    appointmentTime DATETIME,
    CONSTRAINT Schedule_FK1 FOREIGN KEY (doc_username) REFERENCES Doctor(username),
    CONSTRAINT Schedule_FK2 FOREIGN KEY (pat_username) REFERENCES Patient(username),
    CONSTRAINT Availability_PK PRIMARY KEY (pat_username, doc_username)
);

create table Person_Availability (
    doc_username varchar(50),
    startTime datetime,
    endTime datetime,
    CONSTRAINT Person_Availability_FK FOREIGN KEY (doc_username) REFERENCES Doctor(username)
);

CREATE TABLE Notes (
    pat_username varchar(50),
    dateWritten datetime,
    textWritten longtext,
    doc_username varchar(50),
    CONSTRAINT Notes_FK FOREIGN KEY (pat_username) REFERENCES Patient(username)
);

create table Communication (
    pat_username varchar(50),
    doc_password varchar(50),
    theMessage longtext,
    timeSent DATETIME
);