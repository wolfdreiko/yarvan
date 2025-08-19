@echo off
echo Generating remaining NestJS services...

set SERVICES=geofence wallet compliance demand-engine notifications
set PORT=3007

for %%s in (%SERVICES%) do (
    echo Creating %%s service on port %PORT%...
    
    REM Create package.json
    (
        echo {
        echo   "name": "@yarvan/%%s",
        echo   "version": "1.0.0",
        echo   "scripts": {
        echo     "build": "nest build",
        echo     "start": "node dist/main",
        echo     "start:dev": "nest start --watch"
        echo   },
        echo   "dependencies": {
        echo     "@nestjs/common": "^10.0.0",
        echo     "@nestjs/core": "^10.0.0",
        echo     "@nestjs/platform-express": "^10.0.0",
        echo     "reflect-metadata": "^0.1.13",
        echo     "rxjs": "^7.8.1"
        echo   },
        echo   "devDependencies": {
        echo     "@nestjs/cli": "^10.0.0",
        echo     "@types/node": "^20.0.0",
        echo     "typescript": "^5.1.3"
        echo   }
        echo }
    ) > services\%%s\package.json
    
    set /a PORT+=1
)

echo Services generated successfully!