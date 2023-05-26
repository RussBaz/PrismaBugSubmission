import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

function formatDifference(durationInMs: number) {
    const seconds = Math.floor((durationInMs / 1000) % 60)
        .toFixed(0)
        .padStart(2, '0');
    const minutes = Math.floor((durationInMs / (1000 * 60)) % 60)
        .toFixed(0)
        .padStart(2, '0');
    const hours = Math.floor(durationInMs / (1000 * 60 * 60))
        .toFixed(0)
        .padStart(2, '0');

    return `${hours}:${minutes}:${seconds} hours / ${durationInMs} ms`;
}

async function main() {
    const test = await prisma.test.create({ data: {} });
    const interval = test.dbNow.getTime() - test.prismaNow.getTime();
    const difference = formatDifference(interval);

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = formatDifference(new Date().getTimezoneOffset() * 60 * 1000);

    const dbTzResult: any[] = await prisma.$queryRaw(Prisma.sql`show timezone`);
    const dbTzValue: any = dbTzResult.length > 0 ? dbTzResult[0] : undefined;
    const dbTz = dbTzValue?.TimeZone || 'Unknown';

    console.log('Current node.js offset:', offset);
    console.log('Current node/js timezone:', tz);
    console.log('DB timezone:', dbTz, '\n');

    console.log('1. Testing default');
    console.log(`Prisma now(): ${test.prismaNow}`);
    console.log(`Postgres now(): ${test.dbNow}`);
    console.log(`The difference: ${difference}\n`);

    const manual = await prisma.test.create({
        data: {
            prismaNow: new Date()
        }
    });

    const intervalManual = manual.dbNow.getTime() - manual.prismaNow.getTime();
    const differenceManual = formatDifference(intervalManual);

    console.log('2. Testing manual');
    console.log(`Manual: ${manual.prismaNow}`);
    console.log(`Postgres now(): ${manual.dbNow}`);
    console.log(`The difference: ${differenceManual}\n`);

    const manual2 = await prisma.test.create({
        data: {
            prismaNow: new Date(),
            dbNow: new Date()
        }
    });

    const intervalManual2 = manual2.dbNow.getTime() - manual2.prismaNow.getTime();
    const differenceManual2 = formatDifference(intervalManual2);

    console.log('3. Manually assigning both properties');
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
