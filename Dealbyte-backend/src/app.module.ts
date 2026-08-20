import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { RateCardsModule } from './rate-cards/rate-cards.module';
import { DealsModule } from './deals/deals.module';
import { CostingModule } from './costing/costing.module';
import { QuotesModule } from './quotes/quotes.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ContentLibraryModule } from './content-library/content-library.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ClientsModule } from './clients/clients.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ─── Infrastructure ─────────────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,

    // ─── Auth & Users ───────────────────────────────────────────────────
    AuthModule,
    UsersModule,

    // ─── Core Business ──────────────────────────────────────────────────
    ServicesModule,
    RateCardsModule,
    DealsModule,
    CostingModule,
    QuotesModule,
    ApprovalsModule,
    ClientsModule,
    AuditLogsModule,

    // ─── Content & Proposals ────────────────────────────────────────────
    ContentLibraryModule,
    ProposalsModule,

    // ─── Analytics & Config ─────────────────────────────────────────────
    DashboardModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
