import prisma from "@/lib/prisma";
import FindingsClient from "./findings-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FindingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  
  const userId = session.user.id;

  // 1. Fetch dynamic stats scoped to the user
  const criticalSecrets = await prisma.finding.count({
    where: { 
      type: 'Secret', 
      severity: 'CRITICAL',
      scanResult: { pullRequest: { repository: { userId } } }
    }
  });
  
  const vulnerabilities = await prisma.finding.count({
    where: { 
      type: 'Vulnerability',
      scanResult: { pullRequest: { repository: { userId } } }
    }
  });

  const misconfigs = await prisma.finding.count({
    where: { 
      type: 'Misconfig',
      scanResult: { pullRequest: { repository: { userId } } }
    }
  });

  // 2. Fetch the actual findings for this user's repos
  const findings = await prisma.finding.findMany({
    where: {
      scanResult: { pullRequest: { repository: { userId } } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      scanResult: {
        include: { pullRequest: true }
      }
    }
  });

  const stats = { criticalSecrets, vulnerabilities, misconfigs };

  return <FindingsClient findings={findings} stats={stats} />;
}