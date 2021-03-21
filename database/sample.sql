INSERT INTO account (usc_id, username, major, email, passcode, picture, is_admin)
VALUES ('00000001', 'Tommy', 'Computer Science', 'ttrojan@usc.edu', '1234567', './picture/tommy.jpg', 0);

INSERT INTO account (usc_id, username, major, email, passcode, picture, is_admin)
VALUES ('00000002', 'Billy', 'Computer Science', 'billy@usc.edu', '1234567', './picture/billy.jpg', 0);

INSERT INTO account (username, email, passcode, picture, is_admin)
VALUES ('Arron', 'arron@usc.edu', '1234567', './picture/arron.jpg', 1);

INSERT INTO account (username, email, passcode, picture, is_admin)
VALUES ('Mark', 'mark@usc.edu', '1234567', './picture/mark.jpg', 1);

INSERT INTO place (place_name, abbreviation, place_address, picture, capacity, open_time, close_time)
VALUES ('Salvatori Computer Science Center', 'SAL', '941 Bloom Walk, Los Angeles', './picture/sal.jpg', 100, '08:00', '17:00');

INSERT INTO place (place_name, abbreviation, place_address, picture, capacity, open_time, close_time)
VALUES ('Ronald Tutor Campus Center', 'TCC', '3607 Trousdale Pkwy, Los Angeles', './picture/tcc.jpg', 50, '08:00', '17:00');

INSERT INTO place (place_name, place_address, picture, capacity, open_time, close_time)
VALUES ('USC Village Fitness Center', '929-959 W Jefferson Blvd', './picture/gym.jpg', 50, '05:00', '23:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (1, 1, '01/01/2021 10:00', '01/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (1, 2, '03/01/2021 10:00', '03/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (2, 1, '01/01/2021 10:00', '01/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (2, 1, '01/02/2021 10:00', '01/02/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time)
VALUES (1, 3, '03/20/2021 10:00');
