# Model
API quản lý thông tin người mẫu của Shop

## List all Model
Get & list toàn bộ Mẫu

    GET http://api-dev.tocu.vn/model


### Example

    GET http://api-dev.tocu.vn/model


### Response

    [
      {
        "id": 1,
        "name": "Trần Thùy Dương",
        "height": 165,
        "weight": 50,
        "bust": 87,
        "waist": 67,
        "hip": 90,
        "createdAt": "2015-06-23T16:24:01.942Z",
        "updatedAt": "2015-06-23T16:24:01.942Z"
      }
    ]


## Create a Model
Tạo một Model

    POST http://api-dev.tocu.vn/model

### Fields
| Name | Type | Description |
| --- | --- | --- | --- |
| `name` | String | Tên mẫu |
| `height` | Integer | Chiều cao |
| `weight` | Integer | Cân nặng |
| `bust` | Integer | Vòng 1 |
| `waist` | Integer | Vòng 2 |
| `hip` | Integer | Vòng 3 |

### Example

    POST http://api-dev.tocu.vn/model

    {
        "name": "Trần Thùy Dương",
        "height": 165,
        "weight": 50,
        "bust": 87,
        "waist": 67,
        "hip": 90,
    }

### Response
    {
      "id": 1,
      "name": "Trần Thùy Dương",
      "height": 165,
      "weight": 50,
      "bust": 87,
      "waist": 67,
      "hip": 90,
      "createdAt": "2015-06-23T16:24:01.942Z",
      "updatedAt": "2015-06-23T16:24:01.942Z"
    }
