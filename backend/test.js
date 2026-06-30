echo const fs = require('fs'); > test.js
echo const path = require('path'); >> test.js
echo const envPath = path.join(__dirname, '.env'); >> test.js
echo console.log('Looking for .env at:', envPath); >> test.js
echo if (fs.existsSync(envPath)) { >> test.js
echo   console.log('✅ .env file found'); >> test.js
echo   const content = fs.readFileSync(envPath, 'utf8'); >> test.js
echo   console.log('Content:', content); >> test.js
echo } else { >> test.js
echo   console.log('❌ .env file NOT found'); >> test.js
echo } >> test.js
echo require('dotenv').config({ path: envPath }); >> test.js
echo console.log('After dotenv:'); >> test.js
echo console.log('MQTT_HOST:', process.env.MQTT_HOST); >> test.js
echo console.log('MQTT_PORT:', process.env.MQTT_PORT); >> test.js