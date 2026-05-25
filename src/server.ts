import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}${config.apiPrefix}`);
  console.log('');
  console.log('📋 Mock Users:');
  console.log('  - Admin: admin@inventory.com / admin123');
  console.log('  - Operator: operator@inventory.com / operator123');
  console.log('  - Viewer: viewer@inventory.com / viewer123');
});
