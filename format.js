// ===== ตัวช่วยจัดรูปแบบตัวเลขและวันที่ ใช้ร่วมกันทุกหน้า =====

// ยอดเงิน เช่น ฿5,700
function formatBaht(amount) {
  return '฿' + amount.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// วันที่แบบ พ.ศ. เช่น 12 ต.ค. 2569
function formatThaiDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('th-TH-u-ca-buddhist', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// จำนวนวันนับจากวันที่สั่งถึงวันนี้
function daysSince(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today - start) / 86400000);
}

// กันตัวอักษรพิเศษในข้อความ ไม่ให้กลายเป็นคำสั่งของหน้าเว็บ
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
