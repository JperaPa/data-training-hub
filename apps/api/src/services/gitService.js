import { exec } from "child_process";

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) reject(stderr);
      else resolve(stdout);
    });
  });
}

export const gitService = {
  status: () => run("git status --short"),
  pull: () => run("git pull origin main"),
  add: () => run("git add ."),
  commit: (msg) => run(`git commit -m "${msg}"`),
  push: () => run("git push origin main"),
  sync: async () => {
    await run("git add .");
    await run(`git commit -m "sync" || true`);
    return run("git push origin main");
  }
};
