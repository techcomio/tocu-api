# User
- [Get list User](#get-list-user)
- [Create an User](#create-an-user)
- [Login and get Token key](#login-and-get-token-key)


## Get list User

### Fields
| Property | Type | Description | Notes |
| --- | --- | --- | --- |
| `name` | String | Họ tên người dùng | 
| `mobilePhone` | String | Không trùng. | required
| `avatarUrl` | String | URL ảnh avatar |
| `isVerifyMobilePhone` | boolean | - | readonly, default is `false`
| `password` | String | - | required
| `token` | String | Mã bảo mật sử dụng trong việc Authentication | readonly
| `level` | Number | Cấp độ của user. Từ 0 tới 10. Số càng cao cấp user càng cao. Phần server chỉ phân cấp user theo số. Chuyển đổi thành các role: Admin, Sale, Registered là việc của client app (nếu muốn). Việc xác định vai trò bên dưới để ngầm hiểu xem user level này thì nên có những quyền gì. | default is `1`
| `point` | Number | Tích điểm khách hàng | -
| `coin` | Number | Tích xu khách hàng | -
| `city` | String | Tỉnh thành chọn từ danh sách | -
| `district` | String | Quận huyện chọn từ danh sách, sau khi đã chọn Tỉnh thành | -
| `districtIsUrban` | Boolean | Quận huyện này có phải Đô thị hay không? | -
| `createdBy` | Object | `{userId: String, name: String, avatarUrl: String}` | 
| `updatedBy` | Object | `{userId: String, name: String, avatarUrl: String}` | 
| `createdAt` | Date | - | default is `Date.now`
| `updatedAt` | Date | - | default is `Date.now`

## Create an User
    POST http://tocu-api-tranduchieu.c9.io/api/user
    
### Fields
| Name | Type | Description | Notes |
| --- | --- | --- | --- |
| `name` | String | Họ tên người dùng | 
| `mobilePhone` | String | Không trùng. | required
| `password` | String | - | required
| `city` | String | Tỉnh thành chọn từ danh sách | -
| `district` | String | Quận huyện chọn từ danh sách, sau khi đã chọn Tỉnh thành | -

### Example
    {
        "name": "Trần Đức Hiếu",
        "mobilePhone": "0904906903",
        "password": "123456",
        "city": "Tuyên Quang",
        "district": "Sơn Dương"
    }
    

## Login and get Token key
Người dùng đăng nhập & gửi request bằng `mobilePhone` & `password`, xác thực thành công hệ thống sẽ trả về thông tin của người dung, trong đó có Token key.

    POST http://tocu-api-tranduchieu.c9.io/api/token
    
### Fields

| Name | Type | Description | Notes |
| --- | --- | --- | --- |
| `mobilePhone` | String | - | required
| `password` | String | - | required

### Example

    POST http://tocu-api-tranduchieu.c9.io/api/token
    
    {
        "mobilePhone": "0904906903",
        "password": "123456"
    }
    
### Response

    {
      "_id": "556dd7fc9adf1788123c22e4",
      "avatarUrl": "1405747102718_198.jpg",
      "token": "odh6mj5givt07g52oun6scd56k02vijjn2rseard7imqrf917p93",
      "mobilePhone": "0904906903",
      "password": "$2a$10$NXyVX0SxYtU5VqWUvkIqN.3hNHVPbXYPSIjiMReIsL23H1.HY04Si",
      "name": "Trần Đức Hiếu",
      "company": "HT",
      "district": "Sơn Dương",
      "city": "Tuyên Quang",
      "__v": 0,
      "updatedAt": "2015-06-02T16:21:16.281Z",
      "createdAt": "2015-06-02T16:21:16.276Z",
      "districtIsUrban": false,
      "coin": 0,
      "point": 0,
      "isVerifyMobilePhone": false
    }