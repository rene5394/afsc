-- DropForeignKey
ALTER TABLE `profile_assets` DROP FOREIGN KEY `profile_assets_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile_links` DROP FOREIGN KEY `profile_links_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile_routes` DROP FOREIGN KEY `profile_routes_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile_tags` DROP FOREIGN KEY `profile_tags_profile_id_fkey`;

-- AddForeignKey
ALTER TABLE `profile_tags` ADD CONSTRAINT `profile_tags_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_assets` ADD CONSTRAINT `profile_assets_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_routes` ADD CONSTRAINT `profile_routes_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_links` ADD CONSTRAINT `profile_links_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
