import {spawn} from 'child_process';

function startProcess(command, args, name) {
  const process = spawn(command, args, { stdio: 'inherit', shell: true });

  process.on('close', (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });
}

// Seeding
startProcess('npx', ['tsx', 'prisma/seed.ts'], 'Prisma seed');

// Start Next.js frontend
startProcess('npx', ['next', 'start'], 'Next.js');

// Start worker (compiled to JS)
startProcess('node', ['./dist/worker/scheduler.js'], 'Worker');
