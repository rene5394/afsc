/*
  Warnings:

  - You are about to drop the `profile_statuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `profiles` DROP FOREIGN KEY `profiles_status_id_fkey`;

-- DropTable
DROP TABLE `profile_statuses`;
