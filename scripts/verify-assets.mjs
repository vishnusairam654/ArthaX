// @ts-check
/**
 * ARTHAX asset manifest verification.
 * Validates every curated asset required by the project exists under assets/.
 * Exit code 1 if anything is missing.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "assets";

/** @type {Record<string, string[]>} category dir -> required filenames */
const DIRS = {
  brand: [
    "currency_symbol.png",
    "favicon.png",
    "nav_logo.png",
    "primary_watermark.png",
    "watermark_transparent.png",
    "watermark_3.png",
    "social_preview_image.png",
  ],
  "": ["Color_Palette.png"],
  banks: ["nava_bank.png", "samaya_bank.png", "setu_bank.png", "sthira_bank.png", "vayu_bank.png"],
  portals: [
    "banks.png",
    "central_bank.png",
    "central_guide.png",
    "shop.png",
    "stocks.png",
    "user.png",
  ],
  icons: [
    "completed.png",
    "failed.png",
    "finalyzing.png",
    "lock_icon.png",
    "pending.png",
    "processing.png",
    "reversed.png",
  ],
  illustrations: [
    "404_error.png",
    "404_error_2.png",
    "empty_inventory.png",
    "empty_mailbox.png",
    "no_FD.png",
    "no_bank_account.png",
    "no_stocks.png",
    "no_transactions.png",
  ],
  notifications: [
    "Central_Announcement.png",
    "FD_Maturity.png",
    "Market_Alert.png",
    "Reward_Unlocked.png",
    "Security_Alert.png",
    "Transfer_Received.png",
  ],
  og: [
    "fd_certificate.png",
    "receipt.png",
    "statement.png",
    "statement_confirmation.png",
    "tax_document.png",
    "trade_confirmation.png",
  ],
  "shop/banners": [
    "normal_1.png",
    "normal_2.png",
    "normal_3.png",
    "normal_4.png",
    "normal_5.png",
    "normal_6.png",
    "normal_7.png",
    "rare_1.png",
    "rare_2.png",
    "rare_3.png",
    "epic_1.png",
    "epic_2.png",
    "gold_1.png",
    "gold_2.png",
  ],
  "shop/frames": [
    "Aurora.png",
    "Nova.png",
    "gold.png",
    "leaf.png",
    "orbit.png",
    "pluse.png",
    "vertex.png",
  ],
};

// Stock listings: exactly 10, logo + banner pair per company
const STOCKS = [
  "anvik_industries",
  "arka_energy",
  "aroha_foods",
  "jala_water",
  "kshiti_infra",
  "meru_capital",
  "nila_systems",
  "prava_retail",
  "tarang_mobility",
  "veda_health",
];

const PETS = [
  "Archive Cat",
  "Flow Otter",
  "Ledger Owl",
  "Market Bull",
  "Saver Fox",
  "Settlement Crane",
  "Tax Tortoise",
  "Wealth Elephant",
];

const PERSONAS_FEMALE = [
  "Analyst",
  "Builder",
  "BussinesWomen",
  "Creator",
  "Entrepreneur",
  "Investor",
  "Retired Investor",
  "Student",
];

const PERSONAS_MALE = [
  "Analyst",
  "Builder",
  "Bussinessman",
  "Creator",
  "Entrepreneur",
  "Investor",
  "Retired Investor",
  "Student",
];

let missing = 0;

function check(label, path) {
  if (!existsSync(path)) {
    console.error(`MISSING  [${label}] ${path}`);
    missing++;
  }
}

for (const [dir, files] of Object.entries(DIRS)) {
  for (const f of files) check(dir || "root", join(ROOT, dir, f));
}

for (const s of STOCKS) {
  check("stock/logo", join(ROOT, "stocks", "logo", `${s}.png`));
  check("stock/banner", join(ROOT, "stocks", "banner", `${s}.png`));
}
check("stocks/loss_signal", join(ROOT, "stocks", "stock_loss_signal.png"));

for (const pet of PETS) {
  for (const f of ["icon.png", "main_image.png", "thumbnail.png"]) {
    check(`pet/${pet}`, join(ROOT, "shop", "pets", pet, f));
  }
}

for (const p of PERSONAS_FEMALE)
  check("avatar/female", join(ROOT, "shop", "avatars", "Female", `${p}.png`));
for (const p of PERSONAS_MALE)
  check("avatar/male", join(ROOT, "shop", "avatars", "Male", `${p}.png`));

check(
  "font/Fraunces",
  join(ROOT, "fonts", "Fraunces", "Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
);
check("font/Amarante", join(ROOT, "fonts", "Amarante", "Amarante-Regular.ttf"));
check("font/Cantarell", join(ROOT, "fonts", "Cantarell", "Cantarell-Regular.ttf"));

if (missing > 0) {
  console.error(`\nFAIL: ${missing} required asset(s) missing.`);
  process.exit(1);
}
console.log(
  `OK: all ${STOCKS.length} stocks, ${PETS.length} pets, ${PERSONAS_FEMALE.length * 2} avatars, and all shared assets verified.`,
);
