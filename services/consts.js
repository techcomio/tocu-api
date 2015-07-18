var consts = {
  'kRoleAdmin': 'admin',
  'kRoleCustomer': 'customer',
  'kRoleStaff': 'staff',
  'requiredFieldsUser': ['firstName', 'lastName', 'email', 'mobilePhone', 'password', 'confirmPassword'],
  'kDefaultItemsPage': 0,
  'kDefaultItemsPerPage': 10,

  // ListOfCity
  'city': ['Hà Nội', 'TP Hồ Chí Minh', 'An Giang', 'Bà Rịa - Vũng Tàu', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Bình Định', 'Bạc Liêu', 'Bắc Giang', 'Bắc Kạn', 'Bắc Ninh', 'Bến Tre', 'Cao Bằng', 'Cà Mau', 'Cần Thơ', 'Gia Lai', 'Hòa Bình', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hưng Yên', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Long An', 'Lào Cai', 'Lâm Đồng', 'Lạng Sơn', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Thanh Hóa', 'Thái Bình', 'Thái Nguyên', 'Thừa Thiên - Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Tây Ninh', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái', 'Điện Biên', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Đồng Nai', 'Đồng Tháp'],

  'districtsDirectShipping': {
    'Hoàn Kiếm': true,
    'Hai Bà Trưng': true,
    'Hoàng Mai': true,
    'Ba Đình': true,
    'Đống Đa': true,
    'Tây Hồ': true,
    'Cầu Giấy': true,
    'Thanh Xuân': true,
  },

  // Stores
  'stores': [{
    'name': 'Tổ Cú Online',
    'code': 'ol'
  }, {
    'name': 'Tổ Cú Hoàng Quốc Việt',
    'code': 'hqv'
  }, {
    'name': 'Tổ Cú Minh Khai',
    'code': 'mk'
  }]
};

module.exports = consts;
