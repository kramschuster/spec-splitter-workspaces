# Node 22.6+ so `node smoke.ts` can run TypeScript with type stripping.
# Cursor checks out the branch itself. Do not COPY the project into this image.
FROM node:22-slim
RUN node -e "const [maj,min]=process.versions.node.split('.').map(Number); if (maj<22 || (maj===22 && min<6)) process.exit(1)"
