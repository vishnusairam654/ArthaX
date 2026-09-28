import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../client';
import * as argon2 from 'argon2';

// 1. Manually parse .env if not loaded
const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://qbhwplseiiqprbvcdgkr.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is required in .env');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ ARTHAX Sovereign Database Purge & Supabase Sync Initializing...');
  console.log(`🔗 Target Supabase Endpoint: ${supabaseUrl}`);

  // 1. Fetch real users from Supabase Auth
  console.log('📡 Fetching registered users from Supabase Auth (auth.users)...');
  const res = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=100`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ Failed to fetch users from Supabase Auth: ${errText}`);
    process.exit(1);
  }

  const data = await res.json();
  const supabaseUsers: any[] = data?.users || [];
  const supabaseEmails = new Set(
    supabaseUsers.map((u) => u.email?.toLowerCase()).filter(Boolean),
  );

  console.log(`✅ Found ${supabaseUsers.length} active citizen(s) in Supabase Auth:`);
  for (const u of supabaseUsers) {
    console.log(`   • ${u.email} (ID: ${u.id})`);
  }

  // 2. Query all local users to purge
  console.log('\n🧹 Identifying legacy/mock users to purge from PostgreSQL...');
  const usersToDelete = await prisma.user.findMany({
    where: {
      OR: [
        { govIdRel: { email: 'citizen@arthax.gov' } },
        { role: 'USER', govIdRel: { email: { notIn: Array.from(supabaseEmails) } } },
      ],
    },
    include: {
      govIdRel: true,
      bankAccounts: true,
    },
  });

  const userIds = usersToDelete.map((u) => u.id);
  const govIds = usersToDelete.map((u) => u.govId);
  const emails = usersToDelete.map((u) => u.govIdRel.email);
  const accountIds = usersToDelete.flatMap((u) => u.bankAccounts.map((a) => a.id));

  console.log(`⚠️  Purging ${userIds.length} non-Supabase local user(s)...`);
  for (const u of usersToDelete) {
    console.log(`   - Removing: ${u.govIdRel.email} (${u.govIdRel.govIdNumber} / ${u.displayName})`);
  }

  if (userIds.length > 0) {
    // 1. Identify all transactions involving these users or accounts
    const userTxs = await prisma.transaction.findMany({
      where: {
        OR: [
          { initiatedBy: { in: userIds } },
          { sourceAccountId: { in: accountIds } },
          { destinationAccountId: { in: accountIds } },
        ],
      },
      select: { id: true },
    });
    const txIds = userTxs.map((t) => t.id);

    // 2. Identify all stock orders involving these users or accounts
    const userOrders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: { in: userIds } },
          { sourceAccountId: { in: accountIds } },
        ],
      },
      select: { id: true },
    });
    const orderIds = userOrders.map((o) => o.id);

    // 3. Delete transaction dependent child records
    await prisma.interestPayoutLog.deleteMany({
      where: {
        OR: [
          { userId: { in: userIds } },
          { transactionId: { in: txIds } },
        ],
      },
    });

    await prisma.rewardTransaction.deleteMany({
      where: {
        OR: [
          { userId: { in: userIds } },
          { transactionId: { in: txIds } },
        ],
      },
    });

    if (txIds.length > 0) {
      await prisma.monetaryEvent.deleteMany({
        where: { transactionId: { in: txIds } },
      });
    }

    await prisma.transactionEntry.deleteMany({
      where: {
        OR: [
          { transactionId: { in: txIds } },
          { ledgerAccount: { bankAccountId: { in: accountIds } } },
        ],
      },
    });

    if (txIds.length > 0) {
      await prisma.transaction.deleteMany({
        where: { id: { in: txIds } },
      });
    }

    // 4. Delete trades & orders
    await prisma.trade.deleteMany({
      where: {
        OR: [
          { buyerUserId: { in: userIds } },
          { sellerUserId: { in: userIds } },
          { buyOrderId: { in: orderIds } },
          { sellOrderId: { in: orderIds } },
        ],
      },
    });

    await prisma.order.deleteMany({
      where: {
        OR: [
          { userId: { in: userIds } },
          { sourceAccountId: { in: accountIds } },
        ],
      },
    });

    // 5. Delete banking products & records
    await prisma.beneficiary.deleteMany({
      where: { accountId: { in: accountIds } },
    });

    await prisma.userFd.deleteMany({
      where: {
        OR: [
          { userId: { in: userIds } },
          { accountId: { in: accountIds } },
        ],
      },
    });

    await prisma.loan.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.portfolioHolding.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.taxEvent.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.mailboxMessage.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.userInventory.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.userLoadout.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.session.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.mfaToken.deleteMany({ where: { email: { in: emails } } });

    // 6. Delete Ledger & Bank Accounts
    await prisma.ledgerAccount.deleteMany({ where: { bankAccountId: { in: accountIds } } });
    await prisma.bankAccount.deleteMany({ where: { id: { in: accountIds } } });
    await prisma.bankCustomer.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.govId.deleteMany({ where: { id: { in: govIds } } });
    console.log('✨ Local non-Supabase user records purged successfully.');
  }

  // Delete orphaned GovId records not in Supabase Auth (preserving admins)
  const orphanedGovIds = await prisma.govId.findMany({
    where: {
      email: {
        notIn: [
          ...Array.from(supabaseEmails),
          'governor.vance@arthax.gov',
          'auditor.kaur@arthax.gov',
          'admin.nava@arthax.gov',
          'admin.samaya@arthax.gov',
          'admin.setu@arthax.gov',
          'admin.sthira@arthax.gov',
          'admin.vayu@arthax.gov',
        ],
      },
      user: null,
    },
  });

  if (orphanedGovIds.length > 0) {
    console.log(`⚠️  Removing ${orphanedGovIds.length} orphaned GovId record(s)...`);
    await prisma.govId.deleteMany({
      where: { id: { in: orphanedGovIds.map((g) => g.id) } },
    });
  }

  // 3. Auto-provision any user present in Supabase Auth that is missing in PostgreSQL
  console.log('\n🏛️  Ensuring all Supabase Auth citizens are provisioned in ARTHAX with 5,000 ARTH...');
  for (const sUser of supabaseUsers) {
    if (!sUser.email) continue;

    let govRecord = await prisma.govId.findUnique({
      where: { email: sUser.email },
      include: { user: true },
    });

    if (!govRecord || !govRecord.user) {
      console.log(`📦 Provisioning Supabase citizen: ${sUser.email}...`);

      const meta = sUser.user_metadata || {};
      const displayName = meta.displayName || sUser.email.split('@')[0];
      const profession = meta.profession || 'Sovereign Citizen';
      const govIdNumber =
        meta.govIdNumber ||
        `GOV-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const defaultGovPasswordHash = await argon2.hash('GovSovereign@2026!', {
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      const defaultFinPasswordHash = await argon2.hash('FinSecret#2026', {
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      if (!govRecord) {
        govRecord = await prisma.govId.create({
          data: {
            govIdNumber,
            email: sUser.email,
            passwordHash: defaultGovPasswordHash,
            emailVerified: true,
            status: 'ACTIVE',
          },
          include: { user: true },
        });
      }

      // Create User
      const user = await prisma.user.create({
        data: {
          govId: govRecord.id,
          displayName,
          role: 'USER',
          financialPasswordHash: defaultFinPasswordHash,
          status: 'ACTIVE',
        },
      });

      // Default Bank: NAVA or preferred
      const preferredBank = (meta.preferredBankId || 'nava').toLowerCase();
      const bankId = ['nava', 'samaya', 'setu', 'sthira', 'vayu'].includes(preferredBank)
        ? preferredBank
        : 'nava';

      // Bank Customer
      const customer = await prisma.bankCustomer.create({
        data: {
          userId: user.id,
          bankId,
          status: 'ACTIVE',
          tier: 'Tier-1 Sovereign Citizen',
          customerNumber: `CUST-${bankId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });

      // Bank Account
      const acctNumber = `ARTH-${bankId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const bankAccount = await prisma.bankAccount.create({
        data: {
          accountNumber: acctNumber,
          customerId: customer.id,
          bankId,
          userId: user.id,
          type: 'SAVINGS',
          purpose: meta.primaryPurpose || 'Sovereign Treasury Float',
          status: 'ACTIVE',
        },
      });

      // Ledger Account with 5,000.00 ARTH = 500,000 minor units
      const bonusMinor = 500000n;
      await prisma.ledgerAccount.create({
        data: {
          accountType: 'BANK_ACCOUNT',
          ownerEntityId: bankAccount.id,
          ownerEntityType: 'BANK_ACCOUNT',
          balanceSnapshot: bonusMinor,
          bankAccountId: bankAccount.id,
        },
      });

      // Decrement from central treasury
      const treasury = await prisma.ledgerAccount.findFirst({
        where: { ownerEntityId: 'sys_central_treasury' },
      });
      if (treasury) {
        await prisma.ledgerAccount.update({
          where: { id: treasury.id },
          data: { balanceSnapshot: { decrement: bonusMinor } },
        });
      }

      console.log(`   🎉 Citizen provisioned: ${displayName} (#${acctNumber}) with 5,000.00 ARTH.`);
    } else {
      console.log(`   ✓ Citizen already synchronized: ${sUser.email}`);
    }
  }

  console.log('\n🌟 Complete! The local database now strictly mirrors Supabase Auth.');
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during purge & sync:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
