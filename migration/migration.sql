CREATE TABLE member(
	member_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL,
    generation TINYINT(2) NOT NULL,
    birth_date DATE NOT NULL,
    blood_type ENUM('A', 'B', 'O', 'AB'),
    horoscopes ENUM('Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpion','Sagittarius','Capricon','Aquarius','Pisces'),
    jikoshoukai VARCHAR(100) NOT NULL,
    body_height INT(3) NOT NULL,
    image_profile TEXT NOT NULL,
    is_active CHAR(1) NOT NULL,
    social_media JSON,
    joined_at DATE NOT NULL,
    created_at DATETIME NOT NULL
);