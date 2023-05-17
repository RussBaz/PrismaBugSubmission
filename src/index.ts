import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

function formatDifference(duration: number) {
    const seconds = Math.floor((duration / 1000) % 60)
        .toFixed(0)
        .padStart(2, '0');
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
        .toFixed(0)
        .padStart(2, '0');
    const hours = Math.floor(duration / (1000 * 60 * 60))
        .toFixed(0)
        .padStart(2, '0');

    return `${hours}:${minutes}:${seconds} hours / ${duration} ms`;
}

async function main() {
    const test = await prisma.test.create({ data: {} });
    const interval = test.dbNow.getTime() - test.prismaNow.getTime();
    const difference = formatDifference(interval);

    console.log('Testing default');
    console.log(`Prisma now(): ${test.prismaNow}`);
    console.log(`Postgres now(): ${test.dbNow}`);
    console.log(`The difference: ${difference}`);

    const manual = await prisma.test.create({
        data: {
            prismaNow: new Date()
        }
    });

    const intervalManual = manual.dbNow.getTime() - manual.prismaNow.getTime();
    const differenceManual = formatDifference(intervalManual);

    console.log('Testing manual');
    console.log(`Manual: ${manual.prismaNow}`);
    console.log(`Postgres now(): ${manual.dbNow}`);
    console.log(`The difference: ${differenceManual}`);

    const manual2 = await prisma.test.create({
        data: {
            prismaNow: new Date(),
            dbNow: new Date()
        }
    });

    const intervalManual2 = manual2.dbNow.getTime() - manual2.prismaNow.getTime();
    const differenceManual2 = formatDifference(intervalManual2);

    console.log('Manually assigning both properties');
    console.log(`Manual: ${manual2.prismaNow}`);
    console.log(`Postgres now(): ${manual2.dbNow}`);
    console.log(`The difference: ${differenceManual2}`);
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
