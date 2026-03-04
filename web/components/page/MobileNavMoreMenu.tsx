import { Column } from "@/web/components/core/Column";

type MobileNavMoreMenuProps = {
  class?: string;
};

export function MobileNavMoreMenu(props: MobileNavMoreMenuProps) {
  // ------------------------------------
  //  🔍 Search stops, lines, pages
  // ------------------------------------
  //  Recent pages                    ↕️
  //  - 12:10 Southern Cross train    ⭐
  //  - 12:50 Southern Cross train    ⚫
  //  - Berwick station               ⚫
  //  - Southern Cross station        ⚫
  //  - 7:49 East Pakenham train      ⚫
  // ------------------------------------
  //  ℹ️ About
  //  ⚙️ Settings
  //  🧑‍💻 Developer info
  //  🛠️ Admin controls
  //  ✨ Zen mode
  // ------------------------------------
  return <Column></Column>;
}
