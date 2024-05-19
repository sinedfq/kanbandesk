--
-- Файл сгенерирован с помощью SQLiteStudio v3.4.4 в Вс май 19 15:08:26 2024
--
-- Использованная кодировка текста: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Таблица: auth_group
CREATE TABLE IF NOT EXISTS "auth_group" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(150) NOT NULL UNIQUE);

-- Таблица: auth_group_permissions
CREATE TABLE IF NOT EXISTS "auth_group_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);

-- Таблица: auth_permission
CREATE TABLE IF NOT EXISTS "auth_permission" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "codename" varchar(100) NOT NULL, "name" varchar(255) NOT NULL);
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (1, 1, 'add_logentry', 'Can add log entry');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (2, 1, 'change_logentry', 'Can change log entry');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (3, 1, 'delete_logentry', 'Can delete log entry');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (4, 1, 'view_logentry', 'Can view log entry');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (5, 2, 'add_permission', 'Can add permission');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (6, 2, 'change_permission', 'Can change permission');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (7, 2, 'delete_permission', 'Can delete permission');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (8, 2, 'view_permission', 'Can view permission');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (9, 3, 'add_group', 'Can add group');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (10, 3, 'change_group', 'Can change group');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (11, 3, 'delete_group', 'Can delete group');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (12, 3, 'view_group', 'Can view group');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (13, 4, 'add_user', 'Can add user');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (14, 4, 'change_user', 'Can change user');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (15, 4, 'delete_user', 'Can delete user');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (16, 4, 'view_user', 'Can view user');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (17, 5, 'add_contenttype', 'Can add content type');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (18, 5, 'change_contenttype', 'Can change content type');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (19, 5, 'delete_contenttype', 'Can delete content type');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (20, 5, 'view_contenttype', 'Can view content type');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (21, 6, 'add_session', 'Can add session');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (22, 6, 'change_session', 'Can change session');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (23, 6, 'delete_session', 'Can delete session');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (24, 6, 'view_session', 'Can view session');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (25, 7, 'add_profile', 'Can add profile');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (26, 7, 'change_profile', 'Can change profile');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (27, 7, 'delete_profile', 'Can delete profile');
INSERT INTO auth_permission (id, content_type_id, codename, name) VALUES (28, 7, 'view_profile', 'Can view profile');

-- Таблица: auth_user
CREATE TABLE IF NOT EXISTS auth_user (id integer NOT NULL PRIMARY KEY AUTOINCREMENT, password varchar (128) NOT NULL, last_login datetime, is_superuser bool NOT NULL, username varchar (150) NOT NULL UNIQUE, last_name varchar (150) NOT NULL, email varchar (254) NOT NULL, is_staff bool NOT NULL, is_active bool NOT NULL, date_joined datetime NOT NULL, first_name varchar (150) NOT NULL, cards_id INTEGER UNIQUE);
INSERT INTO auth_user (id, password, last_login, is_superuser, username, last_name, email, is_staff, is_active, date_joined, first_name, cards_id) VALUES (1, 'pbkdf2_sha256$390000$FMO5a9H9dPksCxAi9nyBC7$wN71GdnVvWe6UTaCbk+8rQHChLwS7r7Y7MBD1KsBSs8=', '2024-04-16 08:19:55.505364', 0, 'sined3', 'Хухарев', 'deniskhuharev@gmail.com', 0, 1, '2024-04-16 08:08:54.899672', 'Денис', NULL);
INSERT INTO auth_user (id, password, last_login, is_superuser, username, last_name, email, is_staff, is_active, date_joined, first_name, cards_id) VALUES (2, 'pbkdf2_sha256$390000$qMWualnPFiVYRN03IV6Qlf$hm37+0pI0NTc3tJuJpMiDtQNeW7OUFXjXU/PPS5hSMg=', '2024-04-16 08:20:38.245729', 0, 'sined5', 'Хухарев', 'deniskhuharev@gmail.com', 0, 1, '2024-04-16 08:20:30.831538', 'Денис', NULL);

-- Таблица: auth_user_cards
CREATE TABLE IF NOT EXISTS auth_user_cards (id INTEGER PRIMARY KEY, card_id INTEGER NOT NULL, user_id INTEGER NOT NULL REFERENCES auth_user (id) UNIQUE);

-- Таблица: auth_user_groups
CREATE TABLE IF NOT EXISTS "auth_user_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED);

-- Таблица: auth_user_user_permissions
CREATE TABLE IF NOT EXISTS "auth_user_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);

-- Таблица: board
CREATE TABLE IF NOT EXISTS board (id PRIMARY KEY NOT NULL, board_name varchar (100) NOT NULL);

-- Таблица: card
CREATE TABLE IF NOT EXISTS card (id INTEGER PRIMARY KEY NOT NULL, title varchar (150) NOT NULL, description TEXT NOT NULL, user_id INTEGER REFERENCES auth_user_cards (user_id), "index" INTEGER UNIQUE NOT NULL, board_id INTEGER NOT NULL UNIQUE REFERENCES board (id));

-- Таблица: django_admin_log
CREATE TABLE IF NOT EXISTS "django_admin_log" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" text NULL, "object_repr" varchar(200) NOT NULL, "action_flag" smallint unsigned NOT NULL CHECK ("action_flag" >= 0), "change_message" text NOT NULL, "content_type_id" integer NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED, "action_time" datetime NOT NULL);

-- Таблица: django_content_type
CREATE TABLE IF NOT EXISTS "django_content_type" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app_label" varchar(100) NOT NULL, "model" varchar(100) NOT NULL);
INSERT INTO django_content_type (id, app_label, model) VALUES (1, 'admin', 'logentry');
INSERT INTO django_content_type (id, app_label, model) VALUES (2, 'auth', 'permission');
INSERT INTO django_content_type (id, app_label, model) VALUES (3, 'auth', 'group');
INSERT INTO django_content_type (id, app_label, model) VALUES (4, 'auth', 'user');
INSERT INTO django_content_type (id, app_label, model) VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO django_content_type (id, app_label, model) VALUES (6, 'sessions', 'session');
INSERT INTO django_content_type (id, app_label, model) VALUES (7, 'users', 'profile');

-- Таблица: django_migrations
CREATE TABLE IF NOT EXISTS "django_migrations" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "applied" datetime NOT NULL);
INSERT INTO django_migrations (id, app, name, applied) VALUES (1, 'contenttypes', '0001_initial', '2024-04-16 07:47:51.582486');
INSERT INTO django_migrations (id, app, name, applied) VALUES (2, 'auth', '0001_initial', '2024-04-16 07:47:51.599469');
INSERT INTO django_migrations (id, app, name, applied) VALUES (3, 'admin', '0001_initial', '2024-04-16 07:47:51.611472');
INSERT INTO django_migrations (id, app, name, applied) VALUES (4, 'admin', '0002_logentry_remove_auto_add', '2024-04-16 07:47:51.623475');
INSERT INTO django_migrations (id, app, name, applied) VALUES (5, 'admin', '0003_logentry_add_action_flag_choices', '2024-04-16 07:47:51.629476');
INSERT INTO django_migrations (id, app, name, applied) VALUES (6, 'contenttypes', '0002_remove_content_type_name', '2024-04-16 07:47:51.646483');
INSERT INTO django_migrations (id, app, name, applied) VALUES (7, 'auth', '0002_alter_permission_name_max_length', '2024-04-16 07:47:51.655490');
INSERT INTO django_migrations (id, app, name, applied) VALUES (8, 'auth', '0003_alter_user_email_max_length', '2024-04-16 07:47:51.665492');
INSERT INTO django_migrations (id, app, name, applied) VALUES (9, 'auth', '0004_alter_user_username_opts', '2024-04-16 07:47:51.671493');
INSERT INTO django_migrations (id, app, name, applied) VALUES (10, 'auth', '0005_alter_user_last_login_null', '2024-04-16 07:47:51.681487');
INSERT INTO django_migrations (id, app, name, applied) VALUES (11, 'auth', '0006_require_contenttypes_0002', '2024-04-16 07:47:51.685489');
INSERT INTO django_migrations (id, app, name, applied) VALUES (12, 'auth', '0007_alter_validators_add_error_messages', '2024-04-16 07:47:51.692490');
INSERT INTO django_migrations (id, app, name, applied) VALUES (13, 'auth', '0008_alter_user_username_max_length', '2024-04-16 07:47:51.703492');
INSERT INTO django_migrations (id, app, name, applied) VALUES (14, 'auth', '0009_alter_user_last_name_max_length', '2024-04-16 07:47:51.714495');
INSERT INTO django_migrations (id, app, name, applied) VALUES (15, 'auth', '0010_alter_group_name_max_length', '2024-04-16 07:47:51.723498');
INSERT INTO django_migrations (id, app, name, applied) VALUES (16, 'auth', '0011_update_proxy_permissions', '2024-04-16 07:47:51.731502');
INSERT INTO django_migrations (id, app, name, applied) VALUES (17, 'auth', '0012_alter_user_first_name_max_length', '2024-04-16 07:47:51.740500');
INSERT INTO django_migrations (id, app, name, applied) VALUES (18, 'sessions', '0001_initial', '2024-04-16 07:47:51.749503');
INSERT INTO django_migrations (id, app, name, applied) VALUES (19, 'users', '0001_initial', '2024-04-16 07:47:51.756506');
INSERT INTO django_migrations (id, app, name, applied) VALUES (20, 'users', '0002_alter_profile_avatar', '2024-04-16 07:47:51.766507');
INSERT INTO django_migrations (id, app, name, applied) VALUES (21, 'users', '0003_alter_profile_avatar', '2024-04-16 07:47:51.775510');
INSERT INTO django_migrations (id, app, name, applied) VALUES (22, 'users', '0004_profile_bio', '2024-04-16 07:47:51.785512');
INSERT INTO django_migrations (id, app, name, applied) VALUES (23, 'users', '0005_profile_cards_id', '2024-04-16 07:47:51.796515');

-- Таблица: django_session
CREATE TABLE IF NOT EXISTS "django_session" ("session_key" varchar(40) NOT NULL PRIMARY KEY, "session_data" text NOT NULL, "expire_date" datetime NOT NULL);
INSERT INTO django_session (session_key, session_data, expire_date) VALUES ('1usujws878std2egeuijs1h2blukc8bw', 'eyJfc2Vzc2lvbl9leHBpcnkiOjB9:1rwdsJ:lCD71awqN4Ju9vfc2wS8PNXMBdodUowPSX81CV0Q2Ew', '2024-05-16 08:09:07.511397');
INSERT INTO django_session (session_key, session_data, expire_date) VALUES ('npmtm8feazvbhcfsq88hyel2ct0d3eq3', 'eyJfc2Vzc2lvbl9leHBpcnkiOjB9:1rwdtG:J4LjdyemGrjF9FwZlwvfmPdVfgtjC_xWBBeievYaBXc', '2024-05-16 08:10:06.699813');
INSERT INTO django_session (session_key, session_data, expire_date) VALUES ('1h16m7hcdtx6y25s7oj1otimummzxxqy', 'eyJfc2Vzc2lvbl9leHBpcnkiOjB9:1rwdxF:rVqQVL20jvWHx1xwmT4QEL4nNGkA6t_v3-MHyZI7eOc', '2024-05-16 08:14:13.641756');
INSERT INTO django_session (session_key, session_data, expire_date) VALUES ('o28gvwnkagyx42jba8iidxrcztm0ts66', 'eyJfc2Vzc2lvbl9leHBpcnkiOjB9:1rwe1l:ocb43omP4Za-Kv67BhL-vkUpxP4AgBlK-E_Zp6ToveY', '2024-05-16 08:18:53.228073');
INSERT INTO django_session (session_key, session_data, expire_date) VALUES ('0r58iu9lg1v2sjvt4pks55o8ehht20tm', 'eyJfc2Vzc2lvbl9leHBpcnkiOjB9:1rwe2l:loRggFWlcEQXirCl1vlCQUI_HRDqmtBOYSxK5R6EhcI', '2024-05-16 08:19:55.500364');
INSERT INTO django_session (session_key, session_data, expire_date) VALUES ('trrc5ipadww95u8y5zj2nyiv5mj2tvmf', '.eJxVjEEOwiAQRe_C2hA6A0K7dO8ZCB2mFjXQlDbRGO-uTbrp9r_3_kf4yrWmkj2_pjS_RadOwod1Gf1aefYpik6AOGx9oAfnDcR7yLciqeRlTr3cFLnTKq8l8vOyu4eDMdTxXzMrcoBIoFqtbURQwWCwGI0FYE1auwbojA7JDabRBK1tGzNYsLHnQXx_4g8-Ig:1rwe3S:u4e1HwF64WoH6GN1HUwN_EPoacVwZhluOklbMs6jyuE', '2024-05-16 08:20:38.254144');

-- Таблица: users_profile
CREATE TABLE IF NOT EXISTS users_profile (id integer NOT NULL PRIMARY KEY AUTOINCREMENT, avatar varchar (100) NOT NULL, user_id integer NOT NULL UNIQUE REFERENCES auth_user (id) DEFERRABLE INITIALLY DEFERRED, bio text NOT NULL);
INSERT INTO users_profile (id, avatar, user_id, bio) VALUES (1, 'default.jpg', 2, '');

-- Индекс: auth_group_permissions_group_id_b120cbf9
CREATE INDEX IF NOT EXISTS "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions" ("group_id");

-- Индекс: auth_group_permissions_group_id_permission_id_0cd325b0_uniq
CREATE UNIQUE INDEX IF NOT EXISTS "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions" ("group_id", "permission_id");

-- Индекс: auth_group_permissions_permission_id_84c5c92e
CREATE INDEX IF NOT EXISTS "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions" ("permission_id");

-- Индекс: auth_permission_content_type_id_2f476e4b
CREATE INDEX IF NOT EXISTS "auth_permission_content_type_id_2f476e4b" ON "auth_permission" ("content_type_id");

-- Индекс: auth_permission_content_type_id_codename_01ab375a_uniq
CREATE UNIQUE INDEX IF NOT EXISTS "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission" ("content_type_id", "codename");

-- Индекс: auth_user_groups_group_id_97559544
CREATE INDEX IF NOT EXISTS "auth_user_groups_group_id_97559544" ON "auth_user_groups" ("group_id");

-- Индекс: auth_user_groups_user_id_6a12ed8b
CREATE INDEX IF NOT EXISTS "auth_user_groups_user_id_6a12ed8b" ON "auth_user_groups" ("user_id");

-- Индекс: auth_user_groups_user_id_group_id_94350c0c_uniq
CREATE UNIQUE INDEX IF NOT EXISTS "auth_user_groups_user_id_group_id_94350c0c_uniq" ON "auth_user_groups" ("user_id", "group_id");

-- Индекс: auth_user_user_permissions_permission_id_1fbb5f2c
CREATE INDEX IF NOT EXISTS "auth_user_user_permissions_permission_id_1fbb5f2c" ON "auth_user_user_permissions" ("permission_id");

-- Индекс: auth_user_user_permissions_user_id_a95ead1b
CREATE INDEX IF NOT EXISTS "auth_user_user_permissions_user_id_a95ead1b" ON "auth_user_user_permissions" ("user_id");

-- Индекс: auth_user_user_permissions_user_id_permission_id_14a6b632_uniq
CREATE UNIQUE INDEX IF NOT EXISTS "auth_user_user_permissions_user_id_permission_id_14a6b632_uniq" ON "auth_user_user_permissions" ("user_id", "permission_id");

-- Индекс: django_admin_log_content_type_id_c4bce8eb
CREATE INDEX IF NOT EXISTS "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log" ("content_type_id");

-- Индекс: django_admin_log_user_id_c564eba6
CREATE INDEX IF NOT EXISTS "django_admin_log_user_id_c564eba6" ON "django_admin_log" ("user_id");

-- Индекс: django_content_type_app_label_model_76bd3d3b_uniq
CREATE UNIQUE INDEX IF NOT EXISTS "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type" ("app_label", "model");

-- Индекс: django_session_expire_date_a5c62663
CREATE INDEX IF NOT EXISTS "django_session_expire_date_a5c62663" ON "django_session" ("expire_date");

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
