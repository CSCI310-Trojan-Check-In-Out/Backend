DROP TABLE IF EXISTS place CASCADE;
DROP TABLE IF EXISTS visit_history CASCADE;
DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE account (
	id SERIAL UNIQUE PRIMARY KEY CHECK (id > 0),
    usc_id VARCHAR(20) UNIQUE,
	username VARCHAR(100),
	major VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    passcode VARCHAR(64),
    picture VARCHAR(2083),
    is_admin SMALLINT
);

CREATE TABLE place (
	id SERIAL UNIQUE PRIMARY KEY CHECK (id > 0),
	place_name VARCHAR(100) UNIQUE,
    abbreviation VARCHAR(10) UNIQUE,
    place_address VARCHAR(200),
    qr_code_token uuid DEFAULT gen_random_uuid(),
    picture VARCHAR(2083),
    capacity INT,
    current_numbers INT,
    open_time TIMESTAMP,
    close_time TIMESTAMP
);

CREATE TABLE visit_history (
	id SERIAL UNIQUE PRIMARY KEY CHECK (id > 0),
	account_id INT REFERENCES account(id) ON DELETE CASCADE,
    place_id INT REFERENCES place(id) ON DELETE CASCADE,
    enter_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leave_time TIMESTAMP NULL DEFAULT NULL
);