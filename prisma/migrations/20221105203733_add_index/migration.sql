-- RenameIndex
ALTER TABLE `participate` RENAME INDEX `participate_party_id_fkey` TO `participate_party_id_idx`;

-- RenameIndex
ALTER TABLE `party` RENAME INDEX `party_user_id_fkey` TO `party_user_id_idx`;
