
-- Main identities table (stores ALL person types)
CREATE TABLE identities (
    id          SERIAL PRIMARY KEY,
    uid         VARCHAR(20) UNIQUE NOT NULL,       -- e.g. STU202400001
    type        VARCHAR(20) NOT NULL,              -- student, faculty, staff, phd, temporary
    status      VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Active, Suspended, Inactive, Archived

    -- Common fields
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(100),
    nationality VARCHAR(100),
    gender      VARCHAR(20),
    email       VARCHAR(150) UNIQUE NOT NULL,
    phone       VARCHAR(30),

    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Student-specific data
CREATE TABLE student_details (
    id              SERIAL PRIMARY KEY,
    identity_id     INT REFERENCES identities(id) ON DELETE CASCADE,

    national_id     VARCHAR(50),
    diploma_type    VARCHAR(100),
    diploma_year    INT,
    diploma_honors  VARCHAR(50),
    major           VARCHAR(100),
    entry_year      INT,
    faculty         VARCHAR(100),
    department      VARCHAR(100),
    group_name      VARCHAR(50),
    scholarship     BOOLEAN DEFAULT FALSE,
    sub_type        VARCHAR(50)  -- undergraduate, continuing, phd, international
);

-- Faculty-specific data
CREATE TABLE faculty_details (
    id                  SERIAL PRIMARY KEY,
    identity_id         INT REFERENCES identities(id) ON DELETE CASCADE,

    rank                VARCHAR(100),
    employment_category VARCHAR(100),
    appointment_date    DATE,
    primary_dept        VARCHAR(100),
    secondary_depts     TEXT,
    office_location     VARCHAR(150),
    phd_institution     VARCHAR(150),
    research_areas      TEXT,
    habilitation        BOOLEAN DEFAULT FALSE,
    contract_type       VARCHAR(50),
    contract_start      DATE,
    contract_end        DATE,
    teaching_hours      INT,
    sub_type            VARCHAR(50)  -- tenured, adjunct, visiting
);

-- Staff-specific data
CREATE TABLE staff_details (
    id              SERIAL PRIMARY KEY,
    identity_id     INT REFERENCES identities(id) ON DELETE CASCADE,

    department      VARCHAR(100),
    job_title       VARCHAR(100),
    grade           VARCHAR(50),
    entry_date      DATE,
    sub_type        VARCHAR(50)  -- administrative, technical, temporary
);

-- History of status changes (for audit trail)
CREATE TABLE status_history (
    id              SERIAL PRIMARY KEY,
    identity_id     INT REFERENCES identities(id) ON DELETE CASCADE,
    old_status      VARCHAR(20),
    new_status      VARCHAR(20),
    changed_at      TIMESTAMP DEFAULT NOW(),
    note            TEXT
);

-- Counter table to generate sequential IDs per type per year
CREATE TABLE id_counters (
    type_prefix VARCHAR(10) NOT NULL,
    year        INT NOT NULL,
    last_number INT DEFAULT 0,
    PRIMARY KEY (type_prefix, year)
);
