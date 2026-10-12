// ===== ส่วนเก็บข้อมูลคำสั่งซื้อ =====
// รอบแรกเก็บไว้ในเบราว์เซอร์ (localStorage)
// ช่วงบ่ายจะเปลี่ยนไฟล์นี้ไฟล์เดียวให้ไปอ่าน/เขียนที่ Supabase แทน
// ทุกฟังก์ชันเป็นแบบ async ไว้ก่อน เพื่อให้หน้าอื่นไม่ต้องแก้ตอนเปลี่ยนไปใช้ Supabase

const STORAGE_KEY = 'amata-orders-v1';

const STATUS_LABELS = {
  pending: 'รอส่ง',
  shipped: 'ส่งแล้ว',
  paid: 'ชำระแล้ว',
};

// รายชื่อร้านค้า (สมมติ)
const SHOPS = [
  'ร้านหนังสือทุ่งทานตะวัน',
  'ร้านหนังสือนกกระจิบ',
  'ร้านหนังสือบ้านกระดาษสา',
  'ร้านหนังสือมุมอ่านเงียบ',
  'ร้านหนังสือเรือนไม้สัก',
];

// รายชื่อหนังสือและราคาต่อเล่ม (สมมติ)
const BOOKS = [
  { title: 'เงาจันทร์บนผืนทราย',        price: 285 },
  { title: 'คู่มือปลูกผักบนระเบียง',      price: 350 },
  { title: 'ตำรับอาหารบ้านริมน้ำ',       price: 450 },
  { title: 'บันทึกนักเดินทางผู้หลงทาง',   price: 265 },
  { title: 'ปริศนาตะเกียงทองเหลือง',     price: 275 },
  { title: 'เมืองที่ไม่มีนาฬิกา',         price: 299 },
  { title: 'สวนลับของคุณยาย',          price: 320 },
];

// วันที่ย้อนหลังจากวันนี้ N วัน ในรูปแบบ ปปปป-ดด-วว (ค.ศ. ตามมาตรฐานฐานข้อมูล)
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// ข้อมูลตัวอย่าง (สมมติทั้งหมด)
function sampleOrders() {
  return [
    { id: 1,  order_no: 'อม-001', shop_name: 'ร้านหนังสือนกกระจิบ',     book_title: 'เงาจันทร์บนผืนทราย',          quantity: 20, unit_price: 285, order_date: daysAgo(58), status: 'shipped' },
    { id: 2,  order_no: 'อม-002', shop_name: 'ร้านหนังสือเรือนไม้สัก',    book_title: 'สวนลับของคุณยาย',            quantity: 15, unit_price: 320, order_date: daysAgo(52), status: 'paid' },
    { id: 3,  order_no: 'อม-003', shop_name: 'ร้านหนังสือทุ่งทานตะวัน',   book_title: 'ตำรับอาหารบ้านริมน้ำ',         quantity: 10, unit_price: 450, order_date: daysAgo(47), status: 'shipped' },
    { id: 4,  order_no: 'อม-004', shop_name: 'ร้านหนังสือมุมอ่านเงียบ',   book_title: 'บันทึกนักเดินทางผู้หลงทาง',     quantity: 25, unit_price: 265, order_date: daysAgo(41), status: 'paid' },
    { id: 5,  order_no: 'อม-005', shop_name: 'ร้านหนังสือนกกระจิบ',     book_title: 'เมืองที่ไม่มีนาฬิกา',           quantity: 30, unit_price: 299, order_date: daysAgo(36), status: 'pending' },
    { id: 6,  order_no: 'อม-006', shop_name: 'ร้านหนังสือบ้านกระดาษสา',  book_title: 'คู่มือปลูกผักบนระเบียง',        quantity: 12, unit_price: 350, order_date: daysAgo(28), status: 'shipped' },
    { id: 7,  order_no: 'อม-007', shop_name: 'ร้านหนังสือเรือนไม้สัก',    book_title: 'เมืองที่ไม่มีนาฬิกา',           quantity: 18, unit_price: 299, order_date: daysAgo(21), status: 'paid' },
    { id: 8,  order_no: 'อม-008', shop_name: 'ร้านหนังสือมุมอ่านเงียบ',   book_title: 'เงาจันทร์บนผืนทราย',          quantity: 40, unit_price: 285, order_date: daysAgo(14), status: 'shipped' },
    { id: 9,  order_no: 'อม-009', shop_name: 'ร้านหนังสือทุ่งทานตะวัน',   book_title: 'สวนลับของคุณยาย',            quantity: 8,  unit_price: 320, order_date: daysAgo(7),  status: 'pending' },
    { id: 10, order_no: 'อม-010', shop_name: 'ร้านหนังสือบ้านกระดาษสา',  book_title: 'ปริศนาตะเกียงทองเหลือง',       quantity: 22, unit_price: 275, order_date: daysAgo(2),  status: 'pending' },
  ];
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // อ่านไม่ได้ ให้ใช้ข้อมูลตัวอย่างแทน
  }
  const orders = sampleOrders();
  writeStore(orders);
  return orders;
}

function writeStore(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    // บันทึกไม่ได้ (เช่น เบราว์เซอร์ปิดการเก็บข้อมูล) หน้าเว็บยังแสดงผลได้ตามปกติ
  }
}

// ดึงคำสั่งซื้อทั้งหมด เรียงจากวันที่สั่งล่าสุดก่อน
async function getOrders() {
  return readStore()
    .slice()
    .sort((a, b) => b.order_date.localeCompare(a.order_date) || b.id - a.id);
}

async function getShops() {
  return SHOPS.slice();
}

async function getBooks() {
  return BOOKS.slice();
}

// เปลี่ยนสถานะคำสั่งซื้อ (pending / shipped / paid)
async function updateStatus(id, status) {
  const orders = readStore();
  const order = orders.find((o) => o.id === id);
  if (!order || !STATUS_LABELS[status]) return null;
  order.status = status;
  writeStore(orders);
  return order;
}

// เพิ่มคำสั่งซื้อใหม่ สถานะเริ่มต้นเป็น "รอส่ง" และวันที่สั่งเป็นวันนี้
// ส่งคืนคำสั่งซื้อที่บันทึกแล้ว (มีเลขที่และ id)
async function addOrder({ shop_name, book_title, quantity, unit_price }) {
  const orders = readStore();
  const nextId = orders.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  const order = {
    id: nextId,
    order_no: 'อม-' + String(nextId).padStart(3, '0'),
    shop_name,
    book_title,
    quantity,
    unit_price,
    order_date: daysAgo(0),
    status: 'pending',
  };
  orders.push(order);
  writeStore(orders);
  return order;
}
