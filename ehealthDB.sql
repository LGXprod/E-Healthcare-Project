ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

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
    medicareIRN TINYINT, -- be careful not to use big numbers
    isNewPatient bool,
    constraint Patient_PK primary key (username)
);

create table Doctor (
    username varchar(50) not null,
    userPassword varchar(50) not null,
    fName VARCHAR(40),
    sName VARCHAR(40),
    certifications longtext,
    providerNo int,
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

drop table Person_Availability;

create table Doctor_Availability (
    doc_username varchar(50),
    startTime datetime,
    endTime datetime,
    CONSTRAINT Doctor_Availability_FK FOREIGN KEY (doc_username) REFERENCES Doctor(username)
);

-- copy and run in workbench:
ALTER TABLE SCHEDULE DROP FOREIGN KEY SCHEDULE_FK1;
ALTER TABLE SCHEDULE DROP FOREIGN KEY SCHEDULE_FK2;
ALTER TABLE schedule DROP PRIMARY KEY;

alter table doctor add (specialisation longtext, education longtext, experience longtext);

create table Valid_Provider_No (
    providerNo int
);

Create table Urgent_Cases (
	pat_username varchar(50),
	CaseDate datetime,
	CaseTime datetime,
	CONSTRAINT PatientID_FK FOREIGN KEY (pat_username) REFERENCES Patient(username)
);

create table chat (
    pat_username VARCHAR(50),
    doc_username VARCHAR(50),
    patient_text longtext,
    doctor_text longtext,
    CONSTRAINT chat_fk1 FOREIGN KEY (doc_username) REFERENCES doctor(username),
    CONSTRAINT chat_fk2 FOREIGN KEY (pat_username) REFERENCES patient(username)
);