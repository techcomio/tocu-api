# District
API giúp tìm một Quận huyện hoặc tìm danh sách Quận huyện trong một Tỉnh thành.

## Find list District by City
Tìm danh sách Quận huyện trong một Tỉnh thành.

    POST http://tocu-api-tranduchieu.c9.io/api/district

### Fields
| Name | Type | Description | Notes |
| --- | --- | --- | --- |
| `city` | String | Tên Tỉnh thành |

### Example

    {
        "city": "Tuyên Quang"
    }

### Response

    [
      {
        "id": 121,
        "name": "Chiêm Hóa",
        "city": "Tuyên Quang",
        "isUrban": false
      },
      {
        "id": 247,
        "name": "Hàm Yên",
        "city": "Tuyên Quang",
        "isUrban": false
      },
      {
        "id": 330,
        "name": "Lâm Bình",
        "city": "Tuyên Quang",
        "isUrban": false
      },
      {
        "id": 386,
        "name": "Na Hang",
        "city": "Tuyên Quang",
        "isUrban": false
      },
      {
        "id": 518,
        "name": "Sơn Dương",
        "city": "Tuyên Quang",
        "isUrban": false
      },
      {
        "id": 644,
        "name": "Tuyên Quang",
        "city": "Tuyên Quang",
        "isUrban": true
      },
      {
        "id": 706,
        "name": "Yên Sơn",
        "city": "Tuyên Quang",
        "isUrban": false
      }
    ]


## Find a District
Tìm chính xác một Quận huyện dựa vào tên Tỉnh thành & tên Quận huyện.

    POST http://tocu-api-tranduchieu.c9.io/api/district

### Fields
| Name | Type | Description | Notes |
| --- | --- | --- | --- |
| `city` | String | Tên Tỉnh thành |
| `district` | String | Tên Quận huyện |

### Example

    {
        "city": "Tuyên Quang",
        "district": "Sơn Dương"
    }

### Response
    {
        "id": 518
        "name": "Sơn Dương",
        "city": "Tuyên Quang",
        "isUrban": false
    }
