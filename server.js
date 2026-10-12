const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve tĩnh thư mục public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Pocket Calculator Server is running successfully!`);
  console.log(`👉 Access URL: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
```

---