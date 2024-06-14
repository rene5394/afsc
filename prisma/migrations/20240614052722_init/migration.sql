/*
  Warnings:

  - You are about to drop the column `route_id` on the `profile_routes` table. All the data in the column will be lost.
  - You are about to drop the `routes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `latitude` to the `profile_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `profile_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `profile_routes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile_routes` DROP FOREIGN KEY `profile_routes_route_id_fkey`;

-- AlterTable
ALTER TABLE `profile_routes` DROP COLUMN `route_id`,
    ADD COLUMN `latitude` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `longitude` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `routes`;
