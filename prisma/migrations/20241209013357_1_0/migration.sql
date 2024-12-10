-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(36) NOT NULL,
    `full_name` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `person_type` VARCHAR(2) NOT NULL,
    `document_type` VARCHAR(10) NOT NULL,
    `document_number` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,
    `birthday` DATE NOT NULL,
    `address_id` CHAR(36) NOT NULL,
    `setting_id` CHAR(36) NOT NULL,

    INDEX `user_email`(`email`),
    INDEX `user_id`(`id`),
    INDEX `user_address_idx`(`address_id`),
    INDEX `user_setting_idx`(`setting_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_recovery` (
    `id` CHAR(36) NOT NULL,
    `recovery_code` CHAR(36) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `user_id` CHAR(36) NOT NULL,

    INDEX `user_recovery_recovery_code`(`recovery_code`, `user_id`),
    INDEX `user_recovery_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_token` (
    `id` CHAR(36) NOT NULL,
    `token` CHAR(36) NOT NULL,
    `expiration_date` DATETIME(0) NOT NULL,
    `user_id` CHAR(36) NOT NULL,

    INDEX `user_token_token`(`token`, `user_id`),
    INDEX `user_token_user_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` CHAR(36) NOT NULL,
    `zip_code` VARCHAR(45) NOT NULL,
    `street_name` VARCHAR(45) NOT NULL,
    `street_number` VARCHAR(45) NOT NULL,
    `complement` VARCHAR(45) NULL,
    `neighborhood` VARCHAR(45) NOT NULL,
    `city` VARCHAR(45) NOT NULL,
    `state` VARCHAR(45) NOT NULL,
    `country` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_setting` (
    `id` CHAR(36) NOT NULL,
    `color_schema` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_address` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_setting` FOREIGN KEY (`setting_id`) REFERENCES `user_setting`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_recovery` ADD CONSTRAINT `user_recovery_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_token` ADD CONSTRAINT `user_token_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
