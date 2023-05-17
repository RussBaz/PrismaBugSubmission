import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

function formatDifference(duration: number) {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60)
        .toFixed(0)
        .padStart(2, '0');
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
        .toFixed(0)
        .padStart(2, '0');
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
        .toFixed(0)
        .padStart(2, '0');

    return `${hours}:${minutes}:${seconds} hours / ${duration} ms`;
}

async function main() {
    const test = await prisma.test.create({ data: {} });
    const interval = test.dbNow.getTime() - test.prismaNow.getTime();
    const difference = formatDifference(interval);

    console.log(`Prisma now(): ${test.prismaNow}`);
    console.log(`Postgres now(): ${test.dbNow}`);
    console.log(`The difference: ${difference}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });