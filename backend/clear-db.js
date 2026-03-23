const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  await p.candidateNote.deleteMany();
  await p.candidate.deleteMany();
  await p.auditLog.deleteMany();
  console.log('✅ All candidates, notes, and audit logs cleared!');
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
