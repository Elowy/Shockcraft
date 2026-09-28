-- MySQL 8.0+. Run once against an empty ShockCraft database before setting MYSQL_URL.
CREATE TABLE IF NOT EXISTS users (
 id varchar(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 email varchar(254) NOT NULL,
 name varchar(100) NOT NULL,
 password_hash varchar(100) CHARACTER SET ascii NOT NULL,
 created_at bigint NOT NULL,
 UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS sessions (
 token_hash char(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 expires_at bigint NOT NULL,
 created_at bigint NOT NULL,
 KEY sessions_user_idx (user_id),
 KEY sessions_expiry_idx (expires_at),
 CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS auth_limits (
 `key` char(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 attempts int NOT NULL,
 expires_at bigint NOT NULL,
 KEY auth_limits_expiry_idx (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS plans (
 id varchar(191) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 data longtext NOT NULL,
 revision int NOT NULL,
 updated_at varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS billing_settings (
 id varchar(40) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 data longtext NOT NULL,
 revision int NOT NULL,
 updated_at varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS billing_grants (
 id varchar(100) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 project_id varchar(191) CHARACTER SET ascii COLLATE ascii_bin NULL,
 mode varchar(10) NOT NULL,
 created_at bigint NOT NULL,
 UNIQUE KEY billing_grants_project_unique (user_id,project_id),
 KEY billing_grants_user_idx (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS billing_orders (
 id varchar(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 amount int NOT NULL,
 currency varchar(3) NOT NULL,
 mode varchar(10) NOT NULL,
 status varchar(20) NOT NULL,
 session_id varchar(255) CHARACTER SET ascii COLLATE ascii_bin NULL,
 created_at bigint NOT NULL,
 updated_at bigint NOT NULL,
 UNIQUE KEY billing_orders_session_unique (session_id),
 KEY billing_orders_user_idx (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
