// State Machine Management
const state = {
  currentValue: '0',
  previousValue: null,
  operation: null,
  isCalculated: false,
  expression: ''
};

// UI Selectors
const expDisplay = document.getElementById('display-expression');
const resDisplay = document.getElementById('display-result');
const themeToggle = document.getElementById('theme-toggle');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Lấy danh sách lịch sử từ LocalStorage
let calcHistory = JSON.parse(localStorage.getItem('calc_history')) || [];

// Khởi chạy ứng dụng
init();

function init() {
  updateDisplay();
  renderHistory();
  setupEventListeners();
  loadSavedTheme();
}

// Thiết lập tất cả Event Listeners
function setupEventListeners() {
  // Lắng nghe click các nút trên bàn phím ảo
  document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
      const value = key.getAttribute('data-value');
      const action = key.getAttribute('data-action');
      
      if (value !== null) {
        handleNumber(value);
      } else if (action !== null) {
        handleAction(action);
      }
      updateDisplay();
    });
  });

  // Đổi Theme sáng/tối
  themeToggle.addEventListener('click', toggleTheme);

  // Xóa lịch sử
  clearHistoryBtn.addEventListener('click', clearHistory);

  // Lắng nghe Keyboard vật lý
  document.addEventListener('keydown', handlePhysicalKeyboard);
}

// Xử lý sự kiện bàn phím ảo - Số
function handleNumber(num) {
  if (state.isCalculated) {
    state.currentValue = num;
    state.isCalculated = false;
  } else {
    if (state.currentValue === '0') {
      state.currentValue = num;
    } else {
      state.currentValue += num;
    }
  }
}

// Xử lý sự kiện bàn phím ảo - Action
function handleAction(action) {
  switch (action) {
    case 'clear':
      resetCalculator();
      break;
    case 'delete':
      deleteLastDigit();
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'percent':
      calculatePercentage();
      break;
    case 'toggle-sign':
      toggleNumberSign();
      break;
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      setOperator(action);
      break;
    case 'calculate':
      triggerCalculation();
      break;
  }
}

// Nhập dấu thập phân an toàn
function inputDecimal() {
  if (state.isCalculated) {
    state.currentValue = '0.';
    state.isCalculated = false;
    return;
  }
  if (!state.currentValue.includes('.')) {
    state.currentValue += '.';
  }
}

// Đổi dấu số âm/dương
function toggleNumberSign() {
  if (state.currentValue === '0' || state.currentValue === 'Error: Division by zero') return;
  if (state.currentValue.startsWith('-')) {
    state.currentValue = state.currentValue.substring(1);
  } else {
    state.currentValue = '-' + state.currentValue;
  }
}

// Tính phần trăm nhanh
function calculatePercentage() {
  if (state.currentValue === 'Error: Division by zero') return;
  const val = parseFloat(state.currentValue);
  state.currentValue = safeFloatCalc(val, 100, '/').toString();
}

// Xóa lùi 1 ký tự
function deleteLastDigit() {
  if (state.isCalculated || state.currentValue === 'Error: Division by zero') {
    resetCalculator();
    return;
  }
  if (state.currentValue.length > 1) {
    state.currentValue = state.currentValue.slice(0, -1);
  } else {
    state.currentValue = '0';
  }
}

// Thiết lập toán tử
function setOperator(op) {
  if (state.currentValue === 'Error: Division by zero') return;
  
  if (state.operation && !state.isCalculated) {
    triggerCalculation();
  }
  
  state.previousValue = state.currentValue;
  state.operation = op;
  state.isCalculated = false;
  
  const opSymbols = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
  state.expression = `${state.previousValue} ${opSymbols[op]}`;
  state.currentValue = '0';
}

// Kích hoạt tính toán kết quả
function triggerCalculation() {
  if (!state.operation || state.previousValue === null) return;
  
  const prev = parseFloat(state.previousValue);
  const current = parseFloat(state.currentValue);
  
  if (state.operation === 'divide' && current === 0) {
    state.currentValue = 'Error: Division by zero';
    state.expression = '';
    state.previousValue = null;
    state.operation = null;
    state.isCalculated = true;
    return;
  }
  
  const opSymbols = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
  const result = safeFloatCalc(prev, current, state.operation);
  
  const fullExp = `${state.previousValue} ${opSymbols[state.operation]} ${state.currentValue}`;
  state.expression = `${fullExp} =`;
  
  // Lưu lịch sử
  saveToHistory(fullExp, result);
  
  state.currentValue = result.toString();
  state.previousValue = null;
  state.operation = null;
  state.isCalculated = true;
}

// Phép toán số học an toàn tránh lỗi dấu phẩy động
function safeFloatCalc(a, b, op) {
  let res = 0;
  switch (op) {
    case 'add':
    case '+':
      res = a + b;
      break;
    case 'subtract':
    case '-':
      res = a - b;
      break;
    case 'multiply':
    case '*':
      res = a * b;
      break;
    case 'divide':
    case '/':
      res = a / b;
      break;
  }
  // Giới hạn độ dài thập phân tránh số vô hạn tuần hoàn
  return parseFloat(res.toFixed(10));
}

// Xóa sạch toàn bộ
function resetCalculator() {
  state.currentValue = '0';
  state.previousValue = null;
  state.operation = null;
  state.isCalculated = false;
  state.expression = '';
}

// Đồng bộ giao diện Screen
function updateDisplay() {
  expDisplay.textContent = state.expression;
  resDisplay.textContent = state.currentValue;
  
  // Tự động điều chỉnh kích thước chữ nếu hiển thị quá dài
  const len = state.currentValue.length;
  if (len > 12) {
    resDisplay.style.fontSize = '1.4rem';
  } else if (len > 8) {
    resDisplay.style.fontSize = '1.8rem';
  } else {
    resDisplay.style.fontSize = '2.2rem';
  }
}

// Quản lý lịch sử và LocalStorage
function saveToHistory(expr, result) {
  const newItem = { expr, result };
  calcHistory.unshift(newItem); // Đưa lên đầu danh sách
  if (calcHistory.length > 10) calcHistory.pop(); // Giữ tối đa 10 dòng
  localStorage.setItem('calc_history', JSON.stringify(calcHistory));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  if (calcHistory.length === 0) {
    historyList.innerHTML = '<p class="empty-msg">Chưa có phép tính nào.</p>';
    return;
  }
  
  calcHistory.forEach((item, idx) => {
    const div = document.createElement('div');
    div.classList.add('history-item');
    div.innerHTML = `
      <div class="history-item-exp">${item.expr}</div>
      <div class="history-item-res">${item.result}</div>
    `;
    div.addEventListener('click', () => {
      state.currentValue = item.result.toString();
      state.expression = '';
      state.isCalculated = true;
      updateDisplay();
    });
    historyList.appendChild(div);
  });
}

function clearHistory() {
  calcHistory = [];
  localStorage.removeItem('calc_history');
  renderHistory();
}

// Theme Toggle
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', targetTheme);
  themeToggle.textContent = targetTheme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('calc_theme', targetTheme);
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('calc_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

// Hỗ trợ Keyboard vật lý
function handlePhysicalKeyboard(e) {
  const key = e.key;
  
  // Ánh xạ phím vật lý vào bộ xử lý
  if (/[0-9]/.test(key)) {
    handleNumber(key);
    triggerButtonActiveState(key);
  } else if (key === '.') {
    handleAction('decimal');
    triggerButtonActiveState('decimal');
  } else if (key === '+') {
    handleAction('add');
    triggerButtonActiveState('add');
  } else if (key === '-') {
    handleAction('subtract');
    triggerButtonActiveState('subtract');
  } else if (key === '*') {
    handleAction('multiply');
    triggerButtonActiveState('multiply');
  } else if (key === '/') {
    e.preventDefault();
    handleAction('divide');
    triggerButtonActiveState('divide');
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    handleAction('calculate');
    triggerButtonActiveState('calculate');
  } else if (key === 'Backspace') {
    handleAction('delete');
    triggerButtonActiveState('delete');
  } else if (key === 'Escape') {
    handleAction('clear');
    triggerButtonActiveState('clear');
  } else if (key === '%') {
    handleAction('percent');
    triggerButtonActiveState('percent');
  }
  updateDisplay();
}

// Hiển thị hiệu ứng nhấn nút khi gõ phím vật lý
function triggerButtonActiveState(action) {
  let targetBtn;
  if (/[0-9]/.test(action)) {
    targetBtn = Array.from(document.querySelectorAll('.btn-number')).find(btn => btn.textContent === action);
  } else {
    targetBtn = document.getElementById(`key-${action}`);
  }
  
  if (targetBtn) {
    targetBtn.classList.add('active-press');
    setTimeout(() => targetBtn.classList.remove('active-press'), 120);
  }
}
```

---