@REM @echo off

start cmd /k "cd client && npm run dev"
start cmd /k "cd server && nodemon index.js"