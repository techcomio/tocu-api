module.exports = {
  Cost: Cost,
};



function Cost(gram, city, isUrban) {

  if (charge(gram, city) === -1) {
    return -1;
  }

  var finalCost = totalCost(charge(gram, city));

  if (isUrban) {

    return Math.ceil(finalCost / 1000 - 0.5) * 1000;
  }

  // nếu không ở thành thị thì cộng thêm chi phí 20%
  finalCost = 1.2 * finalCost;

  return Math.ceil(finalCost / 1000 - 0.5) * 1000;
}


function charge(gram, city) {
  // check gram and city first
  if (col(city) === -1 || row(gram) === -1) {
    return -1;
  }

  return priceTable[row(gram) - 1][col(city) - 1];

}

// private function
function totalCost(charge) {

  // petrol Charge
  var petrol = charge * 0.2;

  // VAT
  var VAT = (charge + petrol) * 0.1;

  return charge + petrol + VAT;
}

var priceTable = [
  [8000, 8000, 8500, 10000, 9000, 9091],
  [8000, 11800, 12500, 14000, 13000, 13300],
  [10000, 16500, 18200, 23000, 21500, 22000],
  [12500, 23900, 25300, 29900, 28000, 28600],
  [16000, 33200, 34000, 43700, 40900, 41800],
  [19000, 40000, 41800, 56400, 52800, 53900],
  [21000, 48400, 51700, 68500, 64100, 65500],
];

var provices = {
  //NT
  'Hà Nội': 1,
  // 100 KM
  'Nam Định': 2,
  'Hà Nam': 2,
  'Hòa Bình': 2,
  'Hải Dương': 2,
  'Hải Phòng': 2,
  'Bắc Giang': 2,
  'Phú Thọ': 2,
  'Thái Nguyên': 2,

  // 300 KM
  'Nghệ An': 3,
  'Thanh Hóa': 3,
  'Ninh Bình': 3,
  'Quảng Ninh': 3,
  'Lạng Sơn': 3,
  'Tuyên Quang': 3,
  'Yên Bái': 3,
  'Bắc Cạn': 3,
  'Cao Bằng': 3,

  // more than 300KM
  'Hà Tĩnh': 4,
  'Quảng Bình': 4,
  'Quảng Trị': 4,
  'Thừa Thiên-Huế': 4,
  'Quảng Nam': 4,
  'Quảng Ngãi': 4,
  'Bình Định': 4,
  'Phú Yên': 4,
  'Khánh Hòa': 4,
  'Ninh Thuận': 4,
  'Bình Thuận': 4,
  'Kon Tum': 4,
  'Gia Lai': 4,
  'Đắk Lắk': 4,
  'Đắk Nông': 4,
  'Lâm Đồng': 4,
  'Bình Phước': 4,
  'Tây Ninh': 4,
  'Bình Dương': 4,
  'Đồng Nai': 4,
  'Bà Rịa-Vũng Tàu': 4,
  'Long An': 4,
  'Tiền Giang': 4,
  'Bến Tre': 4,
  'Trà Vinh': 4,
  'Vĩnh Long': 4,
  'Đồng Tháp': 4,
  'An Giang': 4,
  'Kiên Giang': 4,
  'Cần Thơ': 4,
  'Hậu Giang': 4,
  'Sóc Trăng': 4,
  'Bạc Liêu': 4,
  'Cà Mau': 4,
  'Sơn La': 4,
  'Điện Biên': 4,
  'Lai Châu': 4,
  'Lào Cai': 4,
  'Hà Giang': 4,



  // Đà Nẵng,

  'Đà Nẵng': 5,
  'Hồ Chí Minh': 6
};

function col(province) {
  if (provices[province]) {
    return provices[province];
  }
  return -1;
}

function row(gram) {
  if (gram < 0 || gram > 2000) {
    return -1;
  }

  if (gram < 51) {
    return 1;
  }


  if (gram < 101) {
    return 2;
  }


  if (gram < 251) {
    return 3;
  }

  if (gram < 501) {
    return 4;
  }


  if (gram < 1001) {
    return 5;
  }

  if (gram < 1501) {
    return 6;
  }

  if (gram < 2001) {
    return 7;
  }
}
