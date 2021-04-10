INSERT INTO account (first_name, last_name, full_name, major, email, passcode, picture, is_admin)
VALUES ('Tommy', 'Trojan', 'Tommy Trojan', 'Computer Science', 'ttrojan@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/tommy.jpg', 0);

INSERT INTO account (first_name, last_name, full_name, major, email, passcode, picture, is_admin)
VALUES ('Billy', 'Bill', 'Billy Bill', 'Literature', 'billy@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/billy.jpg', 0);

INSERT INTO account (first_name, last_name, full_name, major, email, passcode, picture, is_admin)
VALUES ('Lily', 'Lee', 'Biology', 'Lily Lee', 'lily@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/lily.jpg', 0);

INSERT INTO account (first_name, last_name, full_name, major, email, passcode, picture, is_admin)
VALUES ('Abby', 'Wang', 'Abby Wang', 'Computer Science', 'trojan@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/trojan.jpg', 0);

INSERT INTO account (first_name, last_name, full_name, email, passcode, picture, is_admin)
VALUES ('Arron', 'Cote', 'Arron Cote', 'arron@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/arron.jpg', 1);

INSERT INTO account (first_name, last_name, full_name, email, passcode, picture, is_admin)
VALUES ('Mark', 'Redekopp', 'Mark Redekopp', 'mark@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/mark.jpg', 1);

INSERT INTO account (first_name, last_name, full_name, email, passcode, picture, is_admin)
VALUES ('Admin', 'Pic', 'Admin Pic', 'admin@usc.edu', 'c4ca4238a0b923820dcc509a6f75849b', './picture/admin.jpg', 1);

INSERT INTO place (place_name, abbreviation, place_address, picture, capacity,  open_time, close_time)
VALUES ('Salvatori Computer Science Center', 'SAL', '941 Bloom Walk, Los Angeles', './picture/sal.jpg', 100, '08:00', '17:00');

INSERT INTO place (place_name, abbreviation, place_address, picture, capacity, open_time, close_time)
VALUES ('Ronald Tutor Campus Center', 'TCC', '3607 Trousdale Pkwy, Los Angeles', './picture/tcc.jpg', 50, '08:00', '17:00');

INSERT INTO place (place_name, place_address, picture, capacity, open_time, close_time)
VALUES ('USC Village Fitness Center', '929-959 W Jefferson Blvd', './picture/gym.jpg', 50, '05:00', '23:00');

INSERT INTO place (place_name, abbreviation, place_address, picture, capacity, open_time, close_time)
VALUES ('Taper Hall', 'THH', '3501 Trousdale Pkwy', './picture/thh.jpg', 200, '08:00', '20:00');

INSERT INTO place (place_name, place_address, picture, capacity, open_time, close_time)
VALUES ('Leavey Library', '651 W 35th St', './picture/leavey.jpg', 200, '00:00', '23:59');

INSERT INTO place (place_name, place_address, picture, capacity, open_time, close_time)
VALUES ('Doheny Memorial Library', '3550 Trousdale Pkwy,', './picture/doheny.jpg', 200, '00:00', '23:59');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (1, 1, '01/01/2021 10:00', '01/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (1, 2, '03/01/2021 10:00', '03/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (2, 1, '01/01/2021 10:00', '01/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (2, 1, '01/02/2021 10:00', '01/02/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (3, 5, '02/01/2021 10:00', '02/01/2021 12:00');

INSERT INTO visit_history (account_id, place_id, enter_time, leave_time)
VALUES (3, 4, '02/02/2021 10:00', '02/02/2021 11:00');
