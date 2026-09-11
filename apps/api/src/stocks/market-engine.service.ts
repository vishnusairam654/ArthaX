import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  StockCompanyDto,
  OrderBookDepthDto,
  OrderBookLevelDto,
  SimulatedTickResultDto,
  MarketPriceModelInput,
} from '@arthax/types';

export interface CompanyState {
  symbol: string;
  name: string;
  sector: string;
  currentPriceMinor: bigint;
  openingPriceMinor: bigint;
  dayHighMinor: bigint;
  dayLowMinor: bigint;
  previousCloseMinor: bigint;
  changePercent: number;
  volume: number;
  marketCapMinor: bigint;
  peRatio: number;
  circuitLimitLowMinor: bigint;
  circuitLimitHighMinor: bigint;
  circuitBreakerActive: boolean;
  sharesOutstanding: number;
  freeFloatPercent: number;
  dividendYield: number;
  description: string;
  listedDate: string;
  status: 'ACTIVE' | 'HALTED' | 'DELISTED';
}

@Injectable()
export class MarketEngineService {
  private readonly logger = new Logger(MarketEngineService.name);

  // In-memory state for the 10 canonical companies
  private companies = new Map<string, CompanyState>();

  // Historical ticks per symbol
  private ticks = new Map<string, SimulatedTickResultDto[]>();

  constructor(private readonly prisma: PrismaService) {
    this.initializeCanonicalCompanies();
  }

  /**
   * Initializes the 10 sovereign companies with institutional specs in integer minor units.
   */
  private initializeCanonicalCompanies(): void {
    const rawCompanies: Array<Omit<CompanyState, 'circuitLimitLowMinor' | 'circuitLimitHighMinor' | 'circuitBreakerActive'>> = [
      {
        symbol: 'NILA',
        name: 'NILA Systems Ltd',
        sector: 'Space Mesh & Telemetry',
        currentPriceMinor: 14250n, // 142.50 ARTH
        openingPriceMinor: 14250n,
        dayHighMinor: 14500n,
        dayLowMinor: 14120n,
        previousCloseMinor: 14000n,
        changePercent: 1.79,
        volume: 950000,
        marketCapMinor: 2850000000n,
        peRatio: 21.0,
        sharesOutstanding: 20000000,
        freeFloatPercent: 48.0,
        dividendYield: 2.4,
        description: 'Sovereign orbital communications, laser mesh links, and satellite ground stations.',
        listedDate: '2024-01-10',
        status: 'ACTIVE',
      },
      {
        symbol: 'ARKA',
        name: 'Arka Clean Energy Grid',
        sector: 'Renewable Power & Energy Storage',
        currentPriceMinor: 21800n, // 218.00 ARTH
        openingPriceMinor: 21800n,
        dayHighMinor: 22150n,
        dayLowMinor: 21400n,
        previousCloseMinor: 21450n,
        changePercent: 1.63,
        volume: 1205000,
        marketCapMinor: 5450000000n,
        peRatio: 24.2,
        sharesOutstanding: 25000000,
        freeFloatPercent: 55.0,
        dividendYield: 1.8,
        description: 'Sovereign solar, hydro, and next-generation utility battery storage grids.',
        listedDate: '2024-01-20',
        status: 'ACTIVE',
      },
      {
        symbol: 'TRNG',
        name: 'Tarang Wave Communications',
        sector: 'Quantum Mesh Spectrum',
        currentPriceMinor: 8420n, // 84.20 ARTH
        openingPriceMinor: 8420n,
        dayHighMinor: 8600n,
        dayLowMinor: 8350n,
        previousCloseMinor: 8400n,
        changePercent: 0.24,
        volume: 640000,
        marketCapMinor: 1684000000n,
        peRatio: 14.5,
        sharesOutstanding: 20000000,
        freeFloatPercent: 60.0,
        dividendYield: 3.5,
        description: 'Quantum encrypted communications spectrum and sovereign routing backbones.',
        listedDate: '2024-02-01',
        status: 'ACTIVE',
      },
      {
        symbol: 'VEDA',
        name: 'Veda Biopharma Genomics',
        sector: 'Sovereign Therapeutics',
        currentPriceMinor: 31200n, // 312.00 ARTH
        openingPriceMinor: 31200n,
        dayHighMinor: 31800n,
        dayLowMinor: 30800n,
        previousCloseMinor: 31000n,
        changePercent: 0.65,
        volume: 480000,
        marketCapMinor: 6240000000n,
        peRatio: 28.5,
        sharesOutstanding: 20000000,
        freeFloatPercent: 38.0,
        dividendYield: 1.2,
        description: 'Indigenous biotechnology, mRNA platforms, and sovereign genomic libraries.',
        listedDate: '2024-02-10',
        status: 'ACTIVE',
      },
      {
        symbol: 'MERU',
        name: 'Meru Heavy Metallurgy',
        sector: 'Titanium & Rare Earths',
        currentPriceMinor: 49000n, // 490.00 ARTH
        openingPriceMinor: 49000n,
        dayHighMinor: 49800n,
        dayLowMinor: 48500n,
        previousCloseMinor: 48200n,
        changePercent: 1.66,
        volume: 320000,
        marketCapMinor: 9800000000n,
        peRatio: 16.8,
        sharesOutstanding: 20000000,
        freeFloatPercent: 35.0,
        dividendYield: 2.8,
        description: 'Deep-shaft titanium refining, rare earth processing, and sovereign metal reserves.',
        listedDate: '2024-01-15',
        status: 'ACTIVE',
      },
      {
        symbol: 'KSHT',
        name: 'Kshetra Agro Systems',
        sector: 'Precision Aeroponics',
        currentPriceMinor: 9200n, // 92.00 ARTH
        openingPriceMinor: 9200n,
        dayHighMinor: 9400n,
        dayLowMinor: 9050n,
        previousCloseMinor: 9100n,
        changePercent: 1.10,
        volume: 720000,
        marketCapMinor: 1840000000n,
        peRatio: 19.2,
        sharesOutstanding: 20000000,
        freeFloatPercent: 50.0,
        dividendYield: 3.1,
        description: 'Automated aeroponic towers, drought-resistant crops, and national food reserves.',
        listedDate: '2024-02-05',
        status: 'ACTIVE',
      },
      {
        symbol: 'AROHA',
        name: 'Aroha High Mobility',
        sector: 'Electric Maglev Transit',
        currentPriceMinor: 16400n, // 164.00 ARTH
        openingPriceMinor: 16400n,
        dayHighMinor: 16700n,
        dayLowMinor: 16200n,
        previousCloseMinor: 16150n,
        changePercent: 1.55,
        volume: 810000,
        marketCapMinor: 3280000000n,
        peRatio: 22.4,
        sharesOutstanding: 20000000,
        freeFloatPercent: 40.0,
        dividendYield: 1.5,
        description: 'Autonomous maglev corridors, high-speed rail pods, and transit power grids.',
        listedDate: '2024-02-12',
        status: 'ACTIVE',
      },
      {
        symbol: 'ANVIK',
        name: 'Anvik Industrial Forge',
        sector: 'Robotics & Heavy Industry',
        currentPriceMinor: 14250n, // 142.50 ARTH
        openingPriceMinor: 14250n,
        dayHighMinor: 14520n,
        dayLowMinor: 13980n,
        previousCloseMinor: 14000n,
        changePercent: 1.79,
        volume: 842000,
        marketCapMinor: 2850000000n,
        peRatio: 18.4,
        sharesOutstanding: 20000000,
        freeFloatPercent: 42.5,
        dividendYield: 2.1,
        description: 'Advanced sovereign manufacturing, heavy forge machinery, and precision robotic assemblies.',
        listedDate: '2024-02-15',
        status: 'ACTIVE',
      },
      {
        symbol: 'JALA',
        name: 'Jala HydroTech Utilities',
        sector: 'Desalination & Aquifers',
        currentPriceMinor: 12800n, // 128.00 ARTH
        openingPriceMinor: 12800n,
        dayHighMinor: 13000n,
        dayLowMinor: 12600n,
        previousCloseMinor: 12700n,
        changePercent: 0.79,
        volume: 530000,
        marketCapMinor: 2560000000n,
        peRatio: 17.5,
        sharesOutstanding: 20000000,
        freeFloatPercent: 45.0,
        dividendYield: 2.6,
        description: 'Autonomous coastal desalination facilities and national strategic aquifer replenishment.',
        listedDate: '2024-02-18',
        status: 'ACTIVE',
      },
      {
        symbol: 'PRAVA',
        name: 'Pravaha Logistics Grid',
        sector: 'Autonomous Freight Ports',
        currentPriceMinor: 29500n, // 295.00 ARTH
        openingPriceMinor: 29500n,
        dayHighMinor: 29900n,
        dayLowMinor: 29100n,
        previousCloseMinor: 29200n,
        changePercent: 1.03,
        volume: 610000,
        marketCapMinor: 5900000000n,
        peRatio: 20.8,
        sharesOutstanding: 20000000,
        freeFloatPercent: 46.0,
        dividendYield: 1.9,
        description: 'Automated container terminals, deep-water port automation, and cargo rail logistics.',
        listedDate: '2024-02-20',
        status: 'ACTIVE',
      },
    ];

    for (const c of rawCompanies) {
      // Statutory 10% daily circuit band: [open - 10%, open + 10%]
      const band = (c.openingPriceMinor * 10n) / 100n;
      const circuitLimitLowMinor = c.openingPriceMinor - band;
      const circuitLimitHighMinor = c.openingPriceMinor + band;

      this.companies.set(c.symbol, {
        ...c,
        circuitLimitLowMinor,
        circuitLimitHighMinor,
        circuitBreakerActive: false,
      });
    }

    this.logger.log(`Initialized ${this.companies.size} canonical sovereign companies with integer minor pricing`);
  }

  /**
   * Retrieves all 10 canonical sovereign stock companies.
   */
  async listCompanies(): Promise<StockCompanyDto[]> {
    return Array.from(this.companies.values()).map((c) => this.mapToDto(c));
  }

  /**
   * Retrieves a single sovereign company by ticker symbol.
   */
  async getCompany(symbol: string): Promise<StockCompanyDto> {
    const sym = symbol.toUpperCase();
    const company = this.companies.get(sym);
    if (!company) {
      throw new NotFoundException(`Stock company [${sym}] not found on sovereign exchange`);
    }
    return this.mapToDto(company);
  }

  /**
   * Returns internal CompanyState (with BigInts).
   */
  getCompanyState(symbol: string): CompanyState {
    const sym = symbol.toUpperCase();
    const company = this.companies.get(sym);
    if (!company) {
      throw new NotFoundException(`Stock company [${sym}] not found on sovereign exchange`);
    }
    return company;
  }

  /**
   * Validates whether an order's proposed limit price falls within the statutory daily circuit limits.
   * Throws BadRequestException if outside the band (Invariant 7: Strict Circuit Limit Enforcement).
   */
  validateOrderWithinCircuits(symbol: string, priceMinor: bigint): void {
    const company = this.getCompanyState(symbol);

    if (priceMinor < company.circuitLimitLowMinor) {
      throw new BadRequestException(
        `Order limit price [${priceMinor}] violates lower circuit limit [${company.circuitLimitLowMinor}] for ${symbol}`,
      );
    }
    if (priceMinor > company.circuitLimitHighMinor) {
      throw new BadRequestException(
        `Order limit price [${priceMinor}] violates upper circuit limit [${company.circuitLimitHighMinor}] for ${symbol}`,
      );
    }
  }

  /**
   * Calculates next stock price using the approved 5-factor model:
   * NextPrice = BasePrice + OrderBookPressure + Volatility + MarketSentiment + ControlledNoise
   * Clamps strictly to statutory circuit limits and tracks circuit breaker triggers.
   */
  calculateNextPrice(
    basePriceMinor: bigint,
    input: MarketPriceModelInput,
    circuitLowMinor: bigint,
    circuitHighMinor: bigint,
  ): { priceMinor: bigint; clamped: boolean; circuitBreaker: boolean } {
    const base = Number(basePriceMinor);

    // 1. Order book pressure component (-1.0 to 1.0) -> up to +/- 2%
    const orderBookFactor = (input.orderBookPressure ?? 0) * 0.02 * base;

    // 2. Company volatility component -> scaled by random sign
    const vol = input.companyVolatility ?? 0.01;
    const volatilityFactor = (Math.random() - 0.5) * 2 * vol * base;

    // 3. Market sentiment factor (-1.0 to 1.0) -> up to +/- 1.5%
    const sentimentFactor = (input.marketSentiment ?? 0) * 0.015 * base;

    // 4. Controlled noise factor -> up to +/- 0.5%
    const noise = input.controlledNoise ?? 0.5;
    const noiseFactor = noise * (Math.random() - 0.5) * 0.005 * base;

    const delta = Math.round(orderBookFactor + volatilityFactor + sentimentFactor + noiseFactor);
    let target = BigInt(Math.max(100, Math.round(base + delta))); // Floor at 1.00 ARTH (100 minor)

    let clamped = false;
    let circuitBreaker = false;

    if (target <= circuitLowMinor) {
      target = circuitLowMinor;
      clamped = true;
      circuitBreaker = true;
    } else if (target >= circuitHighMinor) {
      target = circuitHighMinor;
      clamped = true;
      circuitBreaker = true;
    }

    return { priceMinor: target, clamped, circuitBreaker };
  }

  /**
   * Simulates a single market tick for a listed stock, persists telemetry, and updates state.
   */
  async simulateTick(
    symbol: string,
    factors?: Partial<MarketPriceModelInput>,
  ): Promise<SimulatedTickResultDto> {
    const sym = symbol.toUpperCase();
    const company = this.getCompanyState(sym);
    const prevPrice = company.currentPriceMinor;

    const modelInput: MarketPriceModelInput = {
      symbol: sym,
      basePriceMinor: prevPrice,
      orderBookPressure: factors?.orderBookPressure ?? 0.1,
      companyVolatility: factors?.companyVolatility ?? 0.015,
      marketSentiment: factors?.marketSentiment ?? 0.05,
      controlledNoise: factors?.controlledNoise ?? 0.2,
    };

    const calculation = this.calculateNextPrice(
      prevPrice,
      modelInput,
      company.circuitLimitLowMinor,
      company.circuitLimitHighMinor,
    );

    const newPrice = calculation.priceMinor;
    company.currentPriceMinor = newPrice;
    company.circuitBreakerActive = calculation.circuitBreaker;

    if (newPrice > company.dayHighMinor) {
      company.dayHighMinor = newPrice;
    }
    if (newPrice < company.dayLowMinor) {
      company.dayLowMinor = newPrice;
    }

    // Volume increment
    const tickVolume = Math.floor(Math.random() * 500) + 50;
    company.volume += tickVolume;

    // Percentage change relative to opening price
    const changeDelta = Number(newPrice) - Number(company.openingPriceMinor);
    company.changePercent = Number(((changeDelta / Number(company.openingPriceMinor)) * 100).toFixed(2));

    const now = new Date();
    const tickResult: SimulatedTickResultDto = {
      symbol: sym,
      previousPriceMinor: prevPrice.toString(),
      newPriceMinor: newPrice.toString(),
      changePercent: company.changePercent,
      volume: tickVolume,
      circuitBreakerActive: company.circuitBreakerActive,
      timestamp: now.toISOString(),
    };

    // Store in-memory tick history
    const history = this.ticks.get(sym) || [];
    history.push(tickResult);
    if (history.length > 200) history.shift();
    this.ticks.set(sym, history);

    // Persist to Prisma DB if available
    if (this.prisma.isConnected) {
      try {
        await this.prisma.stockTicker.create({
          data: {
            symbol: sym,
            priceMinor: newPrice,
            volume: tickVolume,
            changePercent: company.changePercent,
            timestamp: now,
          },
        });
      } catch (err: any) {
        this.logger.debug(`Could not write tick to StockTicker: ${err.message}`);
      }
    }

    return tickResult;
  }

  /**
   * Generates a realistic Order Book depth ladder (5 bids and 5 asks) around current market price.
   */
  getOrderBookDepth(symbol: string): OrderBookDepthDto {
    const company = this.getCompanyState(symbol);
    const currentPrice = company.currentPriceMinor;

    const bids: OrderBookLevelDto[] = [];
    const asks: OrderBookLevelDto[] = [];

    // Step size based on stock price (approx 0.1% to 0.2%)
    const stepMinor = BigInt(Math.max(10, Math.round(Number(currentPrice) * 0.0015)));

    // 5 Bids below market price (descending)
    for (let i = 1; i <= 5; i++) {
      const levelPrice = currentPrice - stepMinor * BigInt(i);
      if (levelPrice > 0n) {
        const qty = 50 * i + (i % 2 === 0 ? 35 : 80);
        bids.push({
          priceMinor: levelPrice.toString(),
          quantity: qty,
          orderCount: Math.max(1, Math.floor(qty / 40)),
          totalMinor: (levelPrice * BigInt(qty)).toString(),
        });
      }
    }

    // 5 Asks above market price (ascending)
    for (let i = 1; i <= 5; i++) {
      const levelPrice = currentPrice + stepMinor * BigInt(i);
      const qty = 45 * i + (i % 2 === 0 ? 60 : 25);
      asks.push({
        priceMinor: levelPrice.toString(),
        quantity: qty,
        orderCount: Math.max(1, Math.floor(qty / 35)),
        totalMinor: (levelPrice * BigInt(qty)).toString(),
      });
    }

    const spreadMinor = asks.length > 0 && bids.length > 0
      ? (BigInt(asks[0].priceMinor) - BigInt(bids[0].priceMinor)).toString()
      : '0';

    return {
      symbol: company.symbol,
      currentPriceMinor: currentPrice.toString(),
      bids,
      asks,
      spreadMinor,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Updates company price directly after executed market trades.
   */
  updatePriceOnTrade(symbol: string, tradePriceMinor: bigint, tradeQty: number): void {
    const company = this.getCompanyState(symbol);
    company.currentPriceMinor = tradePriceMinor;
    company.volume += tradeQty;

    if (tradePriceMinor > company.dayHighMinor) {
      company.dayHighMinor = tradePriceMinor;
    }
    if (tradePriceMinor < company.dayLowMinor) {
      company.dayLowMinor = tradePriceMinor;
    }

    const changeDelta = Number(tradePriceMinor) - Number(company.openingPriceMinor);
    company.changePercent = Number(((changeDelta / Number(company.openingPriceMinor)) * 100).toFixed(2));
  }

  private mapToDto(c: CompanyState): StockCompanyDto {
    return {
      symbol: c.symbol,
      name: c.name,
      sector: c.sector,
      currentPriceMinor: c.currentPriceMinor.toString(),
      openingPriceMinor: c.openingPriceMinor.toString(),
      dayHighMinor: c.dayHighMinor.toString(),
      dayLowMinor: c.dayLowMinor.toString(),
      previousCloseMinor: c.previousCloseMinor.toString(),
      changePercent: c.changePercent,
      volume: c.volume,
      marketCapMinor: c.marketCapMinor.toString(),
      peRatio: c.peRatio,
      circuitLimitLowMinor: c.circuitLimitLowMinor.toString(),
      circuitLimitHighMinor: c.circuitLimitHighMinor.toString(),
      circuitBreakerActive: c.circuitBreakerActive,
      sharesOutstanding: c.sharesOutstanding,
      freeFloatPercent: c.freeFloatPercent,
      dividendYield: c.dividendYield,
      description: c.description,
      listedDate: c.listedDate,
      status: c.status,
    };
  }
}
