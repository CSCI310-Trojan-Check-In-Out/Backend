CREATE DATABASE postgresql-animated-67845;

CREATE TABLE account (
	id SERIAL UNIQUE PRIMARY KEY,
    usc_id VARCHAR(20),
	username VARCHAR(100) UNIQUE,
	major VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    passcode VARCHAR(64),
    picture VARCHAR(2083),
    is_admin SMALLINT
);

CREATE TABLE place (
	id SERIAL PRIMARY KEY,
	place_name VARCHAR(100) UNIQUE,
    abbreviation VARCHAR(10) UNIQUE,
    place_address VARCHAR(200),
    qr_code_token VARCHAR(100),
    picture VARCHAR(2083),
    capacity INT,
    current_numbers INT,
    open_time DATE,
    close_time DATE
);

CREATE TABLE visit_history (
	id SERIAL PRIMARY KEY,
	account_id INT FOREIGN KEY REFERENCES account,
    place_id INT FOREIGN KEY REFERENCES place,
    enter_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leave_time TIMESTAMP NULL DEFAULT NULL
);