-- MySQL 8.0+. Run once against an empty ShockCraft database before setting MYSQL_URL.
CREATE TABLE IF NOT EXISTS users (
 id varchar(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 email varchar(254) NOT NULL,
 name varchar(100) NOT NULL,
 password_hash varchar(100) CHARACTER SET ascii NOT NULL,
 email_verified_at bigint NULL,
 auth_version int NOT NULL DEFAULT 0,
 created_at bigint NOT NULL,
 UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS sessions (
 token_hash char(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 auth_version int NOT NULL DEFAULT 0,
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
 updated_at varchar(30) NOT NULL,
 state varchar(10) NOT NULL DEFAULT 'active',
 state_changed_at varchar(30) NULL
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
 kind varchar(20) NOT NULL DEFAULT 'project',
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

CREATE TABLE IF NOT EXISTS mail_settings (
 id varchar(40) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 data longtext NOT NULL,
 revision int NOT NULL,
 updated_at varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS account_tokens (
 token_hash char(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 email varchar(254) NOT NULL,
 purpose varchar(10) NOT NULL,
 auth_version int NOT NULL,
 expires_at bigint NOT NULL,
 created_at bigint NOT NULL,
 KEY account_tokens_user_idx (user_id),
 KEY account_tokens_expiry_idx (expires_at),
 CONSTRAINT account_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS billing_subscriptions (
 id varchar(255) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 mode varchar(10) NOT NULL,
 order_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 customer_id varchar(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 status varchar(40) NOT NULL,
 paid_until bigint NOT NULL DEFAULT 0,
 cancel_at_period_end int NOT NULL DEFAULT 0,
 revision int NOT NULL DEFAULT 0,
 updated_at bigint NOT NULL,
 UNIQUE KEY billing_subscriptions_order_id_unique (order_id),
 KEY billing_subscriptions_user_mode_idx (user_id,mode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS subscription_checkouts (
 id varchar(50) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 order_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 expires_at bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS invoice_settings (id varchar(32) PRIMARY KEY,data longtext NOT NULL,revision int NOT NULL,updated_at varchar(40) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS billing_profiles (user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,data longtext NOT NULL,updated_at bigint NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS order_billing (order_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,data longtext NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS invoice_jobs (id varchar(180) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,user_id varchar(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,mode varchar(10) NOT NULL,payload longtext NOT NULL,status varchar(20) NOT NULL,number varchar(100) NULL,error varchar(250) NULL,attempts int NOT NULL DEFAULT 0,lock_until bigint NOT NULL DEFAULT 0,created_at bigint NOT NULL,updated_at bigint NOT NULL,KEY invoice_jobs_user_idx(user_id),KEY invoice_jobs_status_idx(status)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
