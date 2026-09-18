-- CreateEnum
CREATE TYPE "GovIdStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'LOCKED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'BANK_ADMIN', 'CENTRAL_BANK_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'LOCKED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MfaPurpose" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET', 'STEP_UP');

-- CreateEnum
CREATE TYPE "LedgerAccountType" AS ENUM ('BANK_ACCOUNT', 'BANK_RESERVE', 'CENTRAL_TREASURY', 'TAX_AUTHORITY', 'FEE_POOL', 'STOCK_EXCHANGE', 'SHOP_REVENUE', 'REWARD_POOL', 'LOAN_POOL', 'FD_POOL', 'CLS_CLEARING');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'INTEREST', 'FEE', 'TAX', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'FD_BOOKING', 'FD_MATURITY', 'STOCK_BUY', 'STOCK_SELL', 'SHOP_PURCHASE', 'REWARD', 'REVERSAL', 'MINT', 'BURN');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'VALIDATING', 'AUTHORIZED', 'PROCESSING', 'SETTLING', 'FINALIZING', 'COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionEntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "TransactionScope" AS ENUM ('INTERNAL', 'INTER_BANK');

-- CreateEnum
CREATE TYPE "SettlementStage" AS ENUM ('VALIDATING', 'AUTHORIZED', 'PROCESSING', 'SETTLING', 'FINALIZING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "BankAccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'FROZEN', 'CLOSED', 'DORMANT');

-- CreateEnum
CREATE TYPE "FdStatus" AS ENUM ('ACTIVE', 'MATURED', 'BROKEN', 'PENDING');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REPAID', 'DEFAULTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('LIMIT', 'MARKET', 'STOP');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('OPEN', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('SETTLING', 'SETTLED', 'FAILED');

-- CreateEnum
CREATE TYPE "ShopCategory" AS ENUM ('all', 'pets', 'avatars', 'frames', 'banners', 'inventory');

-- CreateEnum
CREATE TYPE "RarityTier" AS ENUM ('normal', 'rare', 'epic', 'gold');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'NOTICE', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('TRANSFER', 'SETTLEMENT', 'STOCK', 'SHOP', 'FD', 'LOAN', 'REWARD', 'SYSTEM', 'SECURITY', 'POLICY');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "GovId" (
    "id" TEXT NOT NULL,
    "govIdNumber" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "GovIdStatus" NOT NULL DEFAULT 'ACTIVE',
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "govId" TEXT NOT NULL,
    "financialPasswordHash" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" VARCHAR(255) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MfaToken" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "codeHash" VARCHAR(255) NOT NULL,
    "purpose" "MfaPurpose" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MfaToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shortName" VARCHAR(20) NOT NULL,
    "tagline" VARCHAR(255) NOT NULL,
    "logoPath" VARCHAR(255) NOT NULL,
    "licenseNumber" VARCHAR(50) NOT NULL,
    "establishedDate" DATE NOT NULL,
    "accentColor" VARCHAR(7) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "ownership" TEXT NOT NULL,
    "governingDirector" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CentralBankConfig" (
    "id" TEXT NOT NULL,
    "institutionName" VARCHAR(150) NOT NULL,
    "charterId" VARCHAR(50) NOT NULL,
    "sovereignSeat" VARCHAR(150) NOT NULL,
    "currentGovernor" VARCHAR(100) NOT NULL,
    "deputyGovernor" VARCHAR(100) NOT NULL,
    "auditQuorumCount" INTEGER NOT NULL DEFAULT 5,
    "sessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 15,
    "dualPasswordEnforced" BOOLEAN NOT NULL DEFAULT true,
    "ipWhitelistEnforced" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CentralBankConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "customerNumber" VARCHAR(30) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "tier" VARCHAR(30) NOT NULL DEFAULT 'Tier-1 Citizen',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "accountNumber" VARCHAR(30) NOT NULL,
    "customerId" TEXT NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL DEFAULT 'SAVINGS',
    "purpose" VARCHAR(100) NOT NULL,
    "status" "BankAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "dailyLimitMinor" BIGINT NOT NULL DEFAULT 5000000,
    "monthlyLimitMinor" BIGINT NOT NULL DEFAULT 50000000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "accountType" "LedgerAccountType" NOT NULL,
    "ownerEntityId" VARCHAR(64) NOT NULL,
    "ownerEntityType" VARCHAR(50) NOT NULL,
    "balanceSnapshot" BIGINT NOT NULL DEFAULT 0,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bankAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "ledgerAccountId" TEXT NOT NULL,
    "entryType" "TransactionEntryType" NOT NULL,
    "amountMinor" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "referenceNumber" VARCHAR(40) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "scope" "TransactionScope" NOT NULL DEFAULT 'INTERNAL',
    "amountMinor" BIGINT NOT NULL,
    "feesMinor" BIGINT NOT NULL DEFAULT 0,
    "taxMinor" BIGINT NOT NULL DEFAULT 0,
    "initiatedBy" TEXT,
    "sourceAccountId" TEXT,
    "destinationAccountId" TEXT,
    "settlementId" TEXT,
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "reference" VARCHAR(40) NOT NULL,
    "sourceBankId" VARCHAR(20) NOT NULL,
    "destinationBankId" VARCHAR(20) NOT NULL,
    "amountMinor" BIGINT NOT NULL,
    "feeLevyMinor" BIGINT NOT NULL DEFAULT 0,
    "stage" "SettlementStage" NOT NULL DEFAULT 'VALIDATING',
    "clearingLatencyMs" INTEGER,
    "failureReason" TEXT,
    "reversalTransactionId" VARCHAR(64),
    "timeline" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "beneficiaryName" VARCHAR(100) NOT NULL,
    "accountNumber" VARCHAR(30) NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "nickname" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FdScheme" (
    "id" VARCHAR(30) NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tenureDays" INTEGER NOT NULL,
    "baseApy" DOUBLE PRECISION NOT NULL,
    "seniorApy" DOUBLE PRECISION NOT NULL,
    "minimumDepositMinor" BIGINT NOT NULL,
    "maximumDepositMinor" BIGINT NOT NULL,
    "lockInDays" INTEGER NOT NULL,
    "preclosurePenaltyRate" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FdScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFd" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "schemeId" VARCHAR(30) NOT NULL,
    "certificateNumber" VARCHAR(40) NOT NULL,
    "principalMinor" BIGINT NOT NULL,
    "maturityAmountMinor" BIGINT NOT NULL,
    "apy" DOUBLE PRECISION NOT NULL,
    "status" "FdStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "interestPayoutFreq" VARCHAR(20) NOT NULL DEFAULT 'AT_MATURITY',
    "accruedInterestMinor" BIGINT NOT NULL DEFAULT 0,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "rolloverInstruction" VARCHAR(30) NOT NULL DEFAULT 'NONE',
    "closedAt" TIMESTAMP(3),
    "payoutAmountMinor" BIGINT,
    "payoutTxId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestPayoutLog" (
    "id" TEXT NOT NULL,
    "userFdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "grossAmountMinor" BIGINT NOT NULL,
    "taxWithheldMinor" BIGINT NOT NULL DEFAULT 0,
    "netAmountMinor" BIGINT NOT NULL,
    "payoutDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payoutType" VARCHAR(20) NOT NULL,

    CONSTRAINT "InterestPayoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "loanType" VARCHAR(30) NOT NULL,
    "principalMinor" BIGINT NOT NULL,
    "interestRateApy" DOUBLE PRECISION NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "monthlyEmiMinor" BIGINT NOT NULL,
    "outstandingBalanceMinor" BIGINT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disbursedDate" TIMESTAMP(3),
    "purpose" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankProduct" (
    "id" VARCHAR(40) NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "minBalanceMinor" BIGINT NOT NULL DEFAULT 0,
    "features" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationQueue" (
    "id" TEXT NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "referenceId" VARCHAR(64) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "assignedStaffId" VARCHAR(64),
    "status" VARCHAR(20) NOT NULL DEFAULT 'QUEUED',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCompany" (
    "symbol" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sector" VARCHAR(50) NOT NULL,
    "currentPriceMinor" BIGINT NOT NULL,
    "openingPriceMinor" BIGINT NOT NULL,
    "dayHighMinor" BIGINT NOT NULL,
    "dayLowMinor" BIGINT NOT NULL,
    "previousCloseMinor" BIGINT NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "volume" INTEGER NOT NULL DEFAULT 0,
    "marketCapMinor" BIGINT NOT NULL,
    "peRatio" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "circuitLimitLowMinor" BIGINT NOT NULL,
    "circuitLimitHighMinor" BIGINT NOT NULL,
    "circuitBreakerActive" BOOLEAN NOT NULL DEFAULT false,
    "sharesOutstanding" INTEGER NOT NULL,
    "freeFloatPercent" DOUBLE PRECISION NOT NULL,
    "dividendYield" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "description" TEXT NOT NULL,
    "listedDate" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockCompany_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "StockTicker" (
    "id" TEXT NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "priceMinor" BIGINT NOT NULL,
    "volume" INTEGER NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockTicker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "side" "OrderSide" NOT NULL,
    "type" "OrderType" NOT NULL DEFAULT 'LIMIT',
    "quantity" INTEGER NOT NULL,
    "filledQuantity" INTEGER NOT NULL DEFAULT 0,
    "priceMinor" BIGINT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'OPEN',
    "sourceAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "buyOrderId" TEXT NOT NULL,
    "sellOrderId" TEXT NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "priceMinor" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "buyerUserId" TEXT NOT NULL,
    "sellerUserId" TEXT NOT NULL,
    "buyerFeeMinor" BIGINT NOT NULL DEFAULT 0,
    "sellerFeeMinor" BIGINT NOT NULL DEFAULT 0,
    "taxLevyMinor" BIGINT NOT NULL DEFAULT 0,
    "settlementStage" "TradeStatus" NOT NULL DEFAULT 'SETTLED',
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "shares" INTEGER NOT NULL,
    "averageBuyPriceMinor" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "sharesSold" INTEGER NOT NULL,
    "sellPriceMinor" BIGINT NOT NULL,
    "buyPriceMinor" BIGINT NOT NULL,
    "realizedProfitMinor" BIGINT NOT NULL,
    "taxRatePercent" DOUBLE PRECISION NOT NULL,
    "taxAmountMinor" BIGINT NOT NULL,
    "offsetAppliedMinor" BIGINT NOT NULL DEFAULT 0,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicBasket" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tagline" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "riskTier" VARCHAR(30) NOT NULL,
    "rebalanceSchedule" VARCHAR(50) NOT NULL,
    "basketComposition" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThematicBasket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "ShopCategory" NOT NULL,
    "rarity" "RarityTier" NOT NULL,
    "priceMinor" BIGINT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "secondaryImage" VARCHAR(255),
    "rank" VARCHAR(30),
    "role" VARCHAR(100),
    "gender" VARCHAR(10),
    "powerTitle" VARCHAR(150),
    "powerDescription" TEXT,
    "attireSpec" TEXT,
    "accreditation" TEXT,
    "covenantSection" VARCHAR(100),
    "perks" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "ownershipType" VARCHAR(30) NOT NULL DEFAULT 'UNIQUE_PER_USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" VARCHAR(50) NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLoadout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "frameId" VARCHAR(50),
    "avatarId" VARCHAR(50),
    "bannerId" VARCHAR(50),
    "petId" VARCHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLoadout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardTask" (
    "id" VARCHAR(40) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "rewardMinor" BIGINT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardAchievement" (
    "id" VARCHAR(40) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "badgeName" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(255) NOT NULL,
    "criteria" TEXT NOT NULL,
    "rewardMinor" BIGINT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" VARCHAR(40),
    "achievementId" VARCHAR(40),
    "amountMinor" BIGINT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "title" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "templateCode" VARCHAR(100) NOT NULL,
    "templateVersion" INTEGER NOT NULL DEFAULT 1,
    "sourceDomain" VARCHAR(50) NOT NULL,
    "sourceType" VARCHAR(50) NOT NULL,
    "sourceId" VARCHAR(100) NOT NULL,
    "eventId" VARCHAR(100) NOT NULL,
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" VARCHAR(40) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "audience" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Published',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorCouncil" VARCHAR(100) NOT NULL,
    "summary" TEXT NOT NULL,
    "fullBody" TEXT NOT NULL,
    "reachesCitizenMailbox" BOOLEAN NOT NULL DEFAULT false,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'Normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailboxMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "announcementId" VARCHAR(40),
    "title" VARCHAR(200) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "sender" VARCHAR(100) NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'Normal',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MailboxMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialRule" (
    "id" VARCHAR(40) NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "unit" VARCHAR(30) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" VARCHAR(100) NOT NULL,
    "effectiveDate" DATE NOT NULL,
    "statutoryBasis" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRule" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "ratePercent" DOUBLE PRECISION NOT NULL,
    "thresholdMinor" BIGINT NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "effectiveFrom" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonetaryEvent" (
    "id" TEXT NOT NULL,
    "eventType" VARCHAR(30) NOT NULL,
    "amountMinor" BIGINT NOT NULL,
    "authorizedBy" VARCHAR(100) NOT NULL,
    "reason" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonetaryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "eventType" VARCHAR(50) NOT NULL,
    "actorId" VARCHAR(100) NOT NULL,
    "actorRole" VARCHAR(50) NOT NULL,
    "targetEntity" VARCHAR(100) NOT NULL,
    "action" TEXT NOT NULL,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "ipAddress" VARCHAR(45),
    "sessionHash" VARCHAR(64),
    "beforeState" JSONB,
    "afterState" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "eventType" VARCHAR(50) NOT NULL,
    "targetEntity" VARCHAR(100) NOT NULL,
    "severity" VARCHAR(20) NOT NULL DEFAULT 'WARNING',
    "ipAddress" VARCHAR(45),
    "actionTaken" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanProduct" (
    "id" VARCHAR(50) NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "baseInterestRate" DOUBLE PRECISION NOT NULL,
    "minPrincipalMinor" BIGINT NOT NULL,
    "maxPrincipalMinor" BIGINT NOT NULL,
    "minTenureMonths" INTEGER NOT NULL,
    "maxTenureMonths" INTEGER NOT NULL,
    "processingFeePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "collateralRequired" BOOLEAN NOT NULL DEFAULT false,
    "minCollateralRatioPercent" DOUBLE PRECISION,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLoan" (
    "id" TEXT NOT NULL,
    "contractNumber" VARCHAR(50) NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" VARCHAR(20) NOT NULL,
    "productId" VARCHAR(50) NOT NULL,
    "disbursementAccountId" TEXT NOT NULL,
    "repaymentAccountId" TEXT NOT NULL,
    "loanType" VARCHAR(30) NOT NULL,
    "status" VARCHAR(25) NOT NULL DEFAULT 'SUBMITTED',
    "principalMinor" BIGINT NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "monthlyEmiMinor" BIGINT NOT NULL,
    "outstandingPrincipalMinor" BIGINT NOT NULL,
    "totalRepaidPrincipalMinor" BIGINT NOT NULL DEFAULT 0,
    "totalRepaidInterestMinor" BIGINT NOT NULL DEFAULT 0,
    "purpose" VARCHAR(255),
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "disbursedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "approvedByStaffId" VARCHAR(100),
    "notes" TEXT,
    "idempotencyKey" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanInstallment" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "principalMinor" BIGINT NOT NULL,
    "interestMinor" BIGINT NOT NULL,
    "totalAmountMinor" BIGINT NOT NULL,
    "remainingPrincipalMinor" BIGINT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanCollateral" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "collateralType" VARCHAR(30) NOT NULL,
    "assetReferenceId" VARCHAR(100) NOT NULL,
    "appraisedValueMinor" BIGINT NOT NULL,
    "lienStatus" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanCollateral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GovId_govIdNumber_key" ON "GovId"("govIdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GovId_email_key" ON "GovId"("email");

-- CreateIndex
CREATE INDEX "GovId_email_idx" ON "GovId"("email");

-- CreateIndex
CREATE INDEX "GovId_govIdNumber_idx" ON "GovId"("govIdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_govId_key" ON "User"("govId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_tokenHash_idx" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "MfaToken_email_purpose_idx" ON "MfaToken"("email", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_licenseNumber_key" ON "Bank"("licenseNumber");

-- CreateIndex
CREATE INDEX "Bank_status_idx" ON "Bank"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CentralBankConfig_charterId_key" ON "CentralBankConfig"("charterId");

-- CreateIndex
CREATE INDEX "BankCustomer_customerNumber_idx" ON "BankCustomer"("customerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankCustomer_userId_bankId_key" ON "BankCustomer"("userId", "bankId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");

-- CreateIndex
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");

-- CreateIndex
CREATE INDEX "BankAccount_bankId_idx" ON "BankAccount"("bankId");

-- CreateIndex
CREATE INDEX "BankAccount_accountNumber_idx" ON "BankAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_bankAccountId_key" ON "LedgerAccount"("bankAccountId");

-- CreateIndex
CREATE INDEX "LedgerAccount_accountType_idx" ON "LedgerAccount"("accountType");

-- CreateIndex
CREATE INDEX "LedgerAccount_ownerEntityId_ownerEntityType_idx" ON "LedgerAccount"("ownerEntityId", "ownerEntityType");

-- CreateIndex
CREATE INDEX "TransactionEntry_transactionId_idx" ON "TransactionEntry"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionEntry_ledgerAccountId_idx" ON "TransactionEntry"("ledgerAccountId");

-- CreateIndex
CREATE INDEX "TransactionEntry_createdAt_idx" ON "TransactionEntry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_referenceNumber_key" ON "Transaction"("referenceNumber");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_referenceNumber_idx" ON "Transaction"("referenceNumber");

-- CreateIndex
CREATE INDEX "Transaction_initiatedBy_idx" ON "Transaction"("initiatedBy");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_reference_key" ON "Settlement"("reference");

-- CreateIndex
CREATE INDEX "Settlement_stage_idx" ON "Settlement"("stage");

-- CreateIndex
CREATE INDEX "Settlement_sourceBankId_destinationBankId_idx" ON "Settlement"("sourceBankId", "destinationBankId");

-- CreateIndex
CREATE INDEX "Beneficiary_accountId_idx" ON "Beneficiary"("accountId");

-- CreateIndex
CREATE INDEX "FdScheme_bankId_active_idx" ON "FdScheme"("bankId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "UserFd_certificateNumber_key" ON "UserFd"("certificateNumber");

-- CreateIndex
CREATE INDEX "UserFd_userId_idx" ON "UserFd"("userId");

-- CreateIndex
CREATE INDEX "UserFd_status_idx" ON "UserFd"("status");

-- CreateIndex
CREATE INDEX "UserFd_bankId_status_idx" ON "UserFd"("bankId", "status");

-- CreateIndex
CREATE INDEX "InterestPayoutLog_userFdId_idx" ON "InterestPayoutLog"("userFdId");

-- CreateIndex
CREATE INDEX "InterestPayoutLog_userId_idx" ON "InterestPayoutLog"("userId");

-- CreateIndex
CREATE INDEX "Loan_userId_idx" ON "Loan"("userId");

-- CreateIndex
CREATE INDEX "Loan_status_idx" ON "Loan"("status");

-- CreateIndex
CREATE INDEX "BankProduct_bankId_active_idx" ON "BankProduct"("bankId", "active");

-- CreateIndex
CREATE INDEX "OperationQueue_bankId_status_idx" ON "OperationQueue"("bankId", "status");

-- CreateIndex
CREATE INDEX "StockCompany_status_idx" ON "StockCompany"("status");

-- CreateIndex
CREATE INDEX "StockTicker_symbol_timestamp_idx" ON "StockTicker"("symbol", "timestamp");

-- CreateIndex
CREATE INDEX "Order_symbol_status_idx" ON "Order"("symbol", "status");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Trade_symbol_executedAt_idx" ON "Trade"("symbol", "executedAt");

-- CreateIndex
CREATE INDEX "Trade_buyerUserId_idx" ON "Trade"("buyerUserId");

-- CreateIndex
CREATE INDEX "Trade_sellerUserId_idx" ON "Trade"("sellerUserId");

-- CreateIndex
CREATE INDEX "PortfolioHolding_userId_idx" ON "PortfolioHolding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioHolding_userId_symbol_key" ON "PortfolioHolding"("userId", "symbol");

-- CreateIndex
CREATE INDEX "TaxEvent_userId_executedAt_idx" ON "TaxEvent"("userId", "executedAt");

-- CreateIndex
CREATE INDEX "ShopItem_category_rarity_idx" ON "ShopItem"("category", "rarity");

-- CreateIndex
CREATE INDEX "UserInventory_userId_idx" ON "UserInventory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInventory_userId_itemId_key" ON "UserInventory"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLoadout_userId_key" ON "UserLoadout"("userId");

-- CreateIndex
CREATE INDEX "RewardTransaction_userId_idx" ON "RewardTransaction"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_isArchived_createdAt_idx" ON "Notification"("userId", "isRead", "isArchived", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_category_idx" ON "Notification"("userId", "category");

-- CreateIndex
CREATE INDEX "Notification_sourceDomain_sourceId_idx" ON "Notification"("sourceDomain", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_eventId_key" ON "Notification"("userId", "eventId");

-- CreateIndex
CREATE INDEX "Announcement_status_publishedAt_idx" ON "Announcement"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "MailboxMessage_userId_read_idx" ON "MailboxMessage"("userId", "read");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialRule_key_key" ON "FinancialRule"("key");

-- CreateIndex
CREATE INDEX "FinancialRule_category_idx" ON "FinancialRule"("category");

-- CreateIndex
CREATE UNIQUE INDEX "TaxRule_code_key" ON "TaxRule"("code");

-- CreateIndex
CREATE INDEX "TaxRule_category_idx" ON "TaxRule"("category");

-- CreateIndex
CREATE INDEX "MonetaryEvent_eventType_createdAt_idx" ON "MonetaryEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "SystemLog_eventType_timestamp_idx" ON "SystemLog"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "SystemLog_actorId_idx" ON "SystemLog"("actorId");

-- CreateIndex
CREATE INDEX "SystemLog_severity_idx" ON "SystemLog"("severity");

-- CreateIndex
CREATE INDEX "SecurityEvent_eventType_timestamp_idx" ON "SecurityEvent"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "LoanProduct_bankId_status_idx" ON "LoanProduct"("bankId", "status");

-- CreateIndex
CREATE INDEX "LoanProduct_category_idx" ON "LoanProduct"("category");

-- CreateIndex
CREATE UNIQUE INDEX "UserLoan_contractNumber_key" ON "UserLoan"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserLoan_idempotencyKey_key" ON "UserLoan"("idempotencyKey");

-- CreateIndex
CREATE INDEX "UserLoan_userId_status_idx" ON "UserLoan"("userId", "status");

-- CreateIndex
CREATE INDEX "UserLoan_bankId_status_idx" ON "UserLoan"("bankId", "status");

-- CreateIndex
CREATE INDEX "UserLoan_contractNumber_idx" ON "UserLoan"("contractNumber");

-- CreateIndex
CREATE INDEX "LoanInstallment_loanId_status_idx" ON "LoanInstallment"("loanId", "status");

-- CreateIndex
CREATE INDEX "LoanInstallment_dueDate_status_idx" ON "LoanInstallment"("dueDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LoanInstallment_loanId_installmentNumber_key" ON "LoanInstallment"("loanId", "installmentNumber");

-- CreateIndex
CREATE INDEX "LoanCollateral_loanId_lienStatus_idx" ON "LoanCollateral"("loanId", "lienStatus");

-- CreateIndex
CREATE INDEX "LoanCollateral_assetReferenceId_idx" ON "LoanCollateral"("assetReferenceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_govId_fkey" FOREIGN KEY ("govId") REFERENCES "GovId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankCustomer" ADD CONSTRAINT "BankCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankCustomer" ADD CONSTRAINT "BankCustomer_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "BankCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEntry" ADD CONSTRAINT "TransactionEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEntry" ADD CONSTRAINT "TransactionEntry_ledgerAccountId_fkey" FOREIGN KEY ("ledgerAccountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_initiatedBy_fkey" FOREIGN KEY ("initiatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_sourceBankId_fkey" FOREIGN KEY ("sourceBankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_destinationBankId_fkey" FOREIGN KEY ("destinationBankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FdScheme" ADD CONSTRAINT "FdScheme_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFd" ADD CONSTRAINT "UserFd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFd" ADD CONSTRAINT "UserFd_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFd" ADD CONSTRAINT "UserFd_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFd" ADD CONSTRAINT "UserFd_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "FdScheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestPayoutLog" ADD CONSTRAINT "InterestPayoutLog_userFdId_fkey" FOREIGN KEY ("userFdId") REFERENCES "UserFd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestPayoutLog" ADD CONSTRAINT "InterestPayoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankProduct" ADD CONSTRAINT "BankProduct_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationQueue" ADD CONSTRAINT "OperationQueue_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTicker" ADD CONSTRAINT "StockTicker_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockCompany"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockCompany"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_buyOrderId_fkey" FOREIGN KEY ("buyOrderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_sellOrderId_fkey" FOREIGN KEY ("sellOrderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockCompany"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_sellerUserId_fkey" FOREIGN KEY ("sellerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockCompany"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxEvent" ADD CONSTRAINT "TaxEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxEvent" ADD CONSTRAINT "TaxEvent_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockCompany"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ShopItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLoadout" ADD CONSTRAINT "UserLoadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "RewardTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "RewardAchievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailboxMessage" ADD CONSTRAINT "MailboxMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailboxMessage" ADD CONSTRAINT "MailboxMessage_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonetaryEvent" ADD CONSTRAINT "MonetaryEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLoan" ADD CONSTRAINT "UserLoan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "LoanProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanInstallment" ADD CONSTRAINT "LoanInstallment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "UserLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanCollateral" ADD CONSTRAINT "LoanCollateral_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "UserLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

