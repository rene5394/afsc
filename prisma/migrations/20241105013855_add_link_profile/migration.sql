-- CreateTable
CREATE TABLE `profile_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `profile_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile_links` ADD CONSTRAINT `profile_links_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
