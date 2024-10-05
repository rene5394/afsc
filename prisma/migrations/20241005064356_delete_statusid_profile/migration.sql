/*
  Warnings:

  - You are about to drop the column `status_id` on the `profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `profiles_status_id_fkey` ON `profiles`;

-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `status_id`;
