import prisma from "@/lib/prisma";
import DashboardClient from "./dashboard-client";
import { MOCK_CHART_DATA } from "@/lib/mock-data"; 
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  
  const userId = session.user.id;

  // 1. Fetch High-level Stats (Filtered by user's repositories)
  const totalScans = await prisma.scanResult.count({
    where: { pullRequest: { repository: { userId } } }
  });
  
  const blockedPRs = await prisma.pullRequest.count({ 
    where: { status: 'BLOCKED', repository: { userId } } 
  });
  
  const approvedPRs = await prisma.pullRequest.count({ 
    where: { status: 'PASS', repository: { userId } } 
  });
  
  const secretsDetected = await prisma.finding.count({ 
    where: { type: 'Secret', scanResult: { pullRequest: { repository: { userId } } } } 
  });

  // 2. Fetch Recent Pull Requests
  const recentPRs = await prisma.pullRequest.findMany({
    where: { repository: { userId } },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { repository: true }
  });

  // 3. Fetch Severity Distribution
  const critical = await prisma.finding.count({ 
    where: { severity: 'CRITICAL', scanResult: { pullRequest: { repository: { userId } } } } 
  });
  const high = await prisma.finding.count({ 
    where: { severity: 'HIGH', scanResult: { pullRequest: { repository: { userId } } } } 
  });
  const medium = await prisma.finding.count({ 
    where: { severity: 'MEDIUM', scanResult: { pullRequest: { repository: { userId } } } } 
  });
  const low = await prisma.finding.count({ 
    where: { severity: 'LOW', scanResult: { pullRequest: { repository: { userId } } } } 
  });

  const stats = { totalScans, blockedPRs, approvedPRs, secretsDetected };
  const distribution = { critical, high, medium, low };

  return (
    <DashboardClient 
      stats={stats} 
      prs={recentPRs} 
      distribution={distribution} 
      chartData={MOCK_CHART_DATA} 
    />
  );
}