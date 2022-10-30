USE tokens;

CREATE TABLE user(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  address CHAR(42) NOT NULL,
  amount BIGINT
);

CREATE TABLE fund(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  useraddress CHAR(42) NOT NULL,
  numberofholders INT(255) NOT NULL,
  createdate TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  fundid BIGINT NOT NULL,
  contractaddress CHAR(42) NOT NULL,
  amount BIGINT NOT NULL
);